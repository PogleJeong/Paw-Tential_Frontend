/**
 * @Author 내 그룹 목록
 */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";

export default function MyGroup(){

    // 내가 가입한 그룹을 담는 state 변수
    const [myGroup, setMyGroup] = useState([]);
    
    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    // cookie에 저장된 사용자 ID 및 닉네임
    const userId = 'test2';
    const userNickName = cookies.USER_NICKNAME;

    useEffect(()=>{
        getMyGroupList();
        console.log(`userId = ${userId}`);
    },[])

    // 내가 가입한 그룹 불러오는 함수
    const getMyGroupList = async () => {
        axios.get("http://localhost:3000/group/getMyGroupList", {params:{"memberId":'loserya'}})
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
            axios.post("http://localhost:3000/group/leaveGroup", null, {params:{"memberId":userId, "groupId":grpNo}})
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
                <div id="content-page" className="content-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card position-relative inner-page-bg bg-primary" style={{height: "150px"}}>
                                    <div className="inner-page-title">
                                        <h3 className="text-white">My Group</h3>
                                            <p className="text-white">내가 가입한 그룹을 확인해보세요</p>
                                    </div>
                                </div>
                            </div>
                            {myGroup !== null && myGroup.length !== 0
                            ?
                            <>
                            <div className="col-sm-12">
                                <div className="card">
                                    <h3 className="card-header text-center font-weight-bold text-uppercase py-4">
                                        Group List
                                    </h3>
                                    <div className="card-body">
                                        <div id="table" className="table-editable">
                                            <table className="table table-bordered table-responsive-md table-striped text-center">
                                                <thead>
                                                    <tr>
                                                        <th>Leader</th>
                                                        <th>Group Name</th>
                                                        <th>Setting</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        myGroup.map(function(list,i) {
                                                            return (
                                                                <>
                                                                    <tr key={i}>
                                                                        <td>{list.grpLeader}</td>
                                                                        <td><Link to={`/group/GroupFeed/${list.grpNo}/${list.grpName}`}>{list.grpName}</Link></td>
                                                                        {list.grpLeader === userId && <td><Link to={`/group/ModifyGroup/${list.grpNo}`}><button type="button" className="btn btn-danger btn-rounded btn-sm my-0">Modify</button></Link></td>}
                                                                        {list.grpLeader !== userId && <td><button type="button" className="btn btn-danger btn-rounded btn-sm my-0" onClick={()=>leaveGroup(list.grpNo)}>Leave</button></td>}
                                                                    </tr>
                                                                </>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>
                                        </div> {/*end of table-editable*/}
                                    </div> {/*end of card-body*/}
                                </div>
                            </div>
                            </>
                            :
                            <p className="text-center">아직 가입한 그룹이 없습니다</p>
                            }
                        </div>
                    </div>
                </div>
        {/* <h1>내가 가입한 그룹</h1>
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
                        {list.grpLeader === userId && <td><Link to={`/group/ModifyGroup/${list.grpNo}`}>수정하기</Link></td>}
                        {list.grpLeader !== userId && <td><button type="button" onClick={()=>leaveGroup(list.grpNo)}>그룹 탈퇴</button></td>}
                    </tr>
                    )
                })
                }
            </tbody>
        </table>
        :
        <p>가입한 그룹이 없습니다.</p>
        } */}
        </>
    )
}