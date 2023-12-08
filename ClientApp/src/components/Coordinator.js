import React, { useEffect, useState } from 'react';
import TaskTable from './TaskTable';
import "./AdminMain.css";
import { useLocation, useNavigate } from "react-router-dom";


const Coordinator = () => {
  const [itemData, setItemData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.state || !location.state.fromAdminHome) {
      navigate('/');
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/db/getworks');
      const data = await response.json();
      setItemData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
       ) : (
        <div className='ahome'>
          <div>
            <h1 className="para">Welcome to MDR - Head Portal</h1>
            <hr className="heading-line"/>
          </div>
          <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
            <TaskTable data={itemData} editable={true}/>
            <div className='coordinator-buttons'>
              <a href={'/WorkReport'}><button className='coo-button' >WORK REPORTS</button></a>
              <a href={'/NewTask'}><button className='coo-button'>CREATE NEW WORK</button></a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Coordinator;