import React, { useState } from 'react';
import { Modal, Button, Form, FormControl, Toast } from 'react-bootstrap';
import axios from 'axios';

const ReportModal = ({ show, onClose, id, userId }) => {
  const [content, setContent] = useState("");
  const [reportType, setReportType] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);


  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/sendReport", null, {
        params: {'reported' : id, 
        "reporter" : userId , 
        'content' : content, 
        'rtype' : reportType
    },
      });

      if (response.data === "YES") {
        setToastMessage("문의가 성공적으로 전송되었습니다.");
        setShowToast(true);
        onClose();
      } else {
        setToastMessage("문의 전송 중 오류가 발생했습니다.");
        setShowToast(true);
      }
    } catch (error) {
      console.error(error);
      setToastMessage("문의 전송 중 오류가 발생했습니다.");
      setShowToast(true);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>신고하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
          <p>신고 대상자: {id}</p>
            <p>신고자: {userId}</p>

            <Form.Group controlId="reportType">
            <Form.Label>신고 유형</Form.Label>
            <Form.Control
              as="select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              required
            >
              <option value="">선택하세요</option>
              <option value="spam">스팸</option>
              <option value="inappropriate_content">부적절한 콘텐츠</option>
              <option value="etc">기타</option>
            </Form.Control>
          </Form.Group>

            <Form.Label>신고 내용</Form.Label>
            <FormControl
            as="textarea"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>
          

          <Button variant="primary" type="submit">
            신고 보내기
          </Button>
        </Form>
      </Modal.Body>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          minWidth: '200px',
        }}
      >
        <Toast.Header>
          <strong className="me-auto">알림</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </Modal>
  
  );
};

export default ReportModal;
