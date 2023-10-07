import React, {useState} from "react";
import "./NewTask.css";
import {useEffect} from "react";

const NewTask = () => {
    const [coords,setCoords] = useState([]);

    const fetchCoordsNames = ()=>{
        fetch('/db/getcoords')
            .then(response => response.json())
            .then(data => setCoords(data))
            .catch(error => console.error('Error:', error));
    }

    useEffect( ()=>{
        fetchCoordsNames();
        }
    )

    return(
        <>
            <div className="Home">
                <h1 className="home-title">PUBLISH NEW TASK</h1>
                <div className="input-div-1">
                    <input className="input-bar-1" type="text" placeholder="Type Work Name" />
                    <input className="input-bar-1" type="text" placeholder="Type Work Cost" />
                </div>
                <div className="input-div-1">
                    <input className="input-bar-1" type="text" placeholder="Start Date" />
                    <input className="input-bar-1" type="text" placeholder="Due Date" />
                </div>
                <div className="input-div-2">
                    <input className="input-bar-2" type="text" placeholder="Type task description" />
                    <input className="input-bar-2" type="text" placeholder="Type Date of Advance payment" />
                    <input className="input-bar-2" type="text" placeholder="Type amount paid in advance " />
                    <select placeholder={'Who is coordinating this work?'}>
                        <option value="" disabled>Select Coordinator</option>
                        {coords.map((v,i)=>(<option key={i} value = {v.coordinator_id}>{v.coordinator_name}</option>))}
                    </select>
                </div>
                <button className="Add-button">Add Task</button>
            </div>
        </>
    )
}

export default NewTask;