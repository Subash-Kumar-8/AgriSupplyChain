import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Components/Header";
import Button from "../Components/Button";
import "../Styles/farmhome.css"; 

const DataDisplay = ({ data, title }) => {
    if (!data) return null;

    const formatKey = (key) => {
        if (key.startsWith('crop') && key.length > 4) return key.substring(4);
        if (key.startsWith('product') && key.length > 7) return key.substring(7);
        return key.charAt(0).toUpperCase() + key.slice(1);
    };

    return (
        <div className="data-section">
            <h3>{title} Details</h3>
            <ul className="data-list">
                {Object.entries(data).map(([key, value]) => {
                    if (key === 'locationSet' || key === 'location') return null;

                    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                        return (
                            <li key={key} className="nested-item">
                                <DataDisplay data={value} title={formatKey(key)} />
                            </li>
                        );
                    }
                    
                    return (
                        <li key={key}>
                            <span className="data-key">{formatKey(key)}:</span>
                            <span className="data-value">{String(value)}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const Costumer = () => {
    const [data, setData] = useState(null);
    const { search } = useLocation();

    const [displayData, setDisplayData] = useState(null);

    useEffect(() => {
        let mergedData = {};
        try {
            const storedData = localStorage.getItem("scannedData");
            if (storedData) mergedData = JSON.parse(storedData);
        } catch (e) {
            console.error("Invalid localStorage JSON:", e);
        }
        const params = new URLSearchParams(search);
        params.forEach((value, key) => {
            if (value) mergedData[key] = value;
        });

        if (Object.keys(mergedData).length > 0) {
            setData(mergedData);
        }
    }, [search]);
    useEffect(() => {
        if (!data) return;

        let parsedData = { ...data };
        if (typeof data === 'string' && data.startsWith('{') && data.endsWith('}')) {
             try {
                 parsedData = JSON.parse(data);
             } catch (e) {
                 console.error("Failed to parse stringified JSON data:", e);
                 return;
             }
        }

        if (parsedData.crop && parsedData.product) {
            setDisplayData(parsedData);
        } 
        else {
            setDisplayData({Details: parsedData}); 
        }

    }, [data]);

    return (
        <div className="container">
            <div className="header">
                <Header title={"Hi Customer"} />
            </div>
            <div className="content">
                {displayData ? (
                    <>
                        {displayData.crop && <DataDisplay data={displayData.crop} title="Farm Details" />}
                        {displayData.product && <DataDisplay data={displayData.product} title="Processing Details" />}
                        {!displayData.crop && !displayData.product && <DataDisplay data={displayData.Details} title="Product Trace" />}
                    </>
                ) : (
                    <p>Scanning...</p>
                )}
                
                <Button 
                    title={"Okay"} 
                    onClick={() => {alert("Hurray! You bought the product")}}
                />
            </div>
        </div>
    );
}

export default Costumer;