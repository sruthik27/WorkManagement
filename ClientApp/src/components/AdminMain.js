import React, {useEffect, useState} from 'react';
import "./AdminMain.css";
import TaskTable from './TaskTable';
import {useLocation, useNavigate} from "react-router-dom";
import {PieChart} from 'react-minimal-pie-chart';


const AdminMain = () => {
    const [itemData, setItemData] = useState([]);
    const [CompletedPercent, setCompletedPercent] = useState(0);
    const [ActivePercent, setActivePercent] = useState(0);
    const [IncompletePercent, setIncompletePercent] = useState(0);
    const [announcementText, setAnnouncementText] = useState('');
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
            const response = await fetch('/db/getworks'); //need to add "/getWorks" after backend is pushed
            const data = await response.json();
            setItemData(data);
            const NoOfTotalTasks = data.length;
            const NoOfCompletedTasks = data.filter(x => x.work_status === 'C').length;
            const NoOfActiveTasks = data.filter(x => x.work_status === 'A').length;
            const NoOfIncompleteTasks = data.filter(x => x.work_status === 'I').length;
            setCompletedPercent(NoOfCompletedTasks / NoOfTotalTasks * 100);
            setActivePercent(NoOfActiveTasks / NoOfTotalTasks * 100);
            setIncompletePercent(NoOfIncompleteTasks / NoOfTotalTasks * 100);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSendAnnouncement = () => {
        const newBroadcast = {
    message: announcementText // Replace with your message
};

// Send a POST request to add a new broadcast
fetch("/db/addbroadcast", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(newBroadcast),
})
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data.message); // Message from the server
        setAnnouncementText('');
    })
    .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
    });
};

    return (
        <>
            <div className="ahome">
                <p className="para">WELCOME TO THE DASHBOARD!</p>
                <TaskTable data={itemData} editable={false}/>
                <div className='base-item'>
                    <div className="piechartdiv">
                        <h2 className='table-head'>Progress chart:</h2>
                        <PieChart
                            data={[
                                {title: 'Completed', value: CompletedPercent, color: '#7cd57c'},
                                {title: 'Active', value: ActivePercent, color: '#ffff68'},
                                {title: 'Incomplete', value: IncompletePercent, color: '#f75b5b'},
                            ]} label={({dataEntry}) => dataEntry.title}
                            labelStyle={{
                                fontSize: '6px',
                            }}
                        />
                    </div>
                    <div>
                        <div className='feedback'>
                            <h2 className='table-head'>Broadcast Announcements</h2>
                            <input className='feedback-input' placeholder='Type announcement here...' value={announcementText} onChange={(e) => {
                                // Update the announcement text when the input value changes
                                setAnnouncementText(e.target.value);
                            }}/>
                            <button className='send-button' onClick={handleSendAnnouncement}>SEND</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminMain;
