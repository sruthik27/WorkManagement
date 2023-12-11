import React, {useEffect} from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminHome.css';
import "./AdminMain.css";
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
            navigate(routeMappings["Csjdjovn="],{ state: { fromAdminHome: true } });
        }
    }, [navigate]);

    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputCheckbox, setInputCheckbox] = useState(false);
    const [inputLoginFail, setInputLoginFail] = useState("");
    const [inputForgotPassword, setInputForgotPassword] = useState("");
    const [oldPassword,setOldPassword] = useState("");
    const [emailCheck, setEmailCheck] = useState(false)
    const [isEmailCheck, setisEmailCheck] = useState(false)
    const [inputResetPassword, setInputResetPassword] = useState("");
    const [inputConfirmPassword, setInputConfirmPassword] = useState("");
    const [misMatch, setMisMatch] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [whoLogin, setWhoLogin] = useState("");
    const [isLoading, setIsLoading] = useState(false);

 
    const HandleInputEmail = (e) => {
        setInputEmail(e.target.value);
    }

    const HandleInputPassword = (e) => {
        setInputPassword(e.target.value);
    }

    const HandleInputResetPassword = (e) => {
        setInputResetPassword(e.target.value);
    }

    const HandleInputConfirmPassword = (e) => {
        setInputConfirmPassword(e.target.value);
    }

    const HandleInputForgotPassword = (e) => {
        setInputForgotPassword(e.target.value);
    }

    // const HandleClose = () => {
    //     setForgotPassword(false);
    //     setEmailCheck(false);
    //     setisEmailCheck(false);
    // }

    function isEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    }

    const handleForgotPassword = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "who":whoLogin
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("/db/resetpasswordlink", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    const handleForgotPasswordSubmit = async () => {
        if (isEmail(inputForgotPassword)) {
            setEmailCheck(true);
            setisEmailCheck(false);
        } else {
            setisEmailCheck(true);
        }
        if (inputResetPassword !== inputConfirmPassword) {
            setMisMatch(true);
        } else {
            setMisMatch(false);
        }
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "email": inputForgotPassword,
            "newpass": inputResetPassword,
            "oldpass": oldPassword,
        });

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        await fetch("/db/resetpass1", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        setInputConfirmPassword("");
        setInputResetPassword("");
        setOldPassword("")
        setInputForgotPassword("");

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

    const HandleLoginPrinci = (e) => {
        setIsLogin(true);
        setWhoLogin(e.target.value);
        
    }
    const HandleLoginHead = (e) => {
        setIsLogin(true);
        setWhoLogin(e.target.value);
    }

    return (
        <>
            {isLoading ? (
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="Home">
                    <div className="Home-Container">
                        <div>
                            <h1 className="Admin-head1">Thiagarajar College of Engineering</h1>
                            <h3 className="Admin-head">Department of Modernization,Development and Restoration (DMDR)</h3>
                            <p className="Admin-info">PROJECT MANAGEMENT PORTAL</p>
                        </div>
                        <div className="radio-box-div">
                            <div className="radio-box-input">
                                <input type="radio" id="Princi" name="Login" onClick={HandleLoginPrinci} value="P"/>
                                <label className="radio-box-label" for='Princi'>Login As DMDR Principal</label>
                            </div>
                            <div className="radio-box-input">
                                <input type="radio" id="Head" name="Login" onClick={HandleLoginHead} value="H"/>
                                <label className="radio-box-label" for='Head'>Login As DMDR Head</label>
                            </div>
                        </div>
                        {isLogin ? (
                            <div>
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
                                        <p className="flabel" onClick={handleForgotPassword}>Forgot Password</p>
                                    </div>
                                </div>
                                <div>
                                        {(
                                            <div>
                                                <div>
                                                    <h1 className="forgot-password-head">Reset Password: </h1>
                                                    <hr className="heading-line"/>
                                                    <div className="forgot-password">
                                                        <input
                                                            className="input2"
                                                            placeholder="Enter your Email id"
                                                            value={inputForgotPassword}
                                                            onChange={HandleInputForgotPassword}
                                                            type={"email"}
                                                        />
                                                        <input
                                                            className="input2"
                                                            type={"password"}
                                                            placeholder="Enter old password"
                                                            value={oldPassword}
                                                            onChange={(e) => {
                                                                setOldPassword(e.target.value);
                                                            }}
                                                        />
                                                        <input
                                                            className="input2"
                                                            type={"password"}
                                                            value={inputResetPassword}
                                                            onChange={HandleInputResetPassword}
                                                            placeholder="New Password"
                                                        />
                                                        <input
                                                            className="input2"
                                                            type={"password"}
                                                            value={inputConfirmPassword}
                                                            onChange={HandleInputConfirmPassword}
                                                            placeholder="Confirm new Password"
                                                        />
                                                        {emailCheck ?
                                                            <p className="verify-para">Password changed!</p> : ""}
                                                        {isEmailCheck ?
                                                            <p className="verify-para">Invalid or Error in Email
                                                                id</p> : ""}
                                                        {misMatch ?
                                                            <p className="verify-para">Password is Mismatched Check Your
                                                                Password</p> : ""}
                                                        <button className="forgot-password-button"
                                                                onClick={handleForgotPasswordSubmit}>Change
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) }
                                </div>
                                <p>{inputLoginFail}</p>
                            </div>
                        ) : " "}
                        {isLogin ? "": (
                            <div>
                                <img className="Footer-img" src={ Footer } alt="AdminHomeFooter"/>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default AdminHome;