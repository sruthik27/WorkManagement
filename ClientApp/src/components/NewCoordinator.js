import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useLocation, useNavigate} from "react-router-dom";
import routeMappings from "../routeMappings";
import "./AdminMain.css";
import "./NewCoordinator.css";
import CreateButton from "./create_btn.gif";
import WorkImg from "./work_img.gif";
import ProgressBar from 'react-bootstrap/ProgressBar';

const NewCoordinator = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!location.state || !location.state.fromAdminHome) {
            navigate('/');
        } else {
            //fetchData();
        }
    }, []);

    const HandleForward = () => {
        navigate(routeMappings["bHWtcH10="],{ state: { fromAdminHome: true } });
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
                            <div className='active-inner-div'>
                                <div className='Active-head-div'>
                                    <h2 className='active-title-h2'>work 1</h2>
                                    <h2 className='active-title-h2' >December-2023</h2>
                                </div>
                                <div>
                                <ProgressBar striped variant="warning" now={70} />
                                </div>
                            </div>
                            <div className='active-inner-div'>
                                <div className='Active-head-div'>
                                    <h2 className='active-title-h2'>work 2</h2>
                                    <h2 className='active-title-h2' >December-2023</h2>
                                </div>
                                <div>
                                    <ProgressBar striped variant="warning" now={60} />
                                </div>
                            </div>
                            <div className='active-inner-div'>
                                <div className='Active-head-div'>
                                    <h2 className='active-title-h2'>work 3</h2>
                                    <h2 className='active-title-h2' >December-2023</h2>
                                </div>
                                <div>
                                <ProgressBar striped variant="warning" now={45} />
                                </div>
                            </div>
                            <button className='view-all-btn' onClick={HandleForward}>VIEW ALL &gt;</button>
                        </div>
                        <div className='work-container-div'>
                            <div className='create-work-div'>
                                <h1 className='title-div'>Create Work</h1>
                                <a style={{display: 'flex', justifyContent: 'center'}} href={'/NewTask'}><img className='create-img-div' src={ CreateButton } alt='create-btn'/></a>
                            </div>
                            <div className='work-div'>
                                <img className='work-img-div' src={ WorkImg } alt='Work'/>
                                <a href={'/WorkReport'}><button className='coo-button' >WORK REPORTS</button></a>
                            </div>
                        </div>
                        <div>
                            <h1>Need work</h1>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NewCoordinator;