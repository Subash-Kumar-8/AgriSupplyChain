import React, { useState } from "react";
import Header from "../Components/Header";
import Button from "../Components/Button";
import "../Styles/farmInput.css";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import ProductRegistryABI from "../abis/ProductRegistry.json";

const CONTRACT_ADDRESS = "0x4caf56b4cdf3e2cfb36c37f173db32ce06faecfa";

const ProcessInput = () => {
  const navigate = useNavigate();

  // Form state
  const [productName, setProductName] = useState("");
  const [packageConditions, setPackageConditions] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [makingDate, setMakingDate] = useState("");
  const [transportDate, setTransportDate] = useState("");

  const [status, setStatus] = useState("");

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
        CONTRACT_ADDRESS,
        ProductRegistryABI,
        signer
      );

      // Convert dates → UNIX timestamps
      const makingTimestamp = makingDate
        ? Math.floor(new Date(makingDate).getTime() / 1000)
        : 0;

      const transportTimestamp = transportDate
        ? Math.floor(new Date(transportDate).getTime() / 1000)
        : 0;

      setStatus("⏳ Submitting transaction...");

      const tx = await contract.addProduct(
        productName,
        packageConditions,
        batchNumber,
        makingTimestamp,
        transportTimestamp
      );

      await tx.wait();

      // Save to localStorage
      const productData = {
        productName,
        packageConditions,
        batchNumber,
        makingDate,
        transportDate,
      };
      localStorage.setItem("latestProduct", JSON.stringify(productData));

      setStatus("✅ Transaction confirmed & product saved!");
      navigate("/processqr");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + (err.message || err));
    }
  };

  return (
    <div className="container">
      <div className="header">
        <Header title="Hi Processor" link1="Farmer" link2="Retailer" />
      </div>

      <div className="content">
        {/* Form Fields */}
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
            <span>Package Conditions</span>
            <input
              type="text"
              value={packageConditions}
              onChange={(e) => setPackageConditions(e.target.value)}
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
            <span>Making Date</span>
            <input
              type="date"
              value={makingDate}
              onChange={(e) => setMakingDate(e.target.value)}
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
        </div>

        {/* Submit Button */}
        <Button title="Generate QR" onClick={handleSubmit} />
        {status && <p className="mt-4">{status}</p>}
      </div>
    </div>
  );
};

export default ProcessInput;
