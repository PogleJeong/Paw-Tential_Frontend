import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Pagination from 'react-js-pagination';
import AdminSidebar from "../../component/AdminSidebar";


import "../../styles/page.css";
import '../../styles/modal.css';
import emailjs from '@emailjs/browser';

const AdminQnAList = () => {
  const [QnA, setQnA] = useState([]);


  const [choice, setChoice] = useState("");
  const [search, setSearch] = useState("");

  // paging
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);

  const choiceChange = (e) => setChoice(e.target.value);
  const searchChange = (e) => setSearch(e.target.value);


    const fetchQnA = async (c, s, p) => {
      
        await axios.get('http://localhost:3000/QnAList', { params:{ "choice":c, "search":s, "pageNumber":p  } })
        .then(function(res){
        console.log(res.data.list);

        setQnA(res.data.list);

        setTotalCnt(res.data.cnt);
        })
      .catch (function(error) {
        console.log(error);
      })
    }

    
    

    
    useEffect(() => {
      fetchQnA('','');
    }, []);

    let navigate = useNavigate();
    
    function searchBtn(){
      // choice, search 검사
      
      if(choice.toString().trim() !== "" && search.toString().trim() !== ""){
        navigate('/admin/QnA/' + choice + "/" + search);
      }
      else{
        navigate('/admin/QnA/');
      }
      // 데이터를 다시 한번 갖고 온다
      fetchQnA(choice, search);
    }
    
    function handlePageChange(page){
      setPage(page);
      fetchQnA(choice, search, page-1);
    }
    
    
    return (
      <div>
      <h1>문의 관리</h1>

      <div className="admin-page">
      <div className="admin-page-sidebar">
        <AdminSidebar />
      </div>
    </div>

      <table style={{ marginLeft:"auto", marginRight:"auto", marginTop:"3px", marginBottom:"3px" }}>
            <tbody>
            <tr>
                <td style={{ paddingLeft:"3px" }}>
                    <select className="custom-select" value={choice} onChange={choiceChange}>
                        <option value=''>검색</option>
                        <option value="id">아이디</option>
                        <option value="whether">답변 상태</option>
                        <option value="content">내용</option>
                    </select>
                </td>
                <td style={{ paddingLeft:"5px" }} className="align-middle">
                    <input type="text" className="form-control" placeholder="검색어"
                        value={search} onChange={searchChange}/>
                </td>
                <td style={{ paddingLeft:"5px" }}>
                    <span>
                        <button type="button" className="btn btn-primary" onClick={()=>searchBtn()}>검색</button>
                    </span>
                </td>
            </tr>
            </tbody>
        </table>

        <br/>

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
          {
          QnA.map(function(dto, i){
            return(


                <TableRow QnA={dto} cnt={i+1} key={i} />

            )
          





          })
        }
        </tbody>
      </table>

      <Pagination
            activePage={page}
            itemsCountPerPage={10}
            totalItemsCount={totalCnt}
            pageRangeDisplayed={5}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={handlePageChange} />

    </div>
  );
};

function TableRow(props) {
  const [showModal, setShowModal] = useState(false);
  const [answer, setAnswer] = useState("");

  const toggleModal = () => {
    setAnswer(""); // 모달이 열릴 때마다 답변 내용을 초기화합니다.
    setShowModal(true); // showModal 상태를 true로 변경하여 모달을 엽니다.
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const templateParams = {
        to_email: props.QnA.email,
        to_name: props.QnA.id,
        from_name: "paw-tential",
        message_html: answer,
      };

      const handleAnswer = async (seq) => {
        await axios
          .post("http://localhost:3000/answer", null, { params: { seq: seq } })
          .then((res) => {
            console.log(seq);
            console.log(res.data);
            if (res.data === "YES") {
              alert("이메일이 전송되었습니다.");

              toggleModal();
              window.location.reload();
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      };

      const response = await emailjs.send(
        "service_xpsk69f",
        "template_3u5vcm2",
        templateParams,
        "2UkkRVJwD7B4ZXZ_b"
      );

      if (response.status === 200) {
        await handleAnswer(props.QnA.seq);
      } else {
        alert("이메일 전송 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("이메일 전송 중 오류가 발생했습니다.");
    }
  };


  return (
    <>
      <tr onClick={toggleModal}>
        <td>{props.QnA.seq}</td>
        <td>
          {props.QnA.content.length > 15
            ? props.QnA.content.substr(0, 15) + "..."
            : props.QnA.content}
        </td>
        <td>{props.QnA.id}</td>
        <td>{props.QnA.email}</td>
        <td>{props.QnA.wdate}</td>
        <td>{props.QnA.whether === 0 ? "대기중" : "답변완료"}</td>
      </tr>
      {showModal && (
        <tr>
          <td colSpan="6">
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={toggleModal}>
                  &times;
                </span>
                <h2>{props.QnA.id}님의 문의 내용</h2>
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
                      <td>{props.QnA.seq}</td>
                      <td>{props.QnA.id}</td>
                      <td>{props.QnA.email}</td>
                      <td>{props.QnA.wdate}</td>
                      <td>{props.QnA.whether === 0 ? "대기중" : "답변완료"}</td>
                    </tr>
                    <tr>
                      <td colSpan={5} style={{textAlign: "center", fontSize: "1.2rem"}}>
                        {props.QnA.content}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5}>
                        <form onSubmit={handleSubmit}>
                          <div className="form-group">
                            <label htmlFor="answer">답변 내용:</label>
                            <textarea
                              id="answer"
                              name="answer"
                              rows="4"
                              cols="50"
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                            />
                          </div>
                          <button type="submit">답변 보내기</button>
                        </form>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );

  
    



  }

export default AdminQnAList;