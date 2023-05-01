import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';


const ModifyCmtModal = ({show, onHide, grpCmtNo}) => {

  // modal이 show 됐을 때에만 originComment() 실행
  useEffect(()=>{
    if(show) {
      originComment();
    }
  },[grpCmtNo]);


  const [grpFeedCmtContent, setGrpFeedCmtContent] = useState('');

  // originComment 가져오는 함수
  const originComment = async() => {
    axios.get("http://localhost:3000/group/getCmtContent", {params:{"grpCmtNo":grpCmtNo}})
    .then(function(res){
      setGrpFeedCmtContent(res.data.grpFeedCmtContent);
    })
    .catch(function(err){
      alert(err);
    })
  }

  // 댓글 수정 처리 하는 함수
  const modifyComment = async () => {
    axios.post("http://localhost:3000/group/cmtModify", null, {params:{"grpCmtNo":grpCmtNo, "grpFeedCmtContent":grpFeedCmtContent}})
    .then(function(res){
      alert(res.data);
      window.location.reload();
    })
    .catch(function(err){
      alert(err);
    })
  }




  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modify Comment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea rows="3" cols="50" value={grpFeedCmtContent} onChange={(e)=>{setGrpFeedCmtContent(e.target.value)}} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={()=>{modifyComment()}}>Modify</Button>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ModifyCmtModal