import React, {useState} from "react";
import "./NewTask.css";
import {useEffect} from "react";

const NewTask = () => {
    const [coords, setCoords] = useState([]);
    const [workName, setWorkName] = useState("");
    const [workCost, setWorkCost] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [taskDescription, setTaskDescription] = useState("");
    const [advancePaymentDate, setAdvancePaymentDate] = useState(new Date());
    const [advancePaymentAmount, setAdvancePaymentAmount] = useState("");
    const [coordinator, setCoordinator] = useState("");
    const [advancePaid, setAdvancePaid] = useState(false);


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
            start_date: startDate,
            due_date: dueDate,
            wage: workCost,
            coordinator: coordinator,
            // Add the other fields as needed
        };

        fetch('/db/addwork', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newWork)
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response data
                console.log(data);
            })
            .catch(error => {
                // Handle the error
                console.error('Error:', error);
            });
    };


    return (
        <>
            <div className="Home">
                <h1 className="home-title">PUBLISH NEW TASK</h1>
                <div className="input-div-1">
                    <input className="input-bar-1" type="text" placeholder="Type Work Name" value={workName}
                           onChange={event => setWorkName(event.target.value)}/>
                    <input className="input-bar-1" type="text" placeholder="Type Work Cost" value={workCost}
                           onChange={event => setWorkCost(event.target.value)}/>
                </div>
                <div className="input-div-1">
                    <input
                        className="input-bar-1"
                        type="date"
                        value={startDate}
                        onChange={event => setStartDate(event.target.value)}
                    />
                    <input
                        className="input-bar-1"
                        type="date"
                        value={dueDate}
                        onChange={event => setDueDate(event.target.value)}
                    />

                </div>
                <div className="input-div-2">
                    <input className="input-bar-2" type="text" placeholder="Type task description"/>
                    <label>Advance Paid</label>
                    <input
                        type="checkbox"
                        checked={advancePaid}
                        onChange={event => setAdvancePaid(event.target.checked)}
                    />

                    {advancePaid && (
                        <>
                            <input
                                className="input-bar-2"
                                type="date"
                                placeholder="Type Date of Advance payment"
                                value={advancePaymentDate}
                                onChange={event => setAdvancePaymentDate(event.target.value)}
                            />
                            <input
                                className="input-bar-2"
                                type="number"
                                placeholder="Type amount paid in advance "
                                value={advancePaymentAmount}
                                onChange={event => setAdvancePaymentAmount(event.target.value)}
                            />
                        </>
                    )}

                    <select placeholder={'Who is coordinating this work?'}>
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