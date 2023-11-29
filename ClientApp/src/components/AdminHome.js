import React, {useEffect} from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminHome.css';
import Footer from "./Vector.png";
import routeMappings from "../routeMappings";
import PopUp from "./PopUp";


const AdminHome = () => {

    const navigate = useNavigate();
    
    useEffect(() => {
        const rememberMe = document.cookie;
        if (rememberMe.includes("rememberAMe=true")) {
            // Use the obfuscated name for redirection
            navigate(routeMappings["aGVsbG9="],{ state: { fromAdminHome: true } });
        }
        else if (rememberMe.includes("rememberCMe")) {
            navigate(routeMappings["bHWtcH10="],{ state: { fromAdminHome: true } });
        }
    }, [navigate]);

    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputCheckbox, setInputCheckbox] = useState(false);
    const [inputLoginFail, setInputLoginFail] = useState("");
    const [forgotPassword, setForgotPassword] = useState(false);
    const [inputForgotPassword, setInputForgotPassword] = useState("");
    const [emailCheck, setEmailCheck] = useState(false)
    const [isEmailCheck, setisEmailCheck] = useState(false)

    const HandleInputEmail = (e) => {
        setInputEmail(e.target.value);
    }

    const HandleInputPassword = (e) => {
        setInputPassword(e.target.value);
    }

    const HandleInputForgotPassword = (e) => {
        setInputForgotPassword(e.target.value);
    }

    const HandleForgotPassword = () => {
        setForgotPassword(true);
    }

    const HandleClose = () => {
        setForgotPassword(false);
    }

    function isEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    }

    const HandleForgotPasswordSubmit = () => {
        if (isEmail(inputForgotPassword)) {
            setEmailCheck(true);
            setisEmailCheck(false);
        } else {
            setisEmailCheck(true);
        }
        console.log(inputForgotPassword);
    }

    const setRememberMeCookie = (who) => {
        // Set a cookie with an expiration date (e.g., 30 days)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        if (who==='A')
        document.cookie = `rememberAMe=true; expires=${expirationDate.toUTCString()}; path=/;Secure;`;
        else
            document.cookie = `rememberCMe=true; expires=${expirationDate.toUTCString()}; path=/;Secure;`
    };

    const HandleCheckbox = () => {
        inputCheckbox ? setInputCheckbox(false) : setInputCheckbox(true);
    }
    const HandleSubmit = () => {
        // Create an object with the login data
        const loginData = {
            email: inputEmail,
            password: inputPassword
        };

        // Make a POST request to your API
        fetch("/db/verify", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                if (data.redirectTo) {
                    //set remember me cookie if checkbox enabled
                    if (inputCheckbox) {
                        // User wants to remember login
                        setRememberMeCookie(data.where);
                    }
                    // Navigate to the specified route using React Router
                    navigate(data.redirectTo,{ state: { fromAdminHome: true } });
                    
                } else {
                    console.log('Authentication failed');
                    setInputLoginFail("Invalid Email or Password");
                    // Handle authentication failure (e.g., display an error message)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle any errors that occur during the HTTP request
            });
    };
    return (
        <>
            <div className="Home">
                <div className="Home-Container">
                    <div>
                        <h1 className="Admin-head">MDR - PORTAL</h1>
                        <p className="Admin-info">MANAGEMENT DEVELOPMENT RESTORATION</p>
                    </div>
                    <div className="user-input">
                        <input className="input1" type="email" value={inputEmail} onChange={HandleInputEmail} placeholder="Email"/>
                        <input
                            className="input1"
                            type={"password"}
                            value={inputPassword}
                            onChange={HandleInputPassword}
                            placeholder="Password"                        
                        />
                    </div>
                    <div className="Login-container">
                        <div>
                            <input className="checkbox" type="checkbox" value={inputCheckbox} onClick={HandleCheckbox}/>
                            <label className = "flabel">Remember me</label>
                        </div>
                        <div className="Login" ><button className="Login-img" onClick={HandleSubmit}><p className = "login-para">Login</p></button></div>
                        <div>
                            <p className="flabel" onClick={HandleForgotPassword}>Forgot Password</p>
                        </div>
                    </div>
                    <div>
                        <PopUp trigger = {forgotPassword}>
                            {forgotPassword ? (
                                <div>
                                    <h1 onClick={HandleClose} className="close-btn">x</h1>
                                    <div>
                                        <h1 className="forgot-password-head">Forgot Password: </h1>
                                        <hr className="heading-line"/>
                                        <div className="forgot-password">
                                            <input 
                                                className="input2" 
                                                placeholder="Enter your Email id"
                                                value={inputForgotPassword}
                                                onChange={HandleInputForgotPassword}
                                                type={"email"}
                                            />
                                            {emailCheck ? <p className="verify-para">Check Your Email!</p> : ""}
                                            {isEmailCheck ? <p className="verify-para">Invalid or Error in Email id</p> : ""}
                                            <button className="forgot-password-button" onClick={HandleForgotPasswordSubmit}>Enter</button>
                                        </div>
                                    </div>
                                </div>
                            ): "" }
                        </PopUp>
                    </div>
                    <p>{inputLoginFail}</p>
                    <div>
                        <img className="Footer-img" src={ Footer } alt="AdminHomeFooter"/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminHome;