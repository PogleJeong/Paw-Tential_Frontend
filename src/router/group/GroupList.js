import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

export default function GroupList() {
    
    const navigate = useNavigate();

    
    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    // cookie에 저장된 사용자 ID 및 닉네임
    const userId = cookies.USER_ID;
    const userNickName = cookies.USER_NICKNAME;

    // 검색어 state 변수
    const [search, setSearch] = useState('');

    const [groupList, setGroupList] = useState([]);

    // 그룹 리스트 호출
    const getGroupList = async (userId, search) => {
        axios.get("http://localhost:3000/group/getGroupList", {params:{"memberId":userId, "groupName":search}})
        .then(function(res){
            setGroupList(res.data.groupList);
        })
        .catch(function(err){
            alert(err);
        })
    }

    useEffect(()=>{
        getGroupList(userId, '');
    },[])

    const searchBtn = () => {
        if(search.trim() !== "") {
            navigate('/group/GroupList/' + search);
        } else {
            navigate('/group/GroupList');
        }
        getGroupList(userId, search);
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
        {/* TO-DO 사이드바 수정 후에 다시 확인해주세요 */}
        <div className="header-for-bg">
            <div className="background-header position-relative">
                <img src="../assets/images/page-img/profile-bg7.jpg" className="img-fluid w-100" alt="header-bg" />
                <div className="title-on-header">
                    <div className="data-block">
                        <h2>Groups</h2>
                    </div>
                </div>
            </div>
        </div>

         {/* 그룹 검색창 */}
         <div className="iq-search-bar device-search my-3">
            <form className="searchbox" action="javascript:void(0);">
                <a className="search-link" href="javascript:void(0);" onClick={searchBtn}><i className="ri-search-line"></i></a>
                <input type="text" value={search} className="text search-input" placeholder="Search here..." onChange={(e)=>{setSearch(e.target.value)}}/>
                </form>
        </div>

        <div id="content-page" className="content-page">
            <div className="container">
                <div className="d-grid gap-3 d-grid-template-1fr-19">
                {
                    groupList.map(function(group, i) {
                        return (
                        <div key={i}>
                            <div className="card mb-3">
                                {/* 그룹 커버 이미지 */}
                                <div className="top-bg-image">
                                    <img src="/assets/images/page-img/profile-bg1.jpg" className="img-fluid w-100" alt="group-bg" />
                                </div>
                                {/* 그룹 대표 이미지 및 그룹명, 게시글 수, 멤버 수, 방문 수 */}
                                <div className="card-body text-center">
                                    <div className="group-icon">
                                        <img src={`http://localhost:3000/${group.grpImage}`} alt="profile-img" className="rounded-circle img-fluid avatar-120" />
                                    </div>
                                    <div className="group-info pt-3 pb-3">
                                        <h4><Link to={`/group/GroupFeed/${group.grpNo}/${group.grpName}`}>{group.grpName}</Link>{group.grpIsOfficial === 1 && <span>✅</span>}</h4>
                                        <p>{group.grpIntro}</p>
                                    </div>
                                    <div className="group-details d-inline-block pb-3">
                                        <ul className="d-flex align-items-center justify-content-between list-inline m-0 p-0">
                                            <li className="pe-3 ps-3">
                                                <p className="mb-0">Post</p>
                                                    <h6>{group.grpPost}</h6>
                                            </li>
                                            <li className="pe-3 ps-3">
                                                <p className="mb-0">Member</p>
                                                    <h6>{group.grpMember}</h6>
                                            </li>
                                            <li className="pe-3 ps-3">
                                                <p className="mb-0">Visit</p>
                                                <h6>{group.grpVisit}</h6>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* TO-DO 해당 그룹에 가입한 인원들의 프로필 사진 */}
                                    {/* <div className="group-member mb-3">
                                        <div className="iq-media-group">
                                            <a href="#" className="iq-media">
                                                <img className="img-fluid avatar-40 rounded-circle" src="/assets/images/user/05.jpg" alt="" />
                                            </a>
                                        </div>
                                    </div> */}
                                    {group.grpStatus === 1 && <button className="btn btn-primary d-block w-100">가입된 그룹입니다.</button>} 
                                    {group.grpStatus === 0 && <button type="button" className="btn btn-primary d-block w-100" onClick={()=>{groupJoinRequest(group.grpNo, group.grpName)}}>가입 하기</button>} 
                                    {group.grpStatus === 2 && <button type="button" className="btn btn-primary d-block w-100" onClick={()=>{groupJoinCancel(group.grpNo)}}>가입 대기중</button>} 
                                </div>
                            </div>
                        </div>
                        ) // end of map return
            }) // end of map
        }
                </div>
            </div>
        </div>
    </>
    )
    
}