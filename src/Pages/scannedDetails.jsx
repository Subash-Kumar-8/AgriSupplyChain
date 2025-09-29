import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Components/Header";
import Button from "../Components/Button";

const ScannedDetails = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [data, setData] = useState(null);

  useEffect(() => {
    let mergedData = {};

    // 1️⃣ Load from localStorage
    try {
      const storedData = JSON.parse(localStorage.getItem("scannedData") || "{}");
      mergedData = { ...storedData };
    } catch (e) {
      console.error("Invalid localStorage JSON:", e);
    }

    // 2️⃣ Load from URL params (override localStorage)
    const params = new URLSearchParams(search);
    params.forEach((value, key) => {
      if (value) mergedData[key] = value;
    });

    if (Object.keys(mergedData).length > 0) {
      setData(mergedData);
    }
  }, [search]);

  const handleApprove = () => {
    console.log("Scanned Data:", data); 
    
    if (data) {
      localStorage.setItem("scannedData", JSON.stringify(data)); 
      
      if (data.cropName) {
        navigate("/processhome");
      } 
      else if (data.productName) {
        navigate("/retailhome");
      } 
      else {
        console.warn("Scanned Data present but missing routing keys (cropName or productName). Defaulting to /");
        navigate("/"); 
      }
    } 
    else {
      console.error("Attempted approval with no data. Redirecting to /");
      navigate("/");
    }
  };

  const handleReject = () => {
    navigate("/"); 
  };

  return (
    <div>
      <Header title="Scanned Details" />
      <div style={{ padding: "20px" }}>
        {data ? (
          <div>
            <h2>Scanned Data</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <Button title="Approve & Continue" onClick={handleApprove} />
            <Button title="Reject" onClick={handleReject} />
          </div>
        ) : (
          <p>No scanned data found.</p>
        )}
      </div>
    </div>
  );
};

export default ScannedDetails;
