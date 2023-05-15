import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from "../../component/AdminSidebar";
import axios from 'axios';

import Pagination from 'react-js-pagination';

import "../../styles/page.css";
import "../../styles/admin.css";



const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  const [choice, setChoice] = useState("");
  const [search, setSearch] = useState("");

  // paging
  const [page, setPage] = useState(1);
  const [totalCnt, setTotalCnt] = useState(0);

  const choiceChange = (e) => setChoice(e.target.value);
  const searchChange = (e) => setSearch(e.target.value);


    const fetchUsers = async (c, s, p) => {
      
        await axios.get('http://localhost:3000/userList', { params:{ "choice":c, "search":s, "pageNumber":p  } })
        .then(function(res){
        console.log(res.data.list);

        setUsers(res.data.list);

        setTotalCnt(res.data.cnt);
        })
      .catch (function(error) {
        console.log(error);
      })
    }

    
    

    
    useEffect(() => {
      fetchUsers('','');
    }, []);

    let navigate = useNavigate();
    
    function searchBtn(){
      // choice, search 검사
      
      if(choice.toString().trim() !== "" && search.toString().trim() !== ""){
        navigate('/admin/users/' + choice + "/" + search);
      }
      else{
        navigate('/admin/users/');
      }
      // 데이터를 다시 한번 갖고 온다
      fetchUsers(choice, search);
    }
    
    function handlePageChange(page){
      setPage(page);
      fetchUsers(choice, search, page-1);
    }

  
    
    
    return (
      <div>
      <h1>관리자 페이지</h1>

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
                        <option value="auth">회원상태</option>
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
            <th>ID</th>
            <th>닉네임</th>
            <th>이메일</th>
            <th>가입일</th>
            <th>연락처</th>
            <th>상태</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {
          users.map(function(dto, i){
            return(
              <TableRow user={dto} cnt={i+1} key={i} />
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
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(`'${id}' 회원을 삭제하시겠습니까?`);
    if (confirmDelete) {
      await axios
        .get("http://localhost:3000/userDel", { params: { id: id } })
        .then((res) => {
          console.log(res.data);
          if (res.data === "YES") {
            alert(id + "회원을 삭제했습니다");
            window.location.reload(); // 새로고침
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <tr>
      <td>{props.cnt}</td>
      <td>{props.user.id}</td>
      <td>{props.user.nickname}</td>
      <td>{props.user.email}</td>
      <td>{props.user.regiDate}</td>
      <td>{props.user.phone}</td>
      <td>{props.user.auth === 0 ? "일반회원" : "관리자"}</td>
      <td>
        <button onClick={() => handleDeleteUser(props.user.id)}>삭제</button>
      </td>
    </tr>

  );
}

export default AdminUserList;