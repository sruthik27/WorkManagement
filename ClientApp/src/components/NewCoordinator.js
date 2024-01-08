import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useLocation, useNavigate, Link} from "react-router-dom";
import routeMappings from "../routeMappings";
import "./AdminMain.css";
import "./NewCoordinator.css";
import "./TaskTable.css";
import CreateButton from "./create_btn.gif";
import WorkImg from "./work_img.gif";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Flag from "./flag_icon.svg";
import {PieChart} from 'react-minimal-pie-chart';
import ProgressChart from './ProgressChart';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import VerificationCodeDisplay from "./VerificationCodeDisplay";
import PopUp from './PopUp';
import {Puff} from 'react-loader-spinner';
import Switch from "@mui/material/Switch";
import Print from "./print.svg";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import CommentCard from "./CommentCard";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import noData from './noDataInActive.png';
import manageWorkers from './ManageWorkes.png';
import ArrowLeft from './Arrow.gif';
import tceLogo from './TCE-Logo.jpeg';
import Tooltip from './ToolTip';
class PuffLoader extends React.Component {
    componentDidMount() {
        console.log('Rendering Puff');
    }

    componentDidUpdate() {
        console.log('Rerendering Puff');
    }

    render() {
        return (
            <Puff
                height="80"
                width="80"
                radius={1}
                color="#640000"
                ariaLabel="puff-loading"
                visible={true}
            />
        );
    }
}


const NewCoordinator = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [topworks, setTopworks] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [CompletedPercent, setCompletedPercent] = useState(0);
    const [ActivePercent, setActivePercent] = useState(0);
    const [isPaneOpen, setIsPaneOpen] = useState(false);
    const [activeData, setActiveData] = useState([]);
    const [selectedSubtasks, setSelectedSubtasks] = useState([]);
    const [selectedComments, setSelectedComments] = useState([]);
    const [orderChanged, setOrderChanged] = useState(false);
    const [dueDateDiff, setDueDateDiff] = useState(0);
    const [advancePaid, setAdvancePaid] = useState(0);
    const [dateOfPaid, setDateOfPaid] = useState("-");
    const [selectedItem, setSelectedItem] = useState(null);
    const [enteredAdvance, setEnteredAdvance] = useState(0);
    const [enteredDate, setEnteredDate] = useState(new Date());
    const [isChecked, setIsChecked] = useState(false);
    const [nowPaid, setNowPaid] = useState(false);
    const [padiBills, setPaidBills] = useState(new Map());

    useEffect(() => {
        if (!location.state || !location.state.fromAdminHome) {
            navigate('/');
        } else {
            setLoading(true);
            fetchData();
            getWorkers();
            const isOpen = localStorage.getItem('IsPaneOpen');
            if (isOpen === 'true') {
                // Set your state variable accordingly
                setIsPaneOpen(true);
                // Optionally, clear the state from localStorage if needed
                localStorage.removeItem('IsPaneOpen');
            }
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/db/getnearworks');
            const data = await response.json();
            setActiveData(data.worksData);
            console.log(activeData);
            setTopworks(data["worksData"]);
            setCompletedPercent(data["percentData"][0]);
            setActivePercent(data["percentData"][1])
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    const getWorkers = async () => {
        try {
            const response = await fetch('/db/getworkers');
            const data = await response.json();
            console.log(data);
            setWorkers(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const HandleSelectedItem = async (item) => {
        
        setIsLoading(true);
        setSelectedItem(item);
        let fetchedtasks = await fetch(`/db/gettasks?n=${item.work_id}`);
        let tasks = await fetchedtasks.json();
        setSelectedSubtasks(tasks);

        let fetchedpayments = await fetch(`/db/getpayments?workid=${item.work_id}`);
        let payments = await fetchedpayments.json();
        let adv = payments.find(x => x.payment_type === 'A');
        if (adv !== undefined) {
            let adv_amt = adv.paid_amount;
            let adv_date = adv.paid_date;
            setAdvancePaid(adv_amt);
            setDateOfPaid(adv_date);
        } else {
            setAdvancePaid(0);
            setDateOfPaid('-');
        }

        let fetchedcomments = await fetch(`/db/getreviews?workid=${item.work_id}`);
        let comments = await fetchedcomments.json();
        if (comments.length > 0) {
            setSelectedComments(comments);
        }
        let currentDate = new Date();
        let parts = item.due_date.slice(0,10).split('-');
        let dueDate = new Date(parts[0], parts[1]-1, parts[2]);
        currentDate.setHours(0,0,0);
        let diffInTime = dueDate.getTime() - currentDate.getTime();
        let diffInDays = Math.round(diffInTime / (24 * 60 * 60 * 1000));
        setDueDateDiff(diffInDays);
        setIsLoading(false);
    }

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(selectedSubtasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setSelectedSubtasks(items);
        setOrderChanged(true);
    };

    const handleToggle = () => {
        setIsChecked(!isChecked);
    };

    const generatePDF = () => {
        const elementToCapture = document.getElementById('elementId');
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();

        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedDate = `${formattedMonth}/${formattedDay}/${year}`;

        html2canvas(elementToCapture)
            .then(canvas => {
                const doc = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4",
                });
                doc.addImage(tceLogo, 'jpge',10, 0, 35, 30);
                doc.setFontSize(25);
                doc.text('Thiagarajar College Of Engineering', 45, 10)
                doc.setFontSize(12);
                doc.text('Department of Modernization,Development and Restoration (DMDR)', 50, 20)
                doc.setFontSize(20);
                doc.text(selectedItem.work_name + ' Data Report', 30, 40);
                doc.setFontSize(14);
                doc.text('Work Description    : ' + selectedItem.work_description, 40, 60);
                doc.text('Cost Of Work          : ' + 'Rs.' +  selectedItem.wage, 40, 70);
                doc.text('Advance Paid         : ' + (advancePaid === 0 ? "No" : "Rs." + advancePaid), 40, 80);
                doc.text('Advance Paid Date: ' + (dateOfPaid === '-' ? "-" : dateOfPaid.slice(0, 10)), 40, 90)
                doc.text('Bill Paid                  : ' + (selectedItem.bill_paid ? "Yes" : "No"), 40, 100);
                doc.text('Start Date               : ' + selectedItem.start_date.slice(0, 10), 40, 110);
                doc.text('Due Date                : ' + selectedItem.due_date.slice(0, 10), 40, 120);
                doc.text('Work Status           : ' + (selectedItem.work_status === 'A' ? "Active Task" : "Completed Task"), 40, 130);
                doc.text('Coordinator            : ' + selectedItem.coordinator, 40, 140);
                doc.text('Worker                   : ' + selectedItem.worker_names, 40, 150);
                doc.text('Total SubTask       : ' + selectedSubtasks.length, 40, 160);
                doc.text('Downloaded on ' + formattedDate, 10, 210);
                // Save the PDF with a name
                doc.save(selectedItem.work_name + '.PDF');
            })
            .catch(error => {
                // Handle errors if any
                console.error('Error generating PDF:', error);
            });
    };


    const handleClose = () => {
        setSelectedItem(null);
        setSelectedComments([]);
        if (orderChanged) {
            selectedSubtasks.map((v, i) => {
                const url = `/db/updateorder?task_id=${v.task_id}&new_order=${i + 1}`;

                fetch(url, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Success:", data);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            });
            setOrderChanged(false);
        }
        if (padiBills.has(selectedItem.work_id)) {
            var requestOptions = {
                method: 'PUT',
                redirect: 'follow'
            };

            fetch(`/db/updatebill?workid=${selectedItem.work_id}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
    }

    const handleSubmit = () => {
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_type: 'A',
                paid_amount: enteredAdvance,
                paid_date: enteredDate.toISOString(),
                work: selectedItem.work_id,
            }),
            redirect: 'follow'
        };

        fetch("/db/addpayment", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                setIsChecked(false);
            })
            .catch(error => console.log('error', error));
        setAdvancePaid(enteredAdvance);
        setDateOfPaid(enteredDate.toISOString());
    }

    const handleBill = () => {
        if (padiBills.has(selectedItem.work_id)) {
            padiBills.delete(selectedItem.work_id);
        } else {
            padiBills.set(selectedItem.work_id, true);
        }
    }


    const updateVerificationCode = async () => {
        const endpoint = '/db/updatevcode';
        try {
            const requestBody = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}),
            };
            const response = await fetch(endpoint, requestBody);
            if (response.ok) {
                console.log('Update successful');
                localStorage.setItem('IsPaneOpen', 'true');
            } else {
                console.error('Update failed:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
        window.location.reload();
    }

    const HandleForward = () => {
        navigate(routeMappings["bHWtcH10="], {state: {fromAdminHome: true}});
    }

    const handleAssignClick = (workerString) => {
        navigate('/NewTask', { state: { worker: workerString } });
    };

    const HandleUndo = (subtask) => {
        console.log(subtask.task_id);
    }


    return (
        <>
            {loading ? (
                <div className="loader-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className='ahome1'>
                    <div>
                        <div className='head-div'>
                            <h1 className="para">Welcome to DMDR - Head Portal</h1>
                        </div>
                        <hr className="heading-line"/>
                    </div>
                    <div className='container-div'>
                        {topworks.length === 0 ? (
                            <div className='active-div'>
                                <h1 className='title-div'>Active Projects</h1>
                                <img style={{width: "90%"}} src={ noData } />
                                <p className='notask-p'>No Active Task Assigned</p>
                                <button className='view-all-btn' onClick={HandleForward}>VIEW ALL &gt;</button>
                            </div>
                        ):(
                            <div className='active-div'>
                                <h1 className='title-div'>Active Projects</h1>
                                {topworks.map((x, i) => (
                                    <div key={i} className='active-inner-div'>
                                        <div className='Active-head-div'>
                                            <Tooltip text={x.work_name}>
                                                <h2 className='active-title-h2' onClick={() => {
                                                    HandleSelectedItem(x)
                                                }}>{x.work_name.slice(0,10)}</h2>
                                            </Tooltip>
                                            <div className='date-div'>
                                                <img style={{width: '22px', marginRight: '10px'}} src={Flag}/>
                                                <h2 className='active-title-date-h2'>{new Date(x.due_date).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</h2>
                                            </div>
                                        </div>
                                        <div style={{margin: '20px'}}>
                                            <ProgressBar striped variant="warning" animated
                                                        now={x.completed_subtasks}/>
                                        </div>
                                    </div>
                                ))}
                                <button className='view-all-btn' onClick={HandleForward}>VIEW ALL &gt;</button>
                            </div>
                        )}
                        <PopUp trigger={selectedItem !== null}>
                            {isloading ? (
                                <div className="overlay">
                                    <div className="puff-loader"><PuffLoader/></div>
                                </div>
                            ) : (
                                selectedItem && (
                                    <div id='elementId'>
                                        <h1 className="close-btn" onClick={handleClose}>x</h1>
                                        {/* Display information related to the selectedItem here */}
                                        <h2 className='popup-head'>Work Details:</h2>
                                        <hr className='heading-line'/>
                                        <div className='detail-grid-1'>
                                            <div className="detail">
                                                <span className="label">Work Name</span>:<span className='label-inner'>{selectedItem.work_name}</span>
                                            </div>
                                            <div className="detail">
                                                <span className="label">Start Date</span>:<span className='label-inner'>{selectedItem.start_date.slice(0, 10)}</span>
                                            </div>
                                            <div className="detail">
                                                <span className="label">Coordinator</span>:<span className='label-inner'>{selectedItem.coordinator}</span>
                                            </div>
                                            {dueDateDiff < 0 && (
                                                <div className="detail">
                                                    <span className="label">Overdue by</span>:<span className='label-inner' style={{color: 'red'}}>{Math.abs(Math.round(dueDateDiff))} {Math.abs(Math.round(dueDateDiff)) === 1 ? 'day' : 'days'}</span>
                                                </div>
                                            )}
                                            <div className="detail">
                                                <span className="label">Due Date</span>:<span className='label-inner'>{selectedItem.due_date.slice(0, 10)}</span>
                                            </div>
                                            <div className="detail">
                                                <span className="label">Worker(s)</span>:<span className='label-inner'>{selectedItem.worker_names}</span>
                                            </div>
                                            <div className="detail">
                                                <span className="label">Total Expense</span>:<span className='label-inner'>₹{selectedItem.wage}</span>
                                            </div>

                                            {advancePaid === 0 ?
                                                <>
                                                    <p className='label-2'>Advance Paid?
                                                        <Switch checked={isChecked} onChange={handleToggle}/></p>
                                                    
                                                </>
                                                :
                                                <div>
                                                    <div className="detail" style={{marginBottom: "20px"}}>
                                                        <span className='label'>Advance Paid</span>:<span className='label-inner'> ₹{advancePaid}</span>
                                                    </div>
                                                    <div className="detail">
                                                        <span className='label'>Advance Paid Date</span>:<span className='label-inner'>{dateOfPaid.slice(0, 10)}</span>
                                                    </div>
                                                </div>
                                            }
                                            {selectedItem.bill_paid || padiBills.get(selectedItem.work_id) ?
                                                <p className='label-2'>Bill Paid ✅</p> :
                                                <p className='label-2'>Bill Paid? <Switch onChange={handleBill}></Switch></p>
                                            }
                                        </div>
                                        {<>
                                            <div>
                                                {isChecked ?
                                                    <div className='advance-paid-div'>
                                                        <input type='number'
                                                            placeholder='Advance to be Paid'
                                                            className='advance-input'
                                                            value={enteredAdvance}
                                                            onChange={(e) => {
                                                                setEnteredAdvance(e.target.value);
                                                            }}/>
                                                        <input type='date'
                                                            value={enteredDate.toISOString().split('T')[0]}
                                                            className='advance-date-input'
                                                            onChange={(e) => {
                                                                setEnteredDate(new Date(e.target.value));
                                                            }} placeholder='Date'/>
                                                        <button onClick={handleSubmit}
                                                                className='advance-submit-bitton'>Submit
                                                        </button>
                                                    </div>
                                                    : ''
                                                }
                                            </div>
                                        </>}
                                        <div className='popup-piechart'>
                                            <p className='label-2'>Work Progress: </p>
                                            <ProgressChart
                                                percentage={selectedItem.total_subtasks !== 0 ? selectedItem.completed_subtasks : 0}
                                            />
                                            <p className='label-2'>Print As PDF : <button className='print-button' onClick={generatePDF}><img src={Print}
                                            alt='print'/>
                                            </button></p>
                                        </div>
                                        {<div>
                                            <p className='label-2'>Sub Tasks: </p>
                                            <div className='subtask-table'>
                                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                                    <Droppable droppableId="subtasks">
                                                        {(provided) => (
                                                            <ol {...provided.droppableProps} ref={provided.innerRef}>
                                                                {selectedSubtasks.map((subtask, index) => (
                                                                    <Draggable key={subtask.task_id}
                                                                               draggableId={String(subtask.task_id)}
                                                                               index={index}>
                                                                        {(provided) => (
                                                                            <div>
                                                                                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                                                                    <li {...provided.draggableProps} {...provided.dragHandleProps}
                                                                                        ref={provided.innerRef}>
                                                                                        <div className='sub-star'>
                                                                                            <div>
                                                                                                {subtask.task_name}
                                                                                            </div>
                                                                                        </div>
                                                                                    </li>
                                                                                    <p className='p-ele'>  -{subtask.weightage} %</p>
                                                                                    <div className='undo-div'>
                                                                                        <p      className='p-ele'>Completed: {subtask.completed
                                                                                        ? '✅' : '❌'}</p>
                                                                                        {subtask.completed ? (
                                                                                            <div>
                                                                                                <button className='undo-btn' onClick={() => HandleUndo(subtask)}>Undo</button>
                                                                                            </div>
                                                                                        ) : (
                                                                                            <button className='undo-in'>Undo</button>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                <hr/>
                                                                            </div>
                                                                        )}
                                                                    </Draggable>
                                                                ))}
                                                                {provided.placeholder}
                                                            </ol>
                                                        )}
                                                    </Droppable>
                                                </DragDropContext>
                                            </div>
                                            <p className='label-2'>Comments/Queries : </p>
                                            {selectedComments.map((comment, index) =>
                                                <CommentCard key={index} comment={comment}/>
                                            )}
                                        </div>
                                        }
                                    </div>
                                )
                            )}
                        </PopUp>
                        <div className='work-container-div'>
                            <div className='create-work-div'>
                                <h1 className='title-div'>Create Work</h1>
                                <a style={{display: 'flex', justifyContent: 'center'}} href={'/NewTask'}><img
                                    className='create-img-div' src={CreateButton} alt='create-btn'/></a>
                            </div>
                            <div className='work-div'>
                                <img className='work-img-div' src={WorkImg} alt='Work'/>
                                <a href={'/WorkReport'}>
                                    <button className='coo-button'>WORK REPORTS</button>
                                </a>
                            </div>
                        </div>
                        <div className='manage-work-div'>
                            <div className='manage-agencie-div' onClick={() => setIsPaneOpen(true)}>
                                <img className='arrow-img' src={ ArrowLeft }/>
                                <div className='mang-div'>
                                    <p className='mang-agen-p'>AGENCIES</p>
                                    <img className='mange-img' src={ manageWorkers }/>
                                </div>
                            </div>
                            <div className='piechart-main-div'>
                                <h1 className='title-div'>Progress chart:</h1>
                                <div className="piechart-div">
                                    <div>
                                        {CompletedPercent === 0 && ActivePercent === 0 ? 
                                            <PieChart
                                                data={[
                                                    {title: 'NoWork', value: 100, color: 'rgba(0, 0, 0, 0.125)'}
                                                ]}
                                            />
                                        : 
                                            <PieChart
                                                data={[
                                                    {title: 'Completed', value: CompletedPercent, color: '#7cd57c'},
                                                    {title: 'Active', value: ActivePercent, color: '#640000'},
                                                ]}
                                            />
                                        }   
                                    </div>
                                    <div>
                                        <div className='piechart-lable-div'>
                                            <button className='piechart-colour-info-active'></button>
                                            <p className='piechart-colour-char-active'>Active</p>
                                        </div>
                                        <div className='piechart-lable-div'>
                                            <button className='piechart-colour-info-completed'></button>
                                            <p className='piechart-colour-char-active'>Completed</p>
                                        </div>
                                        <div className='piechart-lable-div'>
                                            <button style={{backgroundColor: 'rgba(0, 0, 0, 0.125)'}} className='piechart-colour-info-completed'></button>
                                            <p className='piechart-colour-char-active'>No Task</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <SlidingPane
                            className="notification-head"
                            overlayClassName="custom-overlay"
                            width={770}
                            closeIcon={<img width="25" height="25"
                                            src="https://img.icons8.com/plasticine/100/delete-sign.png"
                                            alt="delete-sign"/>}
                            isOpen={isPaneOpen}
                            title="Manage Agencies"
                            subtitle='view or change the verification code for registers and manage the agencies registered'
                            onRequestClose={() => {
                                setIsPaneOpen(false);
                            }}
                        >
                            <div className='verfication-div'>
                                <div className='code-head-div'>
                                    <h3 className='datepickerhead-h3'>Verification code: </h3>
                                    <p style={{margin: '0', color: '#640000'}}>(code for agency to register)</p>
                                </div>
                                <div className='code-div'>
                                    <VerificationCodeDisplay/>
                                    <button className="update-button" onClick={updateVerificationCode}>Refresh
                                    </button>
                                </div>
                            </div>
                            <div className="notification-inner">
                                <div>
                                    <table className="workers-table">
                                        <thead>
                                        <tr>
                                            <th>Worker Name</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                            <th>Assign Work</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {workers.map((worker) => (
                                            <tr key={worker.worker_id}>
                                                <td>{worker.worker_name}</td>
                                                <td><a href={`mailto:${worker.email}`}>{worker.email}</a></td>
                                                <td>{worker.phone_number}</td>
                                                <td>
                                                    <button onClick={() => handleAssignClick(worker.worker_id+"?"+worker.worker_name)}>Assign</button>
                                                </td>
                                            </tr>

                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </SlidingPane>
                    </div>
                </div>
            )}
        </>
    )
}

export default NewCoordinator;