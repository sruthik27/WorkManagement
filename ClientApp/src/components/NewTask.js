import React, {useState} from "react";
import "./NewTask.css";
import {useEffect} from "react";

const NewTask = () => {
    const [coords, setCoords] = useState([]);
    const [workName, setWorkName] = useState("");
    const [workCost, setWorkCost] = useState();
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [taskDescription, setTaskDescription] = useState("");
    const [coordinator, setCoordinator] = useState("");


    const fetchCoordsNames = () => {
        fetch('/db/getcoords')
            .then(response => response.json())
            .then(data => setCoords(data))
            .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
            fetchCoordsNames();
        }
    )

    const handleFormSubmit = () => {
        const newWork = {
            work_name: workName,
            work_description: taskDescription,
            work_status: 'A', // You can change this as needed
            start_date: startDate.toISOString(),
            due_date: dueDate.toISOString(),
            total_subtasks: 0,
            completed_subtasks: 0,
            wage: workCost,
            advance_paid: false,
            bill_paid: false,
            coordinator: coordinator,
            // Add the other fields as needed
        };
        console.log(newWork);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        var jsonData = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(newWork), // Convert JavaScript object to JSON
            redirect: 'follow'
        };
        fetch("/db/addwork", jsonData)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    };

    return (
        <>
            <div className="Home">
                <h1 className="home-title">PUBLISH NEW TASK</h1>
                <div className="input-div-1">
                    <input className="input-bar-1" type="text" placeholder="Type Work Name" value={workName}
                           onChange={event => setWorkName(event.target.value)}/>
                    <input className="input-bar-1" type="number" placeholder="Type Work Cost" value={workCost}
                           onChange={event => setWorkCost(event.target.value)}/>
                </div>
                <div className="input-div-1">
                    <input
                        className="input-bar-1"
                        type="date"
                        value={startDate.toISOString().split('T')[0]}
                        onChange={(event) => setStartDate(new Date(event.target.value))}
                    />
                    <input
                        className="input-bar-1"
                        type="date"
                        value={dueDate.toISOString().split('T')[0]}
                        onChange={(event) => setDueDate(new Date(event.target.value))}
                    />

                </div>
                <div className="input-div-2">
                    <input className="input-bar-2" type="text" placeholder="Type task description"
                           onChange={(event) => setTaskDescription(event.target.value)}/>
                    <select placeholder={'Who is coordinating this work?'} value={coordinator}
                            onChange={(event) => setCoordinator(event.target.value)}>
                        <option value="" disabled>Select Coordinator</option>
                        {coords.map((v, i) => (<option key={i} value={v.coordinator_id}>{v.coordinator_name}</option>))}
                    </select>
                </div>
                <button className="Add-button" onClick={handleFormSubmit}>Add Task</button>
            </div>
        </>
    )
}

export default NewTask;