import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Pagination from 'react-js-pagination';
import AdminSidebar from "../../component/AdminSidebar";


import "../../styles/page.css"

const AdminReportList = () => {
  const [reports, setReports] = useState([]);

  const [choice, setChoice] = useState("");
  const [search, setSearch] = useState("");

  // paging
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);

  const choiceChange = (e) => setChoice(e.target.value);
  const searchChange = (e) => setSearch(e.target.value);


    const fetchReports = async (c, s, p) => {
      
        await axios.get('http://localhost:3000/reportList', { params:{ "choice":c, "search":s, "pageNumber":p  } })
        .then(function(res){
        console.log(res.data.list);

        setReports(res.data.list);

        setTotalCnt(res.data.cnt);
        })
      .catch (function(error) {
        console.log(error);
      })
    }

    
    

    
    useEffect(() => {
      fetchReports('','');
    }, []);

    let navigate = useNavigate();
    
    function searchBtn(){
      // choice, search 검사
      
      if(choice.toString().trim() !== "" && search.toString().trim() !== ""){
        navigate('/admin/reports/' + choice + "/" + search);
      }
      else{
        navigate('/admin/reports/');
      }
      // 데이터를 다시 한번 갖고 온다
      fetchReports(choice, search);
    }
    
    function handlePageChange(page){
      setPage(page);
      fetchReports(choice, search, page-1);
    }
    

    
    return (
      <div>
      <h1>신고 관리</h1>

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
                        <option value="auth">신고 유형</option>
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
            <th>신고자ID</th>
            <th>피신고자ID</th>
            <th>신고유형</th>
            <th>사유</th>
            <th>신고일</th>
            <th>신고 관리</th>
          </tr>
        </thead>
        <tbody>
          {
          reports.map(function(dto, i){
            return(
              <TableRow report={dto} cnt={i+1} key={i} />
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

function TableRow(props){
  const navigate = useNavigate();

  const handleGoMyFeed = (userId) => {
    navigate(`/myfeed/myfeed2/${userId}`);
  };


  return (


      <tr>
          <td>{props.cnt}</td>
          <td>{props.report.reporter}</td>
          <td>{props.report.reported}</td>
          <td>{props.report.rtype}</td>
          <td>{props.report.content}</td>
          <td>{props.report.rdate}</td>
          <td>
        <button onClick={() => handleGoMyFeed(props.report.reported)}>피드로 이동</button>
      </td>
      </tr>
  );
}

export default AdminReportList;