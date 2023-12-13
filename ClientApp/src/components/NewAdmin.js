import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useLocation, useNavigate, Link} from "react-router-dom";
import routeMappings from "../routeMappings";
import "./AdminMain.css";
import "./NewCoordinator.css";
import "./TaskTable.css";
import WorkImg from "./work_img.gif";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Flag from "./flag_icon.svg";
import {PieChart} from 'react-minimal-pie-chart';
import ProgressChart from './ProgressChart';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import PopUp from './PopUp';
import {Puff} from 'react-loader-spinner';
import Print from "./print.svg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CommentBox from "./CommentBox";
import noData from './noDataInActive.png';
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

const NewAdmin = () => {
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
    const [orderChanged, setOrderChanged] = useState(false);
    const [dueDateDiff, setDueDateDiff] = useState(0);
    const [advancePaid, setAdvancePaid] = useState(0);
    const [dateOfPaid, setDateOfPaid] = useState("-");
    const [selectedItem, setSelectedItem] = useState(null);
    const [padiBills, setPaidBills] = useState(new Map());
    const [selectedComments, setSelectedComments] = useState([]);
    

    useEffect(() => {
        if (!location.state || !location.state.fromAdminHome) {
            navigate('/');
        } else {
            setLoading(true);
            fetchData();
            getWorkers();
        }
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/db/getnearworks');
            const data = await response.json();
            setActiveData(data.worksData);
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
        let dueDate = new Date(item.due_date);
        let diffInTime = dueDate.getTime() - currentDate.getTime();
        let diffInDays = diffInTime / (1000 * 3600 * 24);
        setDueDateDiff(diffInDays);
        setIsLoading(false);
    }

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
                doc.setFontSize(25);
                doc.text('Thiagarajan College Of Engineering', 30, 10)
                doc.setFontSize(12);
                doc.text('Department of Modernization,Development and Restoration (DMDR)', 35, 20)
                doc.setFontSize(20);
                doc.text(selectedItem.work_name + ' Data Report', 75, 30);
                doc.setFontSize(14);
                doc.text('Work Description    : ' + selectedItem.work_description, 30, 50);
                doc.text('Cost Of Work          : ' + 'Rs.' +  selectedItem.wage, 30, 60);
                doc.text('Advance Paid         : ' + (advancePaid === 0 ? "No" : "Rs." + advancePaid), 30, 70);
                doc.text('Advance Paid Date: ' + (dateOfPaid === '-' ? "-" : dateOfPaid.slice(0, 10)), 30, 80)
                doc.text('Bill Paid                  : ' + (selectedItem.bill_paid ? "YES" : "NO"), 30, 90);
                doc.text('Start Date               : ' + selectedItem.start_date.slice(0, 10), 30, 100);
                doc.text('Due Date                : ' + selectedItem.due_date.slice(0, 10), 30, 110);
                doc.text('Work Status           : ' + (selectedItem.work_status === 'A' ? "Active Task" : "Completed Task"), 30, 120);
                doc.text('Coordinator            : ' + selectedItem.coordinator, 30, 130);
                doc.text('Worker                   : ' + selectedItem.worker_names, 30, 140);
                doc.text('Total SubTask       : ' + selectedSubtasks.length, 30, 150);
                doc.text('Downloaded on ' + formattedDate, 10, 200);
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

    const HandleForward = () => {
        navigate(routeMappings["aGVsbG9="],{ state: { fromAdminHome: true } });
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
                            <h1 className="para">Welcome to DMDR - Admin Portal</h1>
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
                                            <h2 className='active-title-h2' onClick={() => {
                                                HandleSelectedItem(x)
                                            }}>{x.work_name}</h2>
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
                                    <div className="puff-loader"><PuffLoader /></div>
                                </div> ): (
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
                                        <div className="detail">
                                            <span className="label">Advance Paid</span>:<span className='label-inner'>₹{advancePaid}</span>
                                        </div>
                                        <div className="detail">
                                            {selectedItem.bill_paid ? <p className='label'>Bill paid ✅</p> : <p className='label'>Bill paid ❌</p>}
                                        </div>
                                        <div className="detail">
                                            <span className="label">Advance Paid Date</span>:<span className='label-inner'>{dateOfPaid.slice(0, 10)}</span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Print As PDF</span>:
                                            <button className='print-button' onClick={generatePDF}><img src={Print} alt='print'/></button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='popup-piechart-admin'>
                                            <p className='label-2'>Work Progress: </p>
                                            <ProgressChart
                                                percentage={selectedItem.total_subtasks !== 0 ? selectedItem.completed_subtasks : 0}
                                            />
                                            <CommentBox workid={selectedItem.work_id}/>
                                        </div>
                                    </div>
                                    <div>
                                        <p className='label'>Sub Tasks: </p>
                                        <div style={{marginLeft: "20px"}}>
                                            {selectedSubtasks.map((subtask, index) => <p key={index}>{index + 1}.{subtask.task_name}</p>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </PopUp>
                        <div className='work-container-div' style={{flexDirection: "column-reverse"}}>
                            <div className='work-div-1'>
                                <img className='work-img-div' src={WorkImg} alt='Work'/>
                                <a href={'/WorkReport'}>
                                    <button className='coo-button'>WORK REPORTS</button>
                                </a>
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
                        <div className='piechart-mange-div'>
                            <div className='manage-agencie-div' onClick={() => setIsPaneOpen(true)}>
                                <p className='mange-agen-sym-p'>&lt;</p>
                                <p className='mang-agen-p'>MANAGE AGENCIES</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <SlidingPane
                            className="notification-head"
                            overlayClassName="custom-overlay"
                            width={700}
                            closeIcon={<img width="25" height="25"
                                            src="https://img.icons8.com/plasticine/100/delete-sign.png"
                                            alt="delete-sign"/>}
                            isOpen={isPaneOpen}
                            title="View Your Registered Agencies"
                            onRequestClose={() => {
                                setIsPaneOpen(false);
                            }}
                        >
                            <div className="notification-inner-admin">
                                <div>
                                    <table className="workers-table">
                                        <thead>
                                        <tr>
                                            <th>Worker Name</th>
                                            <th>Email</th>
                                            <th>Phone Number</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {workers.map((worker) => (
                                            <tr key={worker.worker_id}>
                                                <td>{worker.worker_name}</td>
                                                <td><a href={`mailto:${worker.email}`}>{worker.email}</a></td>
                                                <td>{worker.phone_number}</td>
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

export default NewAdmin;