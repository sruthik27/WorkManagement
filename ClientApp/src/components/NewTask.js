import React, { useState, useEffect } from "react";

const NewTask = () => {
    const [workName, setWorkName] = useState("");
    const [workCost, setWorkCost] = useState("");
    const [worker, setWorker] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [dueDate, setDueDate] = useState(new Date());
    const [taskDescription, setTaskDescription] = useState("");
    const [workers, setWorkers] = useState([]);
    const [coordinator, setCoordinator] = useState("");
    const [subtaskDescription, setSubtaskDescription] = useState("");
    const [subtaskDueDate, setSubtaskDueDate] = useState(new Date());
    const [noOfSubtasks, setNoOfSubtasks] = useState(1);
    const [subtasks, setSubtasks] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const fetchWorkerNames = () => {
        fetch('/db/getworkers')
            .then(response => response.json())
            .then(data => setWorkers(data))
            .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
        fetchWorkerNames();
    }, []);

    const handleFormSubmit = () => {
        const newWork = {
            work: {
                work_name: workName,
                work_description: taskDescription,
                work_status: 'A',
                start_date: startDate.toISOString(),
                due_date: dueDate.toISOString(),
                total_subtasks: subtasks.length,
                completed_subtasks: 0,
                wage: workCost,
                worker: worker,
                advance_paid: false,
                bill_paid: false,
                coordinator:coordinator
            },
            subtasks: subtasks
        };

        var jsonData = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newWork),
            redirect: 'follow'
        };

        fetch("/db/addwork", jsonData)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    };

    const handleSubtaskFormSubmit = () => {
        const newSubtask = {
            task_name: subtaskDescription,
            due_date: subtaskDueDate.toISOString(),
            completed: false,
            order_no: noOfSubtasks
        };

        setSubtasks([...subtasks, newSubtask]);
        setNoOfSubtasks(x => x + 1);
        setSubtaskDescription("");
        setSubtaskDueDate(new Date());
        handleCloseModal();
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <div className="mt-4 form-main">
                <div className="text-center">
                    <h1>PUBLISH NEW TASK</h1>
                </div>
                <form>
                    <div className="form-group">
                        <label>Work Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type Work Name"
                            value={workName}
                            onChange={event => setWorkName(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Work Cost</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Type Work Cost"
                            value={workCost}
                            onChange={event => setWorkCost(event.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            value={startDate.toISOString().split('T')[0]}
                            onChange={(event) => setStartDate(new Date(event.target.value))}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input
                            type="date"
                            value={dueDate.toISOString().split('T')[0]}
                            onChange={(event) => setDueDate(new Date(event.target.value))}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Task Description</label>
                        <input
                            type="text"
                            placeholder="Type task description"
                            onChange={(event) => setTaskDescription(event.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label>Agency</label>
                        <select
                            className="form-control"
                            value={worker}
                            onChange={(event) => setWorker(event.target.value)}
                        >
                            <option value="" disabled>Select Agency</option>
                            {workers.map((v, i) => (
                                <option key={i} value={v.worker_id}>{v.worker_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Coordinator</label>
                        <input
                            type="text"
                            placeholder="Who is supervising?"
                            onChange={(event) => setCoordinator(event.target.value)}
                            className="form-control"
                        />
                    </div>
                    <button type="button" className="btn btn-primary mr-2" onClick={handleShowModal}>
                        Add Subtask
                    </button>
                    <br />
                    <button type="button" className="btn btn-success" onClick={handleFormSubmit}>
                        Add Task
                    </button>
                </form>
            </div>
            <div>
                {subtasks.map((subtask, index) => (
                    <div key={index}>
                        <p>Description: {subtask.task_name}</p>
                        <p>Due Date: {new Date(subtask.due_date).toDateString()}</p>
                    </div>
                ))}
            </div>
            {showModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Subtask {noOfSubtasks}</h5>
                                <button type="button" className="close" onClick={handleCloseModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input
                                            type="text"
                                            placeholder="Enter subtask description"
                                            value={subtaskDescription}
                                            onChange={(event) =>
                                                setSubtaskDescription(event.target.value)
                                            }
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Due Date</label>
                                        <input
                                            type="date"
                                            value={subtaskDueDate.toISOString().split("T")[0]}
                                            onChange={(event) =>
                                                setSubtaskDueDate(new Date(event.target.value))
                                            }
                                            className="form-control"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSubtaskFormSubmit}>
                                    Add Subtask
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default NewTask;
