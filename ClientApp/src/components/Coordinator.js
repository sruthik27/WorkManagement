import React, { useEffect, useState } from 'react';
import TaskTable from './TaskTable';
import "./AdminMain.css";
import { useLocation, useNavigate } from "react-router-dom";

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

  return (
    <>
      <div className='ahome'>
        <p className="para">WELCOME BACK</p>
        <TaskTable data={itemData} editable={true}/>
      </div>
      <div className='coordinator-buttons'>
        <a href={'/WorkReport'}><button className='coo-button' >WORK REPORTS</button></a>
        <a href={'/NewTask'}><button className='coo-button'>CREATE NEW WORK</button></a>
      </div>
    </>
  )
}

export default Coordinator;
