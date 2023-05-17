import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import GroupListComponent from '../../component/GroupListComponent';
import OfficialGroupList from '../../component/OfficialGroupList';

export default function GroupList() {
    
    const navigate = useNavigate();

    useEffect(()=> {
        if (!cookies.USER_ID) {
            alert("로그인 후 이용해주세요.");
            navigate("/login");
            return;
        }
    },[]);

    
    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    // cookie에 저장된 사용자 ID 및 닉네임
    const userId = cookies.USER_ID;
    const userNickName = cookies.USER_NICKNAME;

    // 검색어 state 변수
    const [search, setSearch] = useState('');

    const [officialGroup, setOfficialGroup] = useState([]);
    const [groupList, setGroupList] = useState([]);

    // 공식 그룹 호출
    const getOfficialGroup = async (userId) => {
        axios.get("http://localhost:3000/group/getOfficialGroup", {params:{"memberId":userId}})
        .then(function(res) {
            setOfficialGroup(res.data.officialGroup);
            console.log(officialGroup);
        })
        .catch(function(err){
            alert(err);
        })
    }

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
        getOfficialGroup(userId);
    },[])

    const searchBtn = () => {
        if(search.trim() !== "") {
            navigate('/group/GroupList/' + search);
        } else {
            navigate('/group/GroupList');
        }
        getGroupList(userId, search);
    }

    return (
    <>
        <div className="header-for-bg">
            <div className="background-header">
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

        {/* 공식 그룹 출력 */}
        <div id="content-page" className="content-page">
            <div className="container py-1">
                <div className="my-3" style={{"font-size":"17px", "color":"black"}}>ㆍ포텐셜 공식 그룹</div>
                <div className="d-grid gap-3 d-grid-template-1fr-19">
                {officialGroup && officialGroup.length !== 0 && (
                    officialGroup.map(grp => {
                        return (
                            <OfficialGroupList data={grp} id={userId} key={grp.grpNo}/>
                        )
                    })
                )}
                </div>
            </div>
        </div>

        {/*일반 그룹 출력 컴포넌트*/}
        <div id="content-page" className="content-page">
            <div className="container">
                <div className="my-3" style={{"font-size":"17px", "color":"black"}}>
                ㆍ포텐셜 일반 그룹
                </div>
                <div className="d-grid gap-3 d-grid-template-1fr-19">
                    {groupList && groupList.length !== 0 && (
                        groupList.map(group => {
                            if(group.grpName !== "돌봄") {
                                return (
                                    <GroupListComponent id={userId} data={group} key={group.grpNo}/>
                                )
                            }
                        })
                    )}
                </div>
            </div>
        </div>
    </>
    )
    
}