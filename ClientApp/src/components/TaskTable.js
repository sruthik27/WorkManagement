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
        console.log(this.props.data)
    }

    handleItemClick = (item) => {
        // Set the selected item when a p tag is clicked
        this.setState({ selectedItem: item });
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
                    <div className='table-border1'>
                        <h2 className='table-head'>Active Task</h2>
                        <ul>
                            {activeTask.map((x, i) => (
                                <p className='table_content' key={i} onClick={() => this.handleItemClick(x)}>
                                    {x.work_name}
                                </p>
                            ))}
                        </ul>
                    </div>
                    <div >
                        <h2 className='table-head' >Completed Task</h2>
                        <ul>
                            {completeTask.map((x,i)=>(
                                <p className='table_content' key={i} onClick={() => this.handleItemClick(x)}>
                                    {x.work_name}
                                </p>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className='table-head' >Incomplete Task</h2>
                        <ul>
                            {incompleteTask.map((x,i)=>(
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
                            <h1 className="close-btn" onClick={() => this.setState({ selectedItem: null })}>x</h1>
                            {/* Display information related to the selectedItem here */}
                            <p>{selectedItem.work_name}</p>
                            <div>
                                <h2>Work Details:</h2>
                                <p>Work Name: {selectedItem.work_name}</p>
                                <p>Time Period: {selectedItem.start_date} - {selectedItem.due_date}</p>
                                <p>Coordinator: {selectedItem.coordinator}</p>
                                <p>Worker: {selectedItem.worker}</p>
                                <p>Total Expense: {selectedItem.wage}</p>
                            </div>
                            {/* Add other information */}
                        </div>
                    )}
                </PopUp>
            </>
        );
    }
}

export default TaskTable;