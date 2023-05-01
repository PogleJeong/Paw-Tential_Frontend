import React, { useState } from "react";
import axios from 'axios';
import ModifyFeedModal from "../router/contest/modals/ModifyFeedModal";

function FeedDropdown_writer(feedData) {
    const [modifyFeedModal, setModifyFeedModal] = useState(false);
    
    // 피드 삭제
    const feedDelete = async (seq) => {
        if(window.confirm("피드를 삭제하시겠습니까?")) {
            axios.get("http://localhost:3000/feedDelete", {params:{"seq":seq}})
            .then(function(res){
                alert(res.data);
                window.location.reload();
            })
            .catch(function(err){
                alert(err);
            })
        }
    }

    return (
        <>
            <ModifyFeedModal show={modifyFeedModal}
                                                onHide={()=>{setModifyFeedModal(false);}}
                                                seq={feedData.seq} />

            <ul style={{position:"absolute", backgroundColor:"white"}}>
                <li onClick={()=>{setModifyFeedModal(true);}}>수정하기</li>
                <li onClick={()=>{feedDelete(feedData.seq);}}>삭제하기</li>
            </ul>
        </>
        
    );
}

export default FeedDropdown_writer;