import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import Button from "../Components/Button";
import "../Styles/farmhome.css";

const FarmHome = () => {
  const navigate = useNavigate();
  const [cropData, setCropData] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("latestCrop"));
    if (data) setCropData(data);
  }, []);

  return (
    <div className="container">
      <div className="header">
        <Header title="Hi Farmer" link1="Processor" link2="Retailer" />
      </div>
      <div className="content">
        <div className="innerBox">
          <h2>Your Previous Work With Us</h2>

          {cropData ? (
            <div className="table">
              <p>
                <strong>Batch Number:</strong> {cropData.batchNumber}
              </p>
              <p>
                <strong>Crop Name:</strong> {cropData.cropName}
              </p>
              <p>
                <strong>Transport Date:</strong> {cropData.transportDate}
              </p>
            </div>
          ) : (
            <div className="table">
              <p>No crop data found.</p>
            </div>
          )}
        </div>

        <Button
          title="Book for Transport"
          onClick={() => navigate("/farminput")}
        />
      </div>
    </div>
  );
};

export default FarmHome;
