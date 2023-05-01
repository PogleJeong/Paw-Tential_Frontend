import React, { useState } from "react";
import axios from 'axios';
import ModifyFeedModal from "../router/contest/modals/ModifyFeedModal";

function FeedDropdown_user(feedData) {
    const [modifyFeedModal, setModifyFeedModal] = useState(false);


    return (
        <>
            <ul style={{position:"absolute", backgroundColor:"white"}}>
                <li>차단하기</li>
                <li>신고하기</li>
            </ul>
        </>
        
    );
}

export default FeedDropdown_user;