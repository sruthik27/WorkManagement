import React from "react";
import './AdminHome.css';
import { useState } from "react";

const ResetPassword = () => {

    const [emailCheck, setEmailCheck] = useState(false)
    const [inputForgotPassword, setInputForgotPassword] = useState("");
    const [isEmailCheck, setisEmailCheck] = useState(false)
    const [inputResetPassword, setInputResetPassword] = useState("");
    const [inputConfirmPassword, setInputConfirmPassword] = useState("");
    const [misMatch, setMisMatch] = useState(false);

    const HandleInputResetPassword = (e) => {
        setInputResetPassword(e.target.value);
    }

    const HandleInputConfirmPassword = (e) => {
        setInputConfirmPassword(e.target.value);
    }

    const HandleInputForgotPassword = (e) => {
        setInputForgotPassword(e.target.value);
    }

    function isEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input);
    }

    const handleForgotPasswordSubmit = async () => { // send the whole function to new page
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
        setInputForgotPassword("");

    }

    return (
        <>
            <div className="forgot-pass-whole-div">
                <div className="forgot-password-head-div">
                    <h1 className="forgot-password-head">Reset Password: </h1>
                </div>
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
        </>
    )
}

export default ResetPassword;