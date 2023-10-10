import React, { useState } from "react";
import "./AdminMain.css";

const CommentBox = (props) => {
    const [comment, setComment] = useState("");  
    const HandleSubmit = () => {
        const message = {
            word_id: props.workid,
            comment_info: comment,
        }
        console.log(message);
        // const handleSendAnnouncement = () => {
            //         const newBroadcast = {
            //     message: announcementText // Replace with your message
            // };
            
            // // Send a POST request to add a new broadcast
            // fetch("/db/addbroadcast", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(newBroadcast),
            // })
            //     .then((response) => {
            //         if (!response.ok) {
            //             throw new Error("Network response was not ok");
            //         }
            //         return response.json();
            //     })
            //     .then((data) => {
            //         console.log(data.message); // Message from the server
            //         setAnnouncementText('');
            //     })
            //     .catch((error) => {
            //         console.error("There was a problem with the fetch operation:", error);
            //     });
            // };
    }
    return(
        <div className='feedback'>
            <h2 className='table-head'>Comment: </h2>
            <input className='feedback-input' placeholder='Type Comment here...' value={comment} onChange={(e) => {
                setComment(e.target.value);
            }}/>
            <button className='send-button' onClick={HandleSubmit}>SEND</button>
        </div>
    )
}

export default CommentBox;