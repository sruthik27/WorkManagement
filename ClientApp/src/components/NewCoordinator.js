import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useLocation, useNavigate} from "react-router-dom";
import routeMappings from "../routeMappings";
import "./AdminMain.css";
import "./NewCoordinator.css";
import CreateButton from "./create_btn.gif";
import WorkImg from "./work_img.gif";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Flag from "./flag_icon.svg";
import {PieChart} from 'react-minimal-pie-chart';
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";
import VerificationCodeDisplay from "./VerificationCodeDisplay";


const NewCoordinator = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [topworks, setTopworks] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [CompletedPercent, setCompletedPercent] = useState(0);
    const [ActivePercent, setActivePercent] = useState(0);
    const [isPaneOpen, setIsPaneOpen] = useState(false);


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
            console.log(data);
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
                            <h1 className="para">Welcome to DMDR - Head Portal</h1>\
                        </div>
                        <hr className="heading-line"/>
                    </div>
                    <div className='container-div'>
                        <div className='active-div'>
                            <h1 className='title-div'>Active Projects</h1>
                            {topworks.map((x, i) => (
                                <div key={i} className='active-inner-div'>
                                    <div className='Active-head-div'>
                                        <h2 className='active-title-h2'>{x.work_name}</h2>
                                        <div className='date-div'>
                                            <img style={{width: '22px', marginRight: '10px'}} src={Flag}/>
                                            <h2 className='active-title-h2'>{new Date(x.due_date).toLocaleDateString('en-US', {
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
                        <div>
                            <div className="piechart-div">
                                <h2 className='table-head'>Progress chart:</h2>
                                <PieChart
                                    data={[
                                        {title: 'Completed', value: CompletedPercent, color: '#7cd57c'},
                                        {title: 'Active', value: ActivePercent, color: '#FFF9DF'},
                                    ]} label={({dataEntry}) => dataEntry.title}
                                    labelStyle={{
                                        fontSize: '6px',
                                    }}
                                />
                            </div>
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
                            closeIcon={<img width="50" height="50"
                                            src="https://img.icons8.com/plasticine/100/delete-sign.png"
                                            alt="delete-sign"/>}
                            isOpen={isPaneOpen}
                            title="Manage Agencies"
                            subtitle='view or change the verification code for registers and manage the agencies registered'
                            onRequestClose={() => {
                                setIsPaneOpen(false);
                            }}
                        >
                            <div style={{display: 'flex'}}>
                                    <h3 className='datepickerhead'>Verification code: </h3>
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
                                                    <button>Assign</button>
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