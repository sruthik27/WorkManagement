import React, {Component} from 'react';
import PopUp from "./PopUp";
import PieChart from './PieChart';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import './TaskTable.css';
import './AdminHome.css';
import CommentBox from './CommentBox';
import Switch from '@mui/material/Switch';

class TaskTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTask: [],
            completeTask: [],
            selectedItem: null,
            selectedSubtasks: [],
            selectedDate: new Date(),
            orderChanged: false,
            editable: this.props.editable,
            dueDateDiff: 0,
            advancePaid: 0,
            dateOfPaid: "-",
            enteredAdvance:"",
            enteredDate: new Date(),
            isChecked: false

        };
    }

    componentDidMount() {
        // Check if itemData is available before processing
        if (this.props.data.length > 0) {
            this.processData(this.props.data);
        }
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
        let fetchedtasks = await fetch(`/db/gettasks?n=${item.work_id}`);
        let tasks = await fetchedtasks.json();

        let fetchedpayments = await fetch(`/db/getpayments?workid=${item.work_id}`);
        let payments = await fetchedpayments.json();
        let adv = payments.find(x => x.payment_type === 'A');
        if (adv !== undefined) {
            let adv_amt = adv.paid_amount;
            let adv_date = adv.paid_date;
            this.setState({advancePaid: adv_amt, dateOfPaid: adv_date})
        } else {
            this.setState({advancePaid: 0, dateOfPaid: '-'});
        }

        let currentDate = new Date();
        let dueDate = new Date(item.due_date);
        let diffInTime = dueDate.getTime() - currentDate.getTime();
        let diffInDays = diffInTime / (1000 * 3600 * 24);

        // Use the callback function of setState to ensure the state is updated
        this.setState({selectedItem: item, selectedSubtasks: tasks, dueDateDiff: diffInDays});
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

        fetch("https://localhost:7286/db/addpayment", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                this.setState({isChecked: false});
            })
            .catch(error => console.log('error', error));
        this.setState({advancePaid: this.state.enteredAdvance, dateOfPaid: this.state.enteredDate.toISOString()});
    }


    render() {
        const {
            activeTask,
            completeTask,
            selectedItem,
            selectedSubtasks,
            dueDateDiff, advancePaid, dateOfPaid, editable, isChecked
        } = this.state;

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
                    <div className='scroll'>
                        <p className='table-head'>Active Task</p>
                        <ul>
                            {activeTask.map((x, i) => (
                                <p className='table_content' key={i} onClick={() => this.handleItemClick(x)}>
                                    {x.work_name}
                                </p>
                            ))}
                        </ul>
                    </div>
                    <div className='v1'></div>
                    <div className='scroll'>
                        <p className='table-head'>Completed Task</p>
                        <ul>
                            {completeTask.map((x, i) => (
                                <p className='table_content' key={i} onClick={() => this.handleItemClick(x)}>
                                    {x.work_name}
                                </p>
                            ))}
                        </ul>
                    </div>
                </div>
                <PopUp trigger={selectedItem !== null}>
                    {/* Pass the selectedItem as a prop to the PopUp */}
                    {selectedItem && (
                        <div>
                            <h1 className="close-btn" onClick={this.handleClose}>x</h1>
                            {/* Display information related to the selectedItem here */}
                            <h2 className='popup-head'>Work Details:</h2>
                            <div className='popup-info'>
                                <div className='popup-details1'>
                                    <p>Work Name: {selectedItem.work_name}</p>
                                    <p>Time
                                        Period: {selectedItem.start_date.slice(0, 10)} to {selectedItem.due_date.slice(0, 10)}</p>
                                    {dueDateDiff < 0 && (
                                        <p style={{color: 'red'}}>Due
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
                                                               value={this.state.enteredAdvance}
                                                               onChange={(e) => {
                                                                   this.setState({enteredAdvance: e.target.value});
                                                               }}/>
                                                        <input type='date' value={this.state.enteredDate.toISOString().split('T')[0]}
                                                               onChange={(e) => {
                                                                   this.setState({enteredDate:new Date(e.target.value)});
                                                               }} placeholder='Date'/>
                                                        <button onClick={this.handleSubmit}>Submit</button>
                                                    </div>
                                                    : ''
                                                }
                                            </>
                                            :
                                            <div>
                                                <p>Advance paid: ₹{advancePaid}</p>
                                                <p>Advance paid date: {dateOfPaid.slice(0, 10)}</p>
                                            </div>}</>
                                        :
                                        <>
                                            <p>Advance paid: ₹{advancePaid}</p>
                                            <p>Advance paid date: {dateOfPaid.slice(0, 10)}</p>
                                        </>
                                    }

                                    <p>Sub Tasks: </p>
                                </div>
                                <div className='popup-piechart'>
                                    <p>Work Progress: </p>
                                    <PieChart
                                        percentage={selectedItem.total_subtasks !== 0 ? (selectedItem.completed_subtasks / selectedItem.total_subtasks) * 100 : 0}
                                    />
                                    {this.state.editable ? <p>{""}</p> : <CommentBox workid={selectedItem.work_id}/>}
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
                                                                            {subtask.task_name}
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
                                </div>
                                :
                                <ol>
                                    {selectedSubtasks.map((subtask, index) => <li key={index}>{subtask.task_name}</li>)}
                                </ol>
                            }

                        </div>
                    )}
                </PopUp>
            </>
        );
    }

}

export default TaskTable;