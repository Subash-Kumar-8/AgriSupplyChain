import React, { useState } from "react";
import "../Styles/farmInput.css";
import Header from "../Components/Header";
import Button from "../Components/Button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import CROP_REGISTRY_ABI from "../abis/CropRegistry.json";

const CROP_REGISTRY_ADDRESS = "0x9de63ca7dcb7378710ea9707d43780d9630f4982";

// Component for picking location
const LocationPicker = ({ setLocation }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocation(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const FarmInput = () => {
  const navigate = useNavigate();

  // Form state
  const [cropName, setCropName] = useState("");
  const [cropVariety, setCropVariety] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [transportDate, setTransportDate] = useState("");
  const [quality, setQuality] = useState("");
  const [location, setLocation] = useState(null);

  const [status, setStatus] = useState("");

  // Submit handler
  const handleSubmit = async () => {
    if (!window.ethereum) {
      alert("❌ MetaMask not detected! Please install it.");
      return;
    }

    try {
      setStatus("🔗 Connecting to wallet...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CROP_REGISTRY_ADDRESS,
        CROP_REGISTRY_ABI,
        signer
      );

      // Convert dates → UNIX timestamps
      const harvestTimestamp = harvestDate
        ? Math.floor(new Date(harvestDate).getTime() / 1000)
        : 0;

      const transportTimestamp = transportDate
        ? Math.floor(new Date(transportDate).getTime() / 1000)
        : 0;

      const locationStr = location ? `${location.lat},${location.lng}` : "N/A";

      setStatus("⏳ Submitting transaction...");

      const tx = await contract.addCropBatch(
        cropName,
        cropVariety,
        batchNumber,
        harvestTimestamp,
        transportTimestamp,
        quality,
        locationStr
      );

      await tx.wait();

      // Save to localStorage for demo + QR flow
      const cropData = {
        cropName,
        cropVariety,
        batchNumber,
        harvestDate,
        transportDate,
        quality,
        locationStr,
      };
      localStorage.setItem("latestCrop", JSON.stringify(cropData));

      setStatus("✅ Transaction confirmed & crop saved!");
      navigate("/farmqr");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + (err.message || err));
    }
  };

  return (
    <div className="container">
      <div className="header">
        <Header title="Hi Farmer" link1="Processor" link2="Retailer" />
      </div>

      <div className="content">
        {/* Form Fields */}
        <div className="formField">
          <div className="form">
            <span>Crop Name</span>
            <input
              type="text"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
            />
          </div>

          <div className="form">
            <span>Crop Variety</span>
            <input
              type="text"
              value={cropVariety}
              onChange={(e) => setCropVariety(e.target.value)}
            />
          </div>

          <div className="form">
            <span>Batch Number</span>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
            />
          </div>

          <div className="form">
            <span>Harvest Date</span>
            <input
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
            />
          </div>

          <div className="form">
            <span>Transport Date</span>
            <input
              type="date"
              value={transportDate}
              onChange={(e) => setTransportDate(e.target.value)}
            />
          </div>

          <div className="form">
            <span>Quality</span>
            <input
              type="text"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            />
          </div>
        </div>

        {/* Map Picker */}
        <div className="loc">
          <span>Location</span>
          <div className="map">
            <MapContainer
              center={[20, 77]}
              zoom={5}
              style={{ height: "300px", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              <LocationPicker setLocation={setLocation} />
            </MapContainer>
          </div>
        </div>

        {/* Submit Button */}
        <Button title="Generate QR" onClick={handleSubmit} />
        {status && <p className="mt-4">{status}</p>}
      </div>
    </div>
  );
};

export default FarmInput;
