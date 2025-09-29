import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import Header from "../Components/Header";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
import "../Styles/farmQR.css";

const RetailQR = () => {
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [product, setProduct] = useState(null);
  const [arrival, setArrival] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const storedCrop = localStorage.getItem("latestCrop");
    const storedProduct = localStorage.getItem("latestProduct");
    const storedArrival = localStorage.getItem("latestArrival");
    if (storedCrop) setCrop(JSON.parse(storedCrop));
    if (storedProduct) setProduct(JSON.parse(storedProduct));
    if (storedArrival) setArrival(JSON.parse(storedArrival));
  }, []);

  const handleClickQR = () => {
    if (crop && product && arrival) {
      const fullData = { crop, product, arrival };
      localStorage.setItem("scannedData", JSON.stringify(fullData));
      navigate("/costumer");
    }
  };

  const handleDownloadQR = () => {
    if (!crop || !product || !arrival) {
      alert("No complete data available to generate QR code.");
      return;
    }

    const svgElement = qrCodeRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${crop.cropName || "Crop"}-${product.productName || "Product"}-${arrival.batchNumber || "Arrival"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="container">
      <Header title="Retailer - QR Code" />
      <div className="content">
        <div className="qrbox">
          <div
            className="qr"
            ref={qrCodeRef}
            onClick={handleClickQR}
            style={{ cursor: "pointer" }}
          >
            {crop && product && arrival ? (
              <QRCode value={JSON.stringify({ crop, product, arrival })} size={250} />
            ) : (
              <p>No complete data found</p>
            )}
          </div>
          <h5>Download and Print this QR Code and paste on the product</h5>
        </div>
        <Button
          title="Download & Print"
          onClick={handleDownloadQR}
          disabled={!crop || !product || !arrival}
        />
      </div>
    </div>
  );
};

export default RetailQR;
