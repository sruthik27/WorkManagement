import React, { useEffect, useState } from 'react';
import TaskTable from './TaskTable';
import "./AdminMain.css";
import { useLocation, useNavigate } from "react-router-dom";
import VerificationCodeDisplay from "./VerificationCodeDisplay";

const Coordinator = () => {
  const [itemData, setItemData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state || !location.state.fromAdminHome) {
      navigate('/');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/db/getworks');
      const data = await response.json();
      setItemData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const updateVerificationCode = async () => {
    window.location.reload();
    const endpoint = '/db/updatevcode';

    try {
      const requestBody = {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      };
      const response = await fetch(endpoint, requestBody);
      if (response.ok) {
        console.log('Update successful');
      } else {
        console.error('Update failed:', response.statusText);
      }
    } catch (error) {
    console.error('An error occurred:', error);
    }
  }

  return (
    <>
      <div className='ahome'>
        <p className="para">WELCOME BACK</p>
        <div style={{display: 'flex'}}>
          <h3 className='datepickerhead'>Verification code: </h3>
          <div className='code-div'>
            <VerificationCodeDisplay/>
            <button className="update-button" onClick={updateVerificationCode}>Update</button>
          </div>
        </div>
        <TaskTable data={itemData} editable={true}/>
        <div className='coordinator-buttons'>
          <a href={'/WorkReport'}><button className='coo-button' >WORK REPORTS</button></a>
          <a href={'/NewTask'}><button className='coo-button'>CREATE NEW WORK</button></a>
        </div>
      </div>
    </>
  )
}

export default Coordinator;
