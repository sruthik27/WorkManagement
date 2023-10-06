import React, { Component } from 'react';
import "./AdminMain.css";
import PopUp from "./PopUp";
import PieChart from './PieChart';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

class TaskTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTask: [],
            completeTask: [],
            incompleteTask: [],
            selectedItem: null,
            selectedSubtasks:[]
        };
    }

    componentDidMount() {
        // Check if itemData is available before processing
        if (this.props.data.length > 0) {
            this.processData(this.props.data);
        }
    }

    // Add componentDidUpdate to handle updates to props.data
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.processData(this.props.data);
        }
    }

    handleItemClick = async (item) => {
        // Set the selected item when a p tag is clicked
        let fetchedtasks = await fetch(`/db/gettasks?n=${item.work_id}`);
        let tasks = await fetchedtasks.json();
        console.log(tasks);
        // Use the callback function of setState to ensure the state is updated
        this.setState({ selectedItem: item, selectedSubtasks: tasks });
    }

    handleOnDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(this.state.selectedSubtasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        this.setState({ selectedSubtasks: items });
    };


    processData(data) {
        let activeTask = [];
        let completeTask = [];
        let incompleteTask = [];

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
        const { activeTask, completeTask, incompleteTask,selectedItem, selectedSubtasks } = this.state;
        return (
            <>
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
                    <div >
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
                            <h1 className="close-btn" onClick={() => {this.setState({ selectedItem: null });console.log(this.state.selectedSubtasks)}}>x</h1>
                            {/* Display information related to the selectedItem here */}
                            <h2 className='popup-head'>Work Details:</h2>
                            <div className='popup-info'>
                                <div className='popup-details1'>
                                    <p>Work Name: {selectedItem.work_name}</p>
                                    <p>Time Period: {selectedItem.start_date} - {selectedItem.due_date}</p>
                                    <p>Coordinator: {selectedItem.coordinator}</p>
                                    <p>Worker: {selectedItem.worker}</p>
                                    <p>Total Expense: {selectedItem.wage}</p>
                                    <p>Sub Task: </p>
                                </div>
                                <div className='popup-piechart'>
                                    <p>Work Process: </p>
                                    <PieChart percentage={(selectedItem.completed_subtasks / selectedItem.total_subtasks) * 100}/>
                                </div>
                            </div>
                            <div>
                                <DragDropContext onDragEnd={this.handleOnDragEnd}>
                                    <Droppable droppableId="subtasks">
                                        {(provided) => (
                                            <ol {...provided.droppableProps} ref={provided.innerRef}>
                                                {selectedSubtasks.map((subtask, index) => (
                                                    <Draggable key={subtask.task_id} draggableId={String(subtask.task_id)} index={index}>
                                                        {(provided) => (
                                                            <li {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
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
                            </div>
                        </div>
                    )}
                </PopUp>
            </>
        );
    }
}

export default TaskTable;