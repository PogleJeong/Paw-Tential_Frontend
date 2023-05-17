/**
 * 사이드바
 * @Auth Pawtential
 */

import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

export default function Navbar() {

    
    // 로그인
    const [ loginState, setLoginState ] = useState(false);
    const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID"]);
    // 일반 유저인지 관리자인지 확인
    const userId = cookies.USER_ID;
    
    useEffect(()=>{
        cookies.USER_ID ? setLoginState(true) : setLoginState(false)
    },[cookies.USER_ID]);

    // 로그아웃
    const Logout = () => {
        const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID"]);
        const logout = () => {
            // 쿠키가 존재해야 지울 수 있음.
            if (cookies.USER_ID) {
                removeCookies("USER_ID");
                removeCookies("USER_NICKNAME");
                window.location.href = "/login";
            }
        }
        return(
            <div className="d-inline-block w-100 text-center p-3" onClick={logout}>
                <a className="btn btn-primary iq-sign-btn" href="javascript:void(0);" role="button">
                    다음에 또 올게요!
                <i className="ri-login-box-line ms-2" />
                </a>
            </div>
        );
    }



    // 로그인 한 유저의 프로필 사진 가져오기
    const [profile, setProfile] = useState('');
    const [nickName, setNickName] = useState('');
    const getProfile = async () => {
        axios.get("http://localhost:3000/group/getUserProfile", {params:{"id":userId}})
        .then(function(res){
            setProfile(res.data.profile);
            setNickName(res.data.nickname);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 나와 맞팔 관계인 유저의 목록 호출 및 컴포넌트
    const [mutualUsers, setMutualUsers] = useState([]);
    const getMutualUsers = async () => {
        axios.get("http://localhost:3000/group/getMutualUsers", {params:{"following_id":userId}})
        .then(function(res){
            setMutualUsers(res.data.list);
        })
        .catch(function(err){
            alert(err);
        })
    }
    const MutualUsersComponent = (props) => {
        return (
            <>
            <div className="d-flex align-items-center mb-4">
                <div className="iq-profile">
                <Link to={`/myfeed/myfeed2/${props.data.id}`}><img className="rounded-circle avatar-50" src={props.data.profile} alt="" /></Link>
                </div>
                <div className="ms-3">
                    <Link to={`/myfeed/myfeed2/${props.data.id}`}><h6 className="mb-0">{props.data.id}</h6></Link>
                    <p className="mb-0">{props.data.intro}</p>
                </div>
            </div>
            </>
        )
    }

    useEffect(()=>{
        getProfile();
        getMutualUsers();
    },[userId])


    return (
        <>
                <div className="iq-sidebar sidebar-default">
                    <div id="sidebar-scrollbar">
                        <nav className="iq-sidebar-menu">
                            <ul id="iq-sidebar-toggle" className="iq-menu">
                                <li>
                                    <Link to="/search">

                                        <i className="las la-search"></i><span>검색</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/place">
                                        <i className="las la-map-marker"></i><span>포텐플레이스</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/market">
                                        <i className="las la-shopping-bag"></i><span>마켓</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pawtens">
                                        <i className="las la-film"></i><span>포텐스</span>
                                    </Link>
                                </li>
                                <li className="">
                                    <a href="#group" data-bs-toggle="collapse" className="   collapsed" aria-expanded="false">
                                        <i className="las la-users" /><span>그룹</span><i className="ri-arrow-right-s-line iq-arrow-right" />
                                    </a>
                                    <ul id="group" className="iq-submenu collapse" data-bs-parent="#iq-sidebar-toggle">
                                        <li className="">
                                            <Link to="/group/NewsFeed">
                                                <i className="las la-newspaper" />새소식
                                            </Link>
                                        </li>
                                        <li className="">
                                            <Link to="/group/GroupList">
                                                <i className="las la-search" />그룹 찾기
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/group/CreateGroup">
                                                <i className="ri-edit-line" />그룹 생성
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/group/MyGroup">
                                                <i className="las la-users-cog" />내 그룹
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                        <div className="p-5"></div>
                    </div>
                </div> {/*end of iq-sidebar sidebar-default*/}
                <div className="iq-top-navbar">
                    <div className="iq-navbar-custom">
                        <nav className="navbar navbar-expand-lg navbar-light p-0">
                            <div className="iq-navbar-logo d-flex justify-content-between">
                                <Link to="/home/home">
                                    <img src="/feedimages/logo.png" className="img-fluid" alt="" />
                                    <span>Pawtential</span>
                                </Link>
                                <div className="iq-menu-bt align-self-center">
                                    <div className="wrapper-menu">
                                        <div className="main-circle"><i className="ri-menu-line" /></div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" 
                                        className="navbar-toggler"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#navbarSupportedContent"
                                        aria-controls="navbarSupportedContent"
                                        aria-label="Toggle navigation"
                            >
                                <i className="ri-menu-3-line" />
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav ms-auto navbar-list">
                                    <li> {/* 홈 버튼*/}
                                        <Link to="/home/home" className="d-flex align-items-center">
                                            <i className="ri-home-line" />
                                        </Link>
                                    </li>
                                    <li> {/* 채팅 버튼*/}
                                        <Link to="/chat/home" className="d-flex align-items-center">
                                            <i className="ri-message-2-line" />
                                        </Link>
                                    </li>
                                    {userId === "admin5" && (
                                    <li> {/*관리자페이지 버튼*/}
                                        <Link to="/admin/admin" target="_blank" className="d-flex align-items-center">
                                            <i className="ri-settings-5-line" />
                                        </Link>
                                    </li>
                                    )}
                                    <li className="nav-item dropdown">
                                        <a href="javascript:void(0);"
                                            className="d-flex align-items-center dropdown-toggle"
                                            id="drop-down-arrow"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <img className="img-fluid rounded-circle me-3" src={`http://localhost:3000/${profile}`} alt="" />
                                            <div className="caption">
                                                <h6 className="mb-0 line-height">{nickName}</h6>
                                            </div>
                                        </a>
                                        <div className="sub-drop dropdown-menu caption-menu" aria-labelledby="drop-down-arrow">
                                            <div className="card shadow-none m-0">
                                                <div className="card-header bg-primary">
                                                    <div className="header-title">
                                                        <h5 className="mb-0 text-white">{nickName}님, 안녕하세요!</h5>
                                                    </div>
                                                </div>
                                                <div className="card-body p-0">
                                                    <a href="javascript:void(0);" className="iq-sub-card iq-bg-primary-hover">
                                                        <div className="d-flex align-items-center">
                                                            <div className="rounded card-icon bg-soft-primary">
                                                                <i className="ri-file-user-line" />
                                                            </div>
                                                            <div className="ms-3" >
                                                                <h6 className="mb-0">My Feed</h6>
                                                                <Link className="nav-link" to="/myfeed/myfeed">
                                                                    <p className="mb-0 font-size-12">나의 피드로 이동하기</p>
                                                                    </Link>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a href="javascript:void(0);" className="iq-sub-card iq-bg-danger-hover">
                                                        <div className="d-flex align-items-center">
                                                            <div className="rounded card-icon bg-soft-danger">
                                                                <i className="ri-lock-line"></i>
                                                            </div>
                                                            <div className="ms-3">
                                                                <h6 className="mb-0 ">Edit Profile</h6>
                                                                <Link to={{ pathname: "/myfeed/User_update", state: { id : cookies.USER_ID } }} className="nav-link">
                                                                <p className="mb-0 font-size-12">나의 정보 변경하기</p>
                                                                </Link>     
                                                            </div>
                                                        </div>
                                                    </a>
                                                    {loginState && <Logout />}
                                                </div>
                                            </div>
                                        </div> {/*end of sub-drop*/}
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
                {userId &&
                <div className="right-sidebar-mini right-sidebar">
                    <div className="right-sidebar-panel p-0">
                        <div className="card shadow-none">
                            <div className="card-body p-0">
                                <div className="media-height p-3" data-scrollbar="init">
                                    {mutualUsers && mutualUsers.length !== 0 ? (
                                        mutualUsers.map((list,i) => {
                                            return (
                                                <MutualUsersComponent data={list} key={i}/>
                                            )
                                        })
                                    ): (
                                        <p>새로운 친구를 만들어보세요!</p>
                                    )}
                                </div>
                                <div className="right-sidebar-toggle bg-success text-white mt-3">
                                    <i className="ri-arrow-left-line side-left-icon"></i>
                                    <i className="ri-arrow-right-line side-right-icon"><span className="ms-3 d-inline-block">Close Menu</span></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}