import React, { useState } from 'react';
import { Modal, Button, Form, FormControl, Toast } from 'react-bootstrap';
import axios from 'axios';

const QnAModal = ({ show, onClose, id, email }) => {
  const [content, setContent] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/sendQnA", null, {
        params: { content, id, email },
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
        <Modal.Title>문의하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {id && <p>아이디: {id}</p>}

          {email && (
            <Form.Group controlId="email">
              <Form.Label>이메일</Form.Label>
              <Form.Control type="email" value={email} required />
            </Form.Group>
          )}

          <Form.Group controlId="content">
            <Form.Label>문의 내용</Form.Label>
            <FormControl
              as="textarea"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            문의 보내기
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

export default QnAModal;
