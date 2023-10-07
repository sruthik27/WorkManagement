import React, {Component} from 'react';
import PopUp from "./PopUp";
import PieChart from './PieChart';
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import './TaskTable.css';


class TaskTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTask: [],
            completeTask: [],
            incompleteTask: [],
            selectedItem: null,
            selectedSubtasks: [],
            selectedDate: new Date(),
            orderChanged: false,
            editable: this.props.editable,
            editMode: false
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
        // Set the selected item when a p tag is clicked
        let fetchedtasks = await fetch(`/db/gettasks?n=${item.work_id}`);
        let tasks = await fetchedtasks.json();
        // Use the callback function of setState to ensure the state is updated
        this.setState({selectedItem: item, selectedSubtasks: tasks});
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
        let incompleteTask = [];

        // Filter the data based on the selectedDate and start_date
        data = data.filter(x => new Date(x.start_date) <= this.state.selectedDate);

        data.forEach(x => {
            if (x.work_status === 'A') activeTask.push(x);
            else if (x.work_status === 'C') completeTask.push(x);
            else if (x.work_status === 'I') incompleteTask.push(x);
        });

        this.setState({
            activeTask,
            completeTask,
            incompleteTask,
        });
    }


    render() {
        const {activeTask, completeTask, incompleteTask, selectedItem, selectedSubtasks} = this.state;
        return (
            <>
                <div className="datepickerwrapper">
                    <DatePicker
                    className="custom-datepicker"
                    selected={this.state.selectedDate}
                    value = {this.state.selectedDate}
                    onChange={date => this.setState({selectedDate: date})}
                />
                </div>
                <div className="task-table">
                    <div>
                        <h2>Active Task</h2>
                        <ul>
                            {activeTask.map((x, i) => (
                                <p className='table_content' key={i} onClick={() => this.handleItemClick(x)}>
                                    {x.work_name}
                                </p>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2>Completed Task</h2>
                        <ul>
                            {completeTask.map((x, i) => (
                                <p className='table_content' key={i} onClick={() => this.handleItemClick(x)}>
                                    {x.work_name}
                                </p>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2>Incomplete Task</h2>
                        <ul>
                            {incompleteTask.map((x, i) => (
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
                                    <p>Coordinator: {selectedItem.coordinator}</p>
                                    <p>Worker: {selectedItem.worker}</p>
                                    <p>Total Expense: ₹{selectedItem.wage}</p>
                                    <p>Sub Task: </p>
                                </div>
                                <div className='popup-piechart'>
                                    <p>Work Progress: </p>
                                    <PieChart
                                        percentage={(selectedItem.completed_subtasks / selectedItem.total_subtasks) * 100}/>
                                </div>
                            </div>
                            {this.state.editable ? <div>
                                    <DragDropContext onDragEnd={this.handleOnDragEnd}>
                                        <Droppable droppableId="subtasks">
                                            {(provided) => (
                                                <ol {...provided.droppableProps} ref={provided.innerRef}>
                                                    {selectedSubtasks.map((subtask, index) => (
                                                        <Draggable key={subtask.task_id}
                                                                   draggableId={String(subtask.task_id)} index={index}>
                                                            {(provided) => (
                                                                <li {...provided.draggableProps} {...provided.dragHandleProps}
                                                                    ref={provided.innerRef}>
                                                                    {subtask.task_name}
                                                                </li>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </ol>
                                            )}
                                        </Droppable>
                                    </DragDropContext>
                                </div> :
                                <ol>
                                    {selectedSubtasks.map((subtask, index) => <li key={index}>{subtask.task_name}</li>)}
                                </ol>}

                        </div>
                    )}
                </PopUp>
            </>
        );
    }

}

export default TaskTable;