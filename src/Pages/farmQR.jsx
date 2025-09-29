import React, { useEffect, useState, useRef } from "react";
import QRCode from "react-qr-code";
import Header from "../Components/Header";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
import "../Styles/farmQR.css";

const FarmerQR = () => {
  const navigate = useNavigate();
  const [crop, setCrop] = useState(null);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const storedCrop = localStorage.getItem("latestCrop");
    if (storedCrop) setCrop(JSON.parse(storedCrop));
  }, []);

  const handleClickQR = () => {
    if (crop) {
      localStorage.setItem("scannedData", JSON.stringify({ crop }));
      navigate("/scanned");
    }
  };

  // NEW: Handler for downloading the QR code
  const handleDownloadQR = () => {
    if (!crop) {
      alert("No crop data available to generate QR code.");
      return;
    }

    const svgElement = qrCodeRef.current.querySelector("svg");
    if (svgElement) {
      // 1. Convert the SVG element to an XML string
      const svgData = new XMLSerializer().serializeToString(svgElement);
      
      // 2. Create a Blob and a data URL
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      // 3. Create and trigger a temporary download link
      const link = document.createElement("a");
      link.href = url;
      // Define a dynamic file name
      const fileName = `${crop.cropName || 'FarmData'}-${crop.batchNumber || 'QR'}.png`;
      link.download = fileName; 
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); 
    }
  };

  return (
    <div className="container">
      <Header title="Farmer - QR Code" />
      <div className="content">
        <div className="qrbox">
          <div
            className="qr"
            ref={qrCodeRef} 
            onClick={handleClickQR}
            style={{ cursor: "pointer" }}
          >
            {crop ? (
              <QRCode value={JSON.stringify({ crop })} size={250} />
            ) : (
              <p>No crop data found</p>
            )}
          </div>
          <h5>Download and Print this QR Code and paste on the product</h5>
        </div>
        <Button 
          title="Download & Print" 
          onClick={handleDownloadQR} 
          disabled={!crop} 
        />
      </div>
    </div>
  );
};

export default FarmerQR;
