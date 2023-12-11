import React, {useEffect, useState} from 'react';
import "./AdminMain.css";
import TaskTable from './TaskTable';
import {useLocation, useNavigate} from "react-router-dom";



const AdminMain = () => {
    const [itemData, setItemData] = useState([]);
    const [CompletedPercent, setCompletedPercent] = useState(0);
    const [ActivePercent, setActivePercent] = useState(0);
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
            const NoOfTotalTasks = data.length;
            const NoOfCompletedTasks = data.filter(x => x.work_status === 'C').length;
            const NoOfActiveTasks = data.filter(x => x.work_status === 'A').length;
            setCompletedPercent(NoOfCompletedTasks / NoOfTotalTasks * 100);
            setActivePercent(NoOfActiveTasks / NoOfTotalTasks * 100);
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
                <div className="tasktable-home">
                    <TaskTable data={itemData} editable={false}/>
                </div>
            )}
        </>
    );
}

export default AdminMain;

