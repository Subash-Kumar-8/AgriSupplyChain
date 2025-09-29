import React, { useState } from "react";
import "../Styles/farmInput.css";
import Header from "../Components/Header";
import Button from "../Components/Button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import ProductArrivalABI from "../abis/ProductArrivalRegistry.json";

const CONTRACT_ADDRESS = "0xc614746fba2b536962d720eab20344693d254c48";

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

const RetailInput = () => {
  const navigate = useNavigate();

  // Form state
  const [productName, setProductName] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [location, setLocation] = useState(null);

  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!productName || !arrivalDate || !location) {
      setStatus("⚠️ Please fill all fields and select a location");
      return;
    }

    if (!window.ethereum) {
      alert("❌ MetaMask not detected!");
      return;
    }

    try {
      setStatus("🔗 Connecting to wallet...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ProductArrivalABI, signer);

      // Convert date → timestamp
      const arrivalTimestamp = Math.floor(new Date(arrivalDate).getTime() / 1000);

      // Convert to integers for solidity
      const lat = Math.floor(location.lat * 1e7);
      const lng = Math.floor(location.lng * 1e7);

      setStatus("⏳ Submitting transaction...");
      const tx = await contract.addProductArrival(productName, arrivalTimestamp, lat, lng);
      await tx.wait();

      // Save to localStorage
      const arrivalData = {
        productName,
        arrivalDate,
        location: { lat: location.lat, lng: location.lng },
      };
      localStorage.setItem("latestArrival", JSON.stringify(arrivalData));

      setStatus("✅ Transaction confirmed & arrival saved!");
      navigate("/retailqr");
    } catch (err) {
      console.error("Error storing product arrival:", err);
      setStatus("❌ Error: " + (err.message || err));
    }
  };

  return (
    <div className="container">
      <div className="header">
        <Header title="Hi Retailer" link1="Farmer" link2="Processor" />
      </div>

      <div className="content">
        <div className="formField">
          <div className="form">
            <span>Product Name</span>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="form">
            <span>Arrival Date</span>
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
            />
          </div>
        </div>

        {/* Map input */}
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

        <Button title="Generate QR" onClick={handleSubmit} />
        {status && <p className="mt-4">{status}</p>}
      </div>
    </div>
  );
};

export default RetailInput;
