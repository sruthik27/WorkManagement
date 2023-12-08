import React, {useState, useEffect} from "react";
import './NewTask.css';
import Slider from '@mui/material/Slider';
import routeMappings from "../routeMappings";
import {useNavigate} from 'react-router-dom';

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
    const [weightOfTask, setWeightOfTask] = useState(0);
    const [subtaskDueDate, setSubtaskDueDate] = useState(new Date());
    const [noOfSubtasks, setNoOfSubtasks] = useState(1);
    const [subtasks, setSubtasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [valueText, setValueText] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const fetchWorkerNames = () => {
        fetch('/db/getworkers')
            .then(response => response.json())
            .then(data => setWorkers(data))
            .catch(error => console.error('Error:', error));
    }

    useEffect(() => {
        fetchWorkerNames();
    }, []);

    const validateForm = () => {
        if (workName === "") {
            setErrorMessage("Work Name is required");
            return;
        }

        if (workCost === "" || isNaN(workCost) || workCost === 0) {
            setErrorMessage("Work Cost is required and must be a number");
            return;
        }

        if (worker === "") {
            setErrorMessage("Worker is required");
        }

        if (startDate === "") {
            setErrorMessage("Start Date is required");
        }

        if (dueDate === "") {
            setErrorMessage("Due Date is required");
        }

        if (coordinator === "") {
            setErrorMessage("Coordinator is required");
        }

        if (subtasks.length === 0) {
            setErrorMessage("Add atleast one subtask");
        }
        return null;
    };


    const handleFormSubmit = async () => {
        validateForm();
        // Calculate the total weightage of the subtasks
    const totalWeightage = subtasks.reduce((total, subtask) => total + subtask.weightage, 0);

    // If the total weightage is not 100, show an alert and return early
    if (totalWeightage !== 100) {
        alert("The total weightage of the subtasks does not add up to 100. Please check the subtask weightages.");
        return;
    }
        if (errorMessage !== "") {
            return;
        }
        const newWork = {
            work: {
                work_name: workName,
                work_description: taskDescription,
                work_status: 'A',
                start_date: startDate.toISOString(),
                due_date: dueDate.toISOString(),
                total_subtasks: weightOfTask,
                completed_subtasks: 0,
                wage: workCost,
                worker: worker,
                advance_paid: false,
                bill_paid: false,
                coordinator: coordinator
            },
            subtasks: subtasks,
        };

        var jsonData = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newWork),
            redirect: 'follow'
        };

        await fetch("/db/addwork", jsonData)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

        setWorkName("");
        setTaskDescription("");
        setWorkCost("");
        setWorker("");
        setDueDate(new Date());
        setStartDate(new Date());
        setCoordinator("");

        navigate(routeMappings["bHWtcH10="], {state: {fromAdminHome: true}});
    };

    const handleSliderChange = (index) => (event, newValue) => {
  setSubtasks((prevSubtasks) => {
    const newSubtasks = [...prevSubtasks];
    newSubtasks[index].weightage = newValue;
    newSubtasks[index].isSet = true;

    let remainingWeightage = 100 - newSubtasks.filter(subtask => subtask.isSet).reduce((total, subtask) => total + subtask.weightage, 0);
    const unsetSubtasks = newSubtasks.filter((_, i) => i !== index && !newSubtasks[i].isSet);
    const totalUnsetWeightage = unsetSubtasks.reduce((total, subtask) => total + subtask.weightage, 0);

    // Distribute the remaining weightage among unset subtasks proportionally
    unsetSubtasks.forEach(subtask => {
       if (totalUnsetWeightage === 0) {
         subtask.weightage = Math.floor(remainingWeightage / unsetSubtasks.length / 5) * 5;
       } else {
         subtask.weightage = Math.floor((subtask.weightage / totalUnsetWeightage) * remainingWeightage / 5) * 5;
       }
       remainingWeightage -= subtask.weightage;
    });

    // If there's any remaining weightage left due to rounding down, add it to the first unset subtask
    if (remainingWeightage > 0 && unsetSubtasks.length > 0) {
      let i = 0;
      while (remainingWeightage > 0 && i < unsetSubtasks.length) {
        unsetSubtasks[i].weightage += 5;
        remainingWeightage -= 5;
        i++;
      }
    }

    return newSubtasks;
  });
};




    const handleSubtaskFormSubmit = () => {
        const newSubtask = {
            task_name: subtaskDescription,
            due_date: subtaskDueDate.toISOString(),
            completed: false,
            order_no: noOfSubtasks,
            weightage: valueText,
            isSet: false
        };
        console.log(newSubtask);
        setSubtasks([...subtasks, newSubtask]);
        setNoOfSubtasks(x => x + 1);
        setWeightOfTask(x => x + valueText)
        setSubtaskDescription("");
        setSubtaskDueDate(new Date());
        setValueText(1);
        handleCloseModal();
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <div className="form-background">
                <div className="form">
                    <div>
                        <div>
                            <h1 className="heading">PUBLISH NEW TASK</h1>
                            <hr className="heading-line"/>
                        </div>
                        <form className="form-class">
                            <div className="form-group">
                                <label>Work Name: </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type Work Name"
                                    value={workName}
                                    onChange={event => setWorkName(event.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Work Cost: </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Type Work Cost"
                                    value={workCost}
                                    onChange={event => setWorkCost(event.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Start Date: </label>
                                <input
                                    type="date"
                                    value={startDate.toISOString().split('T')[0]}
                                    onChange={(event) => setStartDate(new Date(event.target.value))}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Due Date: </label>
                                <input
                                    type="date"
                                    value={dueDate.toISOString().split('T')[0]}
                                    onChange={(event) => setDueDate(new Date(event.target.value))}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Task Description: </label>
                                <input
                                    type="text"
                                    placeholder="Type task description"
                                    onChange={(event) => setTaskDescription(event.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Agency: </label>
                                <select
                                    className="form-control"
                                    value={worker}
                                    onChange={(event) => setWorker(event.target.value)}
                                >
                                    <option value="" disabled>Select Agency</option>
                                    {workers.map((v, i) => (
                                        <option key={i}
                                                value={v.worker_id}>{v.worker_name.charAt(0).toUpperCase() + v.worker_name.slice(1)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Coordinator: </label>
                                <input
                                    type="text"
                                    placeholder="Who is supervising?"
                                    onChange={(event) => setCoordinator(event.target.value)}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                {subtasks.map((subtask, index) => (
                                    <div className="subtask-des" key={index}>
                                        <h1 className="subtask-des-head">Sub Task {index + 1}</h1>
                                        <p className="subtask-des-des">Description: {subtask.task_name}</p>
                                        <p className="subtask-des-des">Due
                                            Date: {new Date(subtask.due_date).toDateString()}</p>
                                        <div className="form-group">
  <label>Task Weightage: </label>
  <Slider
    aria-label="Temperature"
    defaultValue={1}
    valueLabelDisplay="auto"
    step={5}
    marks
    min={0}
    max={100}
    style={{color: "#640000"}}
    onChange={handleSliderChange(index)}
    value={subtask.weightage}
  />
</div>

                                    </div>
                                ))}
                            </div>
                        </form>
                    </div>
                    <div className="task-button">
                        <button type="button" className="btn" onClick={handleShowModal}>
                            Add Subtask
                        </button>
                        <br/>
                        <button type="button" className="btn" onClick={handleFormSubmit}>
                            Add Work
                        </button>
                    </div>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {showModal && (
                        <div tabIndex="-1" role="dialog" style={{display: showModal ? "block" : "none"}}>
                            <div role="document">
                                <div className="modal-content">
                                    <div className="modal-inner">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Add Subtask {noOfSubtasks}</h5>
                                            <hr className="heading-line"/>
                                        </div>
                                        <div className="modal-body">
                                            <form>
                                                <div className="form-group">
                                                    <label>Description: </label>
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
                                                    <label>Due Date: </label>
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
                                            <button type="button" className="btn" onClick={handleSubtaskFormSubmit}>
                                                Add Subtask
                                            </button>
                                            <button type="button" className="btn" onClick={handleCloseModal}>
                                                Close
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </>
    );
}

export default NewTask;