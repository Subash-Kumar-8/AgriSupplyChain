import React from "react";
import Header from "./Components/Header";
import Button from "./Components/Button";

const Head = () => {
    return(
        <div>
            <Header title='Something' link1='home' link2='another'/>
            <Button title='Click' />
        </div>
    );
}

export default Head;