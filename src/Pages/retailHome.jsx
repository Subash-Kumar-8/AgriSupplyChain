import React from "react";
import '../Styles/farmhome.css'
import Header from "../Components/Header";
import Button from "../Components/Button";
import { useNavigate } from "react-router-dom";

const RetailHome = () => {
    const navigate = useNavigate();
    return(
        <div className="container">
            <div className="header">
                <Header title={"Hi Retailer"} link1={"Farmer"} link2={"Processor"}/>
            </div>
            <div className="content">
                <div className="innerBox">
                    <h1>Your Previous Works With Us</h1>
                </div>
                <Button title={'Fill the Form'} onClick={() => {navigate('/retailinp')}}/>
            </div>
        </div>
    );
}

export default RetailHome;