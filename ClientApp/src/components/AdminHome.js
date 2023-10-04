import React, {useEffect} from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './AdminHome.css';
import Footer from "./Vector.png";
import Ellipse from "./Ellipse 1.svg";
import routeMappings from "../routeMappings";

const AdminHome = () => {

    const navigate = useNavigate();
    
    useEffect(() => {
        const rememberMe = document.cookie.includes("rememberMe=true");
        console.log(rememberMe);
        if (rememberMe) {
            // Use the obfuscated name for redirection
            navigate(routeMappings["aGVsbG9="]);
        }
    }, [navigate]);

    const [inputEmail, setInputEmail] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [inputCheckbox, setInputCheckbox] = useState(false);


    const HandleInputEmail = (e) => {
        setInputEmail(e.target.value);
    }

    const HandleInputPassword = (e) => {
        setInputPassword(e.target.value);
    }

    const setRememberMeCookie = () => {
        // Set a cookie with an expiration date (e.g., 30 days)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);
        document.cookie = `rememberMe=true; expires=${expirationDate.toUTCString()}; path=/`;
    };

    const HandleCheckbox = () => {
        inputCheckbox ? setInputCheckbox(false) : setInputCheckbox(true);
    }
    const HandleSubmit = () => {
        // Create an object with the login data
        const loginData = {
            email: inputEmail,
            password: inputPassword,
            designation: 'A',
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
                        setRememberMeCookie();
                    }
                    // Navigate to the specified route using React Router
                    navigate(data.redirectTo);
                    
                } else {
                    console.log('Authentication failed');
                    alert('Authentication failed');
                    // Handle authentication failure (e.g., display an error message)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                // Handle any errors that occur during the HTTP request
            });
    };
    return (
        <div className="Home">
            <div className="Home-Container">
                <h1 className="Admin-head">ADMIN PORTAL</h1>
                <p className="Admin-info">LOGIN TO MANAGE YOUR WORKERS AND WORKS</p>
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
                        <label>Remember me</label>
                    </div>
                    <div className="Login" ><img className="Login-img" src={Ellipse} alt="Login-Button" onClick={HandleSubmit}/></div>
                    <a className="forgot" href="/ForgotPassword">Forgot password?</a>
                </div>
                <div>
                    <img className="Footer-img" src={ Footer } alt="AdminHomeFooter"/>
                </div>
            </div>
        </div>
    )
}

export default AdminHome;