/**
 * @Author 내 그룹 목록
 */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/socialv.css';

export default function MyGroup(){

    // 내가 가입한 그룹을 담는 state 변수
    const [myGroup, setMyGroup] = useState([]);
    
    // 테스트용 임시 ID
    const memberId = 'test';

    useEffect(()=>{
        getMyGroupList();
    },[])

    // 내가 가입한 그룹 불러오는 함수
    const getMyGroupList = async () => {
        axios.get("http://localhost:3000/group/getMyGroupList", {params:{"memberId":'test'}})
        .then(function(res) {
            setMyGroup(res.data.myGroupList);
        })
        .catch(function(err) {
            alert(err);
        })
    }

    // 그룹 탈퇴 함수
    const leaveGroup = async (grpNo) => {
        if(window.confirm("그룹을 떠나시겠습니까?")){
            axios.post("http://localhost:3000/group/leaveGroup", null, {params:{"memberId":memberId, "groupId":grpNo}})
            .then(function(res) {
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
        <h1>내가 가입한 그룹</h1>
        {myGroup !== null && myGroup.length !== 0
        ?
        <table>
            <thead>
                <tr>
                    <th>그룹번호</th>
                    <th>그룹리더</th>
                    <th>그룹이름</th>
                    <th>그룹 대표 이미지</th>
                </tr>
            </thead>
            <tbody>
                {
                myGroup.map(function(list, i){
                    return (
                    <tr key={i}>
                        <td>{list.grpNo}</td>
                        <td>{list.grpLeader}</td>
                        <td><Link to={`/group/GroupFeed/${list.grpNo}`}>{list.grpName}</Link></td>
                        <td><img alt="profile-img" className="rounded-circle img-fluid avatar-120" src={`http://localhost:3000/${list.grpImage}`}/></td>
                        {list.grpLeader === memberId && <td><Link to={`/group/ModifyGroup/${list.grpNo}`}>수정하기</Link></td>}
                        {list.grpLeader !== memberId && <td><button type="button" onClick={()=>leaveGroup(list.grpNo)}>그룹 탈퇴</button></td>}
                    </tr>
                    )
                })
                }
            </tbody>
        </table>
        :
        <p>가입한 그룹이 없습니다.</p>
        }
        </>
    )
}