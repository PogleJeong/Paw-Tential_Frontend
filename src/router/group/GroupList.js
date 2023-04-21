import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../../styles/socialv.css";

export default function GroupList() {
    
    
    const userId = 'test';
    const [search, setSearch] = useState('');
    
    // 검색 결과를 담을 state 변수
    const [result, setResult] = useState([]);
    
    useEffect(()=>{
        getGroupList();
    },[])
    
    // 그룹 검색 결과를 가져오는 함수
    const getGroupList = async () => {
        axios.get("http://localhost:3000/group/searchGroup", { params:{"groupName":search, "memberId":userId}})
        .then(function(res) {
            if(res.data.groupList.length === 0) {
                alert(`${search}(으)로 검색한 결과가 존재하지 않습니다.`);
            } else {
                setResult(res.data.groupList);
                console.log(res.data.groupList);
            }
        })
        .catch(function(err) {
            alert(err);
        })
    }
    
    const navigate = useNavigate();
    
    const searchBtn = () => {
        if(search.trim() !== "") {
            navigate('/group/GroupList/' + search);
        } else {
            navigate('/group/GroupList');
        }
        getGroupList(search);
    }

    // 그룹 가입 요청 버튼
    const groupJoinRequest = async (groupId, groupName) => {
        axios.post("http://localhost:3000/group/groupJoinRequest", null, {params:{"memberId":userId, "groupId":groupId, "groupName":groupName}})
        .then(function(res){
            alert(res.data);
            window.location.reload();
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 그룹 가입 요청 취소 버튼
    const groupJoinCancel = async(groupId) => {
        axios.post("http://localhost:3000/group/groupJoinCancel", null, {params:{"memberId":userId, "groupId":groupId}})
        .then(function(res){
            alert(res.data);
            window.location.reload();
        })
        .catch(function(err){
            alert(err);
        })
    }

    return (
        <>
        <h1>그룹 검색</h1>
        <input type="text" value={search} name="search" placeholder="Search here..." onChange={(e)=>{setSearch(e.target.value)}}/>
        <button type="button" onClick={searchBtn}>검색</button>

        {result !== null && result.length !== 0
        ?
        <table>
            <thead>
                <tr>
                    <th>그룹 이름</th>
                    <th>그룹 대표 이미지</th>
                    <th>게시글수</th>
                    <th>멤버수</th>
                    <th>방문수</th>
                    <th>가입상태</th>
                </tr>
            </thead>
            <tbody>
                {
                    result.map(function(group, i){
                        return (
                            <tr key={i}>
                                <td><Link to={`/group/GroupFeed/${group.grpNo}`}>{group.grpName}</Link></td>
                                <td><img alt="profile-img" className="rounded-circle img-fluid avatar-120" src={`http://localhost:3000/${group.grpImage}`}/></td>
                                <td>{group.grpPost}</td>
                                <td>{group.grpMember}</td>
                                <td>{group.grpVisit}</td>
                                {group.grpStatus === 1 && <td>가입 완료</td>} 
                                {group.grpStatus === 0 && <td><button type="button" onClick={()=>{groupJoinRequest(group.grpNo, group.grpName)}}>Join</button></td>} 
                                {group.grpStatus === 2 && <td><button type="button" onClick={()=>{groupJoinCancel(group.grpNo)}}>가입 대기중</button></td>} 
                            </tr>
                        )
                })}
            </tbody>
        </table>
        :
        <p>
        </p>
        }
        </>
    )
    
}