/**
 * 그룹 카테고리 클릭 시, 처음 출력되는 화면(뉴스피드)
 * @Auth 해운
 */

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactHtmlParser from "react-html-parser";
import { useCookies } from "react-cookie";
import ModifyCmtModal from './modals/ModifyCmtModal';

export default function NewsFeed() {
    
    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);

    // cookie에 저장된 사용자 ID
    const userId = cookies.USER_ID;
    
    // 가입 그룹 존재 여부
    const [groupJoined, setGroupJoined] = useState(false);
    
    // 가입한 그룹들의 피드를 저장할 state 변수
    const [groupFeeds, setGroupFeeds] = useState([]);
    
    const [grpCmtNo, setGrpCmtNo] = useState('');

    // 댓글 수정 모달
    const [modifyCmtModal, setModifyCmtModal] = useState(false);
    
    useEffect(()=>{
        hasJoinedGroup();
        getMemberGroupsFeeds();
    },[userId])

    // // 가입한 그룹 존재 여부 확인 함수
    const hasJoinedGroup = async () => {
        axios.get("http://localhost:3000/group/hasJoinedGroup", {params:{"memberId":userId}})
        .then(function(resp) {
            console.log(resp.data);
            setGroupJoined(resp.data);
        })
        .catch(function(err) {
            alert(err);
        })
    }

    const getMemberGroupsFeeds = () => {
        axios.get("http://localhost:3000/group/newsFeed", {params:{"memberId":userId}})
        .then(function(resp) {
            console.log(resp.data.newsFeed);
            setGroupFeeds(resp.data.newsFeed);
        })
        .catch(function(err) {
            alert(err);
        })
    }

    
    // 뉴스피드 컴포넌트
    const NewsFeedComponent = ((props) => {

        const html = props.feed.grpFeedContent.replace(/<img /g, '<img class="img-fluid rounded w-100" ');

        // 댓글 관련 state 변수 및 함수
        const [commentList, setCommentList] = useState([]);
        const [comment, setComment] = useState('');

        useEffect(()=>{
            axios.get("http://localhost:3000/group/getCommentList", {params:{"grpFeedNo":props.feed.grpFeedNo}})
            .then(function(res){
                setCommentList(res.data.cmtList);
            })
            .catch(function(err){
                alert(err);
            })
        }, [props.feed.grpFeedNo]);
        
        const [likeCount, setLikeCount] = useState(props.feed.grpFeedLikeCount);

        // 좋아요 처리
        const likeHandler = async (feedNo) => {
            axios.post("http://localhost:3000/group/groupFeedLike", null, {params:{"grpFeedNo":feedNo, "grpFeedLikeId":userId}})
            .then(function(res) {
                alert(res.data);
                if(res.data === "좋아요가 반영되었습니다.") {
                    setLikeCount(prevCount => prevCount +1);
                } else {
                    setLikeCount(prevCount => prevCount -1);
                }
            })
            .catch(function(err){
                alert(err);
            })
        }

         // 댓글 등록 처리 함수
         const cmtSubmit = async(grpFeedNo) => {
            axios.post("http://localhost:3000/group/writeGrpFeedCmt", null, {params:{"grpFeedNo":grpFeedNo, "grpFeedCmtId":userId, "grpFeedCmtContent":comment}})
            .then(function(res){
                alert(res.data);
                window.location.reload();
            })
            .catch(function(err){
                alert(err);
            })
        }

        // 댓글 삭제 처리 함수
        const cmtDelete = async(grpCmtNo) => {
            if(window.confirm("댓글을 삭제하시겠습니까?")) {
                axios.get("http://localhost:3000/group/cmtDelete", {params:{"grpCmtNo":grpCmtNo}})
                .then(function(res){
                    alert(res.data);
                    window.location.reload();
                })
                .catch(function(err){
                    alert(err);
                })
            };
        }

        return (
            <>
                <div className="col-sm-12">
                    <div className="card card-block card-stretch card-height">
                        <div className="card-body">
                            <div className="user-post-data">
                                <div className="d-flex justify-content-between">
                                    <div className="me-3">
                                        {/* TO-DO 그룹 대표 이미지 넣어주세요 */}
                                        <img className="rounded-circle img-fluid" src="/assets/images/user/03.jpg" alt="" />
                                    </div>
                                    <div className="w-100">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <h5 className="mb-0 text-primary"><Link to={`/group/GroupFeed/${props.feed.grpNo}/${props.feed.grpName}`}>{props.feed.grpName}</Link></h5>
                                                <p className="mb-0 d-inline-block">
                                                {props.feed.grpFeedId}
                                                ㆍ{props.feed.grpFeedWd.substring(0,10)}
                                                ㆍ{props.feed.grpFeedSetting === "전체 공개" ? <i className="ri-global-line pe-1"></i> : <i className="ri-lock-fill pe-1"></i>}
                                                </p>
                                            </div>
                                            <div className="card-post-toolbar">
                                            <div className="dropdown">
                                                <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                    <i className="ri-more-fill"></i>
                                                </span>
                                                <div className="dropdown-menu m-0 p-0">
                                                    <a className="dropdown-item p-3" href="#">
                                                        <div className="d-flex align-items-top">
                                                            <div className="h4">
                                                                <i className="ri-save-line"></i>
                                                            </div>
                                                            <div className="data ms-2">
                                                                <h6>Save Post</h6>
                                                                <p className="mb-0">Add this to your saved items</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a className="dropdown-item p-3" href="#">
                                                        <div className="d-flex align-items-top">
                                                            <i className="ri-close-circle-line h4"></i>
                                                            <div className="data ms-2">
                                                                <h6>Hide Post</h6>
                                                                <p className="mb-0">See fewer posts like this.</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                    <a className="dropdown-item p-3" href="#">
                                                        <div className="d-flex align-items-top">
                                                            <i className="ri-user-unfollow-line h4"></i>
                                                            <div className="data ms-2">
                                                                <h6>Unfollow User</h6>
                                                                <p className="mb-0">Stop seeing posts but stay friends.</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            </div> {/* dropdown end */}
                                            </div> {/* card-post-toolbar end*/}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p></p>
                                </div>
                                <div className="user-post">
                                    <p>{ReactHtmlParser(html)}</p>
                                </div>
                                <div className="comment-area mt-3">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                                        <div className="like-block position-relative d-flex align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="total-like-block ms-2 me-3">
                                                    <span onClick={()=>{likeHandler(props.feed.grpFeedNo)}}>
                                                        <img src="/assets/images/icon/01.png" className="img-fluid" alt="" />
                                                        <span className="mx-1">{likeCount} Likes</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="total-comment-block">
                                                <img src="/assets/images/icon/16.png" className="img-fluid mx-1" style={{width:"30px"}}/>
                                                <span>{props.feed.grpCommentCount} Comments</span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <ul className="post-comments list-inline p-0 m-0">
                                        <li className="mb-2">
                                        {commentList.map(function(list) {
                                            return (
                                            <div className="d-flex" key={list.grpCmtNo}>
                                                <div className="user-img">
                                                {/* TO-DO 유저 프로필 사진 넣어주세요 */}
                                                    <img src="/assets/images/user/02.jpg" alt="userimg" class="avatar-35 rounded-circle img-fluid" />
                                                </div>
                                                <div className="comment-data-block ms-2">
                                                    <h6>{list.grpFeedCmtId}</h6>
                                                    <p className="mb-0">{list.grpFeedCmtContent}</p>
                                                    <div class="d-flex flex-wrap align-items-center comment-activity">
                                                        <a href="javascript:void(0);">답글</a>
                                                        <a href="javascript:void(0);"
                                                            onClick={ () => { 
                                                                const handleClick = () => {
                                                                    setModifyCmtModal(true);
                                                                    setGrpCmtNo(list.grpCmtNo);
                                                                }
                                                            return handleClick(); } }>수정</a>
                                                        <a href="javascript:void(0);" onClick={()=>{cmtDelete(list.grpCmtNo)}}>삭제</a>
                                                        <span>{list.grpFeedCmtWd.substring(0,10)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        })}
                                        </li>
                                    </ul>
                                        <form className="comment-text d-flex align-items-center mt-3">
                                            <input type="text" className="form-control rounded" value={comment} placeholder="소중한 댓글을 남겨주세요." onChange={(e)=>{setComment(e.target.value);}} />
                                            <div className="comment-attagement d-flex">
                                                <a href="javascript:void(0);" onClick={()=>{cmtSubmit(props.feed.grpFeedNo)}}><i className="ri-reply-line me-3"></i></a>
                                            </div>
                                        </form>
                                </div>
                            </div>
                        </div> {/* card-body end */}
                    </div>
                </div> {/* col-sm-12 end */}
            </>
        )
    })

    return (
        <>
        <ModifyCmtModal show={modifyCmtModal}
                                            onHide={()=>{setModifyCmtModal(false)}}
                                            grpCmtNo={grpCmtNo}/>
          {groupJoined === true ? (
              <div className="wrapper">
                <div id="content-page" className="content-page">
                  <div className="container">
                    <h1 className="my-3">NewsFeed</h1>
                    <div className="row">
                      <div className="col-lg-8 row m-0 p-0">
                        {groupFeeds !== null && groupFeeds.length !== 0 ? (
                          <>
                            {groupFeeds.map(function(feed, i) {
                              return <NewsFeedComponent feed={feed} key={i} />;
                            })}
                          </>
                        ) : (
                          <p>가입한 그룹에 작성된 피드가 없습니다.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          ) : (
            <p>가입한 그룹이 없습니다.</p>
          )}
      
          <Link to="/group/CreateGroup">그룹 생성</Link>
          <br />
          <Link to="/group/GroupList">그룹 찾기</Link>
          <br />
          <Link to="/group/MyGroup">내 그룹</Link>
        </>
      );
} {/* export default NewsFeed */}