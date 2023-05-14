import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Select, Input, Button, Pagination } from 'antd';
import { Form, FormControl } from 'react-bootstrap';

import AdminSidebar from "../../component/AdminSidebar";
import "../../styles/page.css";
import emailjs from 'emailjs-com';

const { Option } = Select;

const AdminQnAList = () => {
  const [QnA, setQnA] = useState([]);
  const [choice, setChoice] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedQnA, setSelectedQnA] = useState(null);
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();

  const choiceChange = (value) => {
    setChoice(value);
  };

  const searchChange = (e) => {
    setSearch(e.target.value);
  };

  const fetchQnA = async (c, s, p) => {
    try {
      const response = await axios.get('http://localhost:3000/QnAList', { params:{ "choice":c, "search":s, "pageNumber":p } });
      const { data } = response;
      console.log(data.list);

      setQnA(data.list);
      setTotalCnt(data.cnt);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQnA('', '');
  }, []);

  const searchBtn = () => {
    if (choice.trim() !== "" && search.trim() !== "") {
      navigate(`/admin/QnA/${choice}/${search}`);
    } else {
      navigate('/admin/QnA/');
    }
    fetchQnA(choice, search);
  };

  const handlePageChange = (page) => {
    setPage(page);
    fetchQnA(choice, search, page - 1);
  };

  const toggleModal = (qna) => {
    setSelectedQnA(qna);
    setShowModal((prev) => !prev);
    setAnswer("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const templateParams = {
        to_email: selectedQnA.email,
        to_name: selectedQnA.id,
        from_name: 'paw-tential',
        message_html: answer,
      };

      const handleAnswer = async (seq) => {
        try {
          const response = await axios.post("http://localhost:3000/answer", null, { params: { seq } });
          console.log(seq);
          console.log(response.data);
          if (response.data === "YES") {
            alert("이메일이 전송되었습니다.");
            toggleModal(null);
            window.location.reload();
          }
        } catch (error) {
          console.log(error);
        }
      };

      const response = await emailjs.send(
        "service_xpsk69f",
        "template_3u5vcm2",
        templateParams,
        "2UkkRVJwD7B4ZXZ_b"
      );

      if (response.status === 200) {
        await handleAnswer(selectedQnA.seq);
      } else {
        alert("이메일 전송 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("이메일 전송 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h1>문의 관리</h1>

      <div className="admin-page">
        <div className="admin-page-sidebar">
          <AdminSidebar />
        </div>
      </div>

      <table style={{ marginLeft: "auto", marginRight: "auto", marginTop: "3px", marginBottom: "3px" }}>
        <tbody>
          <tr>
            <td style={{ paddingLeft: "3px" }}>
              <Select className="custom-select" value={choice} onChange={choiceChange}>
                <Option value="">검색</Option>
                <Option value="id">아이디</Option>
                <Option value="whether">답변 상태</Option>
                <Option value="content">내용</Option>
              </Select>
            </td>
            <td style={{ paddingLeft: "5px" }} className="align-middle">
              <Input type="text" className="form-control" placeholder="검색어" value={search} onChange={searchChange} />
            </td>
            <td style={{ paddingLeft: "5px" }}>
              <span>
                <Button type="primary" onClick={searchBtn}>검색</Button>
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <br />

      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>문의 내용</th>
            <th>아이디</th>
            <th>이메일</th>
            <th>문의일자</th>
            <th>답변 여부</th>
          </tr>
        </thead>
        <tbody>
          {QnA.map((dto, i) => (
            <TableRow QnA={dto} cnt={i + 1} key={i} toggleModal={toggleModal} />
          ))}
        </tbody>
      </table>

      <Pagination
        activePage={page}
        itemsCountPerPage={10}
        totalItemsCount={totalCnt}
        pageRangeDisplayed={5}
        prevPageText={"‹"}
        nextPageText={"›"}
        onChange={handlePageChange}
      />

      {selectedQnA && (
        <Modal
          visible={showModal}
          onCancel={toggleModal}
          title={`${selectedQnA.id}님의 문의 내용`}
          footer={null}
        >
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>ID</th>
                <th>이메일</th>
                <th>작성일</th>
                <th>답변 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedQnA.seq}</td>
                <td>{selectedQnA.id}</td>
                <td>{selectedQnA.email}</td>
                <td>{selectedQnA.wdate}</td>
                <td>{selectedQnA.whether === 0 ? "대기중" : "답변완료"}</td>
              </tr>
              <tr>
                <td colSpan={5} style={{ textAlign: "center", fontSize: "1.2rem" }}>
                  {selectedQnA.content}
                </td>
              </tr>
              <tr>
                <td colSpan={5}>
                <Form onSubmit={handleSubmit}>
  <Form.Group controlId="answer" label="답변 내용:">
    <FormControl
      as="textarea"
      rows={4}
      value={answer}
      onChange={(e) => setAnswer(e.target.value)}
    />
  </Form.Group>
  <Button type="primary" htmlType="submit">답변 보내기</Button>
</Form>
                </td>
              </tr>
            </tbody>
          </table>
        </Modal>
      )}
    </div>
  );
};

function TableRow({ QnA, cnt, toggleModal }) {
  return (
    <>
      <tr onClick={() => toggleModal(QnA)}>
        <td>{QnA.seq}</td>
        <td>
          {QnA.content.length > 15 ? QnA.content.substr(0, 15) + "..." : QnA.content}
        </td>
        <td>{QnA.id}</td>
        <td>{QnA.email}</td>
        <td>{QnA.wdate}</td>
        <td>{QnA.whether === 0 ? "대기중" : "답변완료"}</td>
      </tr>
    </>
  );
}

export default AdminQnAList;
