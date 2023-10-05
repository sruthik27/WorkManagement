import React, { Component } from 'react';
import "./AdminMain.css";
import PopUp from "./PopUp";

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
        console.log(item.work_id);
        let fetchedtasks = await fetch(`/db/gettasks?n=${item.work_id}`);
        let tasks = await fetchedtasks.json();
        console.log(tasks);
        this.setState({ selectedItem: item,selectedTasks:tasks});
    }
    
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
        const { activeTask, completeTask, incompleteTask,selectedItem } = this.state;

        return (
            <>
                <div className="task-table">
                    <div>
                        <h2>Active Task</h2>
                        <ul>
                            {activeTask.map((x, i) => (
                                <p key={i} onClick={() => this.handleItemClick(x)}>
                                    {x.work_name}
                                </p>
                            ))}
                        </ul>
                    </div>
                    <div >
                        <h2>Completed Task</h2>
                        <ul>
                            {completeTask.map((x, i) => (
                                <p key={i} onClick={() => this.handleItemClick(x)}>
                                    {x.work_name}
                                </p>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2>Incomplete Task</h2>
                        <ul>
                            {incompleteTask.map((x, i) => (
                                <p key={i} onClick={() => this.handleItemClick(x)}>
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
                            <h1 className="close-btn" onClick={() => this.setState({ selectedItem: null })}>x</h1>
                            {/* Display information related to the selectedItem here */}
                            <p>{selectedItem.work_name}</p>
                            {/* Add other information */}
                        </div>
                    )}
                </PopUp>
            </>
        );
    }
}

export default TaskTable;