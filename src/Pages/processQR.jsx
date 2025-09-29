import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import Header from "../Components/Header";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
import "../Styles/farmQR.css";

const ProcessorQR = () => {
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const [product, setProduct] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const storedCrop = localStorage.getItem("latestCrop");
    const storedProduct = localStorage.getItem("latestProduct");
    if (storedCrop) setCrop(JSON.parse(storedCrop));
    if (storedProduct) setProduct(JSON.parse(storedProduct));
  }, []);

  const handleClickQR = () => {
    if (crop && product) {
      localStorage.setItem("scannedData", JSON.stringify({ crop, product }));
      navigate("/scanned");
    }
  };

  const handleDownloadQR = () => {
    if (!crop || !product) {
      alert("No crop or product data available to generate QR code.");
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
      link.download = `${crop.cropName || "Crop"}-${product.productName || "Product"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="container">
      <Header title="Processor - QR Code" />
      <div className="content">
        <div className="qrbox">
          <div
            className="qr"
            ref={qrCodeRef} // attach ref here
            onClick={handleClickQR}
            style={{ cursor: "pointer" }}
          >
            {crop && product ? (
              <QRCode value={JSON.stringify({ crop, product })} size={250} />
            ) : (
              <p>No crop/product data found</p>
            )}
          </div>
          <h5>Download and Print this QR Code and paste on the product</h5>
        </div>
        <Button
          title="Download & Print"
          onClick={handleDownloadQR}
          disabled={!crop || !product}
        />
      </div>
    </div>
  );
};

export default ProcessorQR;
