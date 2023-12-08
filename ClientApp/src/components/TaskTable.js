import React, {Component} from 'react';
import PopUp from "./PopUp";
import PieChart from './PieChart';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import './TaskTable.css';
import './AdminHome.css';
import CommentBox from './CommentBox';
import CommentCard from './CommentCard';
import Switch from '@mui/material/Switch';
import {Puff} from 'react-loader-spinner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Print from "./print.svg";

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

class TaskTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTask: [],
            completeTask: [],
            selectedItem: null,
            selectedSubtasks: [],
            selectedComments: [],
            selectedDate: new Date(),
            orderChanged: false,
            editable: this.props.editable,
            dueDateDiff: 0,
            advancePaid: 0,
            dateOfPaid: "-",
            enteredAdvance: "",
            enteredDate: new Date(),
            isChecked: false,
            nowPaid: false,
            paidbills: new Map(),
            isLoading: false,
        };
    }

    componentDidMount() {
        // Check if itemData is available before processing
        if (this.props.data.length > 0) {
            this.processData(this.props.data);
        }
        console.log('Rendering Puff');
    }

    // Add componentDidUpdate to handle updates to props.data
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.data !== this.props.data) {
            this.processData(this.props.data);
        }
        if (prevState.selectedDate !== this.state.selectedDate) {
            this.processData(this.props.data);
        }
    }

    handleItemClick = async (item) => {
    // Set the selected item details when a p tag is clicked
    this.setState({ selectedItem: true,isLoading: true}, async () => {
        console.log(this.state.isLoading); // This will log the updated state

        let fetchedtasks = await fetch(`/db/gettasks?n=${item.work_id}`);
        let tasks = await fetchedtasks.json();

        let fetchedpayments = await fetch(`/db/getpayments?workid=${item.work_id}`);
        let payments = await fetchedpayments.json();
        let adv = payments.find(x => x.payment_type === 'A');
        if (adv !== undefined) {
            let adv_amt = adv.paid_amount;
            let adv_date = adv.paid_date;
            this.setState({ advancePaid: adv_amt, dateOfPaid: adv_date });
        } else {
            this.setState({ advancePaid: 0, dateOfPaid: '-' });
        }

        let fetchedcomments = await fetch(`/db/getreviews?workid=${item.work_id}`);
        let comments = await fetchedcomments.json();
        if (comments.length > 0) {
            this.setState({ selectedComments: comments });
        }

        let currentDate = new Date();
        let dueDate = new Date(item.due_date);
        let diffInTime = dueDate.getTime() - currentDate.getTime();
        let diffInDays = diffInTime / (1000 * 3600 * 24);

        // Use the callback function of setState to ensure the state is updated
        this.setState({ selectedItem: item, selectedSubtasks: tasks, dueDateDiff: diffInDays }, () => {
            this.setState({ isLoading: false }, () => {
                console.log(this.state.isLoading); // This will log the updated state
            });
        });
    });
}

    handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(this.state.selectedSubtasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        this.setState({selectedSubtasks: items, orderChanged: true});
    };

    handleClose = () => {
        this.setState({selectedItem: null});
        this.setState({selectedComments: []});
        if (this.state.orderChanged) {
            this.state.selectedSubtasks.map((v, i) => {
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
            this.setState({orderChanged: false});
        }
        if (this.state.paidbills.has(this.state.selectedItem.work_id)) {
            var requestOptions = {
                method: 'PUT',
                redirect: 'follow'
            };

            fetch(`/db/updatebill?workid=${this.state.selectedItem.work_id}`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
    }

    processData(data) {
        let activeTask = [];
        let completeTask = [];

        // Filter the data based on the selectedDate and start_date
        data = data.filter(x => new Date(x.start_date) <= this.state.selectedDate);

        data.forEach(x => {
            if (x.work_status === 'A') activeTask.push(x);
            else if (x.work_status === 'C') completeTask.push(x);
        });

        this.setState({
            activeTask,
            completeTask,
        });
    }

    handleToggle = () => {
        this.setState(prevState => ({
            isChecked: !prevState.isChecked
        }));
    };


    handleSubmit = () => {
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_type: 'A',
                paid_amount: this.state.enteredAdvance,
                paid_date: this.state.enteredDate.toISOString(),
                work: this.state.selectedItem.work_id,
            }),
            redirect: 'follow'
        };

        fetch("/db/addpayment", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                this.setState({isChecked: false});
            })
            .catch(error => console.log('error', error));
        this.setState({advancePaid: this.state.enteredAdvance, dateOfPaid: this.state.enteredDate.toISOString()});
    }

    handleBill = () => {
        if (this.state.paidbills.has(this.state.selectedItem.work_id)) {
            this.state.paidbills.delete(this.state.selectedItem.work_id);
        } else {
            this.state.paidbills.set(this.state.selectedItem.work_id, true);
        }
    }

    generatePDF = () => {
        const elementToCapture = document.getElementById('elementId');
        const currentDate = new Date();
        
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();

        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedDate = `${formattedMonth}/${formattedDay}/${year}`;

        html2canvas(elementToCapture)
            .then(canvas =>{
                const doc = new jsPDF({
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4",
                });
                doc.setFontSize(14);
                // Add some text
                doc.text('Work Name: '+this.state.selectedItem.work_name, 20, 30);
                doc.text('Work Description: '+this.state.selectedItem.work_description, 20, 40);
                doc.text('Cost Of Work: '+this.state.selectedItem.wage, 20, 50);
                doc.text('Advance Paid: '+(this.state.selectedItem.advancePaid ? "YES" : "NO"), 20, 60);
                doc.text('Bill Paid: '+(this.state.selectedItem.bill_paid ? "YES" : "NO"), 20, 70);
                doc.text('Start Date: '+this.state.selectedItem.start_date.slice(0, 10), 20, 80);
                doc.text('Due Date: '+this.state.selectedItem.due_date.slice(0, 10), 20, 90);
                doc.text('Work Status: '+(this.state.selectedItem.work_status === 'A' ? "Active Task" : "Completed Task"), 20, 100);
                doc.text('Coordinator: '+this.state.selectedItem.coordinator, 20, 110);
                doc.text('Worker: '+this.state.selectedItem.worker, 20, 120);
                doc.text('Total SubTask: '+this.state.selectedSubtasks.length, 20, 130);
                doc.text('Downloaded on '+formattedDate, 20, 140);
                // Save the PDF with a name
                doc.save(this.state.selectedItem.work_name + '.PDF');
            })
            .catch(error => {
                // Handle errors if any
                console.error('Error generating PDF:', error);
            });
    };

    render() {
        const {
            activeTask,
            completeTask,
            selectedItem,
            selectedSubtasks,
            dueDateDiff, advancePaid, dateOfPaid, editable, isChecked, paidbills,isLoading
        } = this.state;

        const star = "⭐";

        return (
            <>
                <div className="datepickerwrapper">
                    <p className='datepickerhead'> Filter by date: <input
                        type="date"
                        className="custom-datepicker"
                        value={this.state.selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => this.setState({selectedDate: new Date(e.target.value)})}
                    />
                    </p>
                </div>
                <div className="task-table">
                    <div>
                        <p className='table-head'>Active Task</p>
                        <div className='scroll'>
                            <ul>
                                {activeTask.map((x, i) => (
                                    <p className='table_content' key={i} onClick={() => this.handleItemClick(x)}>
                                        {x.work_name}
                                    </p>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='v1'></div>
                    <div>
                        <p className='table-head'>Completed Task</p>
                        <div className='scroll'>
                            <ul>
                                {completeTask.map((x, i) => (
                                    <p className='table_content' key={i} onClick={() => this.handleItemClick(x)}>
                                        {x.work_name}
                                    </p>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <PopUp trigger={selectedItem !== null} id={"popup"}>
                    {/* Pass the selectedItem as a prop to the PopUp */}
                    {isLoading ?
                        <div className="overlay">
                            <div className="puff-loader"><PuffLoader /></div>
                        </div>: (
                    selectedItem && (
                        <div id='elementId'>
                            {console.log(selectedItem)}
                            <h1 className="close-btn" onClick={this.handleClose}>x</h1>
                            {/* Display information related to the selectedItem here */}
                            <h2 className='popup-head'>Work Details:</h2>
                            <hr className='line'/>
                            <div className='popup-info'>
                                <div className='popup-details1'>
                                    <p>Work Name: {selectedItem.work_name}</p>
                                    <p>Time
                                        Period: {selectedItem.start_date.slice(0, 10)} to {selectedItem.due_date.slice(0, 10)}</p>
                                    {dueDateDiff < 0 && (
                                        <p style={{color: 'red'}}>Overdue
                                            by {Math.abs(Math.round(dueDateDiff))} {Math.abs(Math.round(dueDateDiff)) === 1 ? 'day' : 'days'}</p>
                                    )}
                                    <p>Coordinator: {selectedItem.coordinator}</p>
                                    <p>Worker: {selectedItem.worker}</p>
                                    <p>Total Expense: ₹{selectedItem.wage}</p>
                                    {editable ?
                                        <>{advancePaid === 0 ?
                                            <>
                                                <p>Advance paid?
                                                    <Switch checked={isChecked} onChange={this.handleToggle}/></p>
                                                {isChecked ?
                                                    <div>
                                                        <input type='number'
                                                               placeholder='Advance to be Paid'
                                                               className='advance-input'
                                                               value={this.state.enteredAdvance}
                                                               onChange={(e) => {
                                                                   this.setState({enteredAdvance: e.target.value});
                                                               }}/>
                                                        <input type='date'
                                                               value={this.state.enteredDate.toISOString().split('T')[0]}
                                                               className='advance-date-input'
                                                               onChange={(e) => {
                                                                   this.setState({enteredDate: new Date(e.target.value)});
                                                               }} placeholder='Date'/>
                                                        <button onClick={this.handleSubmit} className='advance-submit-bitton'>Submit</button>
                                                    </div>
                                                    : ''
                                                }
                                            </>
                                            :
                                            <div>
                                                <p>Advance paid: ₹{advancePaid}</p>
                                                <p>Advance paid date: {dateOfPaid.slice(0, 10)}</p>
                                            </div>}
                                            {selectedItem.bill_paid || paidbills.get(selectedItem.work_id) ?
                                                <p>Bill paid ✅</p> :
                                                <p>Bill paid? <Switch onChange={this.handleBill}></Switch></p>}</>

                                        :
                                        <>
                                            <p>Advance paid: ₹{advancePaid}</p>
                                            <p>Advance paid date: {dateOfPaid.slice(0, 10)}</p>
                                            {selectedItem.bill_paid ? <p>Bill paid ✅</p> : <p>Bill paid ❌</p>}
                                        </>
                                    }

                                    <p>Sub Tasks: </p>
                                </div>
                                <div className='popup-piechart'>
                                    <p>Work Progress: </p>
                                    <PieChart
                                        percentage={selectedItem.total_subtasks !== 0 ? selectedItem.completed_subtasks : 0}
                                    />
                                    {this.state.editable ? <p>{""}</p> : <CommentBox workid={selectedItem.work_id}/>}
                                    <button className='print-button' onClick={this.generatePDF}><img src={Print} alt='print'/></button>
                                </div>
                            </div>
                            {this.state.editable ?
                                <div className='subtask-div'>
                                    <div className='subtask-table'>
                                        <DragDropContext onDragEnd={this.handleOnDragEnd}>
                                            <Droppable droppableId="subtasks">
                                                {(provided) => (
                                                    <ol {...provided.droppableProps} ref={provided.innerRef}>
                                                        {selectedSubtasks.map((subtask, index) => (
                                                            <Draggable key={subtask.task_id}
                                                                       draggableId={String(subtask.task_id)}
                                                                       index={index}>
                                                                {(provided) => (
                                                                    <div>
                                                                        <li {...provided.draggableProps} {...provided.dragHandleProps}
                                                                            ref={provided.innerRef}>
                                                                                <div className='sub-star'>
                                                                                    <div>
                                                                                        {subtask.task_name}
                                                                                    </div>
                                                                                </div>
                                                                        </li>
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
                                    <p>Comments/Queries</p>
                                    {this.state.selectedComments.map((comment, index) =>
                                        <CommentCard key={index} comment={comment} />
                                    )}

                                </div>
                                :
                                <ol>
                                    {selectedSubtasks.map((subtask, index) => <li key={index}>{subtask.task_name}</li>)}
                                </ol>
                            }
                        </div>
                    ))}
                </PopUp>
            </>
        );
    }

}

export default TaskTable;