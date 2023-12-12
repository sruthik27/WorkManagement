import React, {useEffect, useState} from 'react';
import "./AdminMain.css";
import TaskTable from './TaskTable';
import {useLocation, useNavigate} from "react-router-dom";



const AdminMain = () => {
    const [itemData, setItemData] = useState([]);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        try {
            const response = await fetch('/db/getworks'); //need to add "/getWorks" after backend is pushed
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
             ): (
                <div>
                    <button style={{position: 'absolute', margin: '20px'}} className="go-back-button" onClick={() => navigate(-1)}>Home</button>
                    <div className="tasktable-home">
                        <TaskTable data={itemData} editable={false}/>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminMain;