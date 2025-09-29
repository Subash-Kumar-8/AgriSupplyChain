import React from "react";
import Header from "../Components/Header";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";
import '../Styles/farmhome.css'

const ProcessHome = () => {

    const navigate = useNavigate();

    return(
        <div className="container">
            <div className="header">
                <Header title={"Hi Processor"} link1={"Farmer"} link2={"Retailer"}/>
            </div>
            <div className="content">
                <div className="innerBox">
                    <h2>Your Previous Works With Us</h2>
                </div>
                <Button title={"Fill the Form"} onClick={() => {navigate('/processinp')}}/>
            </div>
        </div>
    );
};

export default ProcessHome;