import React from "react";
import { useState } from "react";
import './AdminHome.css';
import Footer from "./Vector.png";
import Ellipse from "./Ellipse 1.svg";

const AdminHome = () => {

    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputCheckbox, setInputCheckbox] = useState(false);

    const HandleInputEmail = (e) => {
        setInputEmail(e.target.value);
    }

    const HandleInputPassword = (e) => {
        setInputPassword(e.target.value);
    }

    const HandleSubmit = () => {
        let loginData = {
            Email : inputEmail,
            Password : inputPassword
        };
    }

    const HandleCheckbox = () => {
        inputCheckbox ? setInputCheckbox(false) : setInputCheckbox(true);
    }
    return (
        <div className="Home">
            <div className="Home-Container">
                <h1 className="Admin-head">ADMIN PORTAL</h1>
                <p>LOGIN TO MANAGE YOUR WORKERS AND WORKS</p>
                <div className="user-input">
                    <input className="input1" type="text" value={inputEmail} onChange={HandleInputEmail} placeholder="Email"/>
                    <input className="input1" type="text" value={inputPassword} onChange={HandleInputPassword} placeholder="Password"/>
                </div>
                <div className="Login-container">
                    <div>
                        <input className="checkbox" type="checkbox" value={inputCheckbox} onClick={HandleCheckbox}/>
                        <label>Remember me</label>
                    </div>
                    <a className="Login" href="/AdminMain"><img className="Login-img" src={Ellipse} alt="Login-Button" onClick={HandleSubmit}/></a>
                    <a className="forgot" href="/ForgotPassword">Forgot password?</a>
                </div>
            </div>
            <div>
                <img className="Footer-img" src={ Footer } alt="AdminHomeFooter"/>
            </div>
        </div>
    )
}

export default AdminHome;