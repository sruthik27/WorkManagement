import React from "react";
import "./NewTask.css";

const NewTask = () => {
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
                </div>
                <button className="Add-button">Add Task</button>
            </div>
        </>
    )
}

export default NewTask;