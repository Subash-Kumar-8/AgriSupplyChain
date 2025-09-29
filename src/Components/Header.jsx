import React from "react";
import './header.css';

const Header = (props) => {
    return(
        <div className="box">
            <h2>{props.title}</h2>
            <div className="right">
                <a href="/processhome">{props.link1}</a>
                <a href="/retailhome">{props.link2}</a>
            </div>
        </div>
    );
}

export default Header;