/**
 * 특정 그룹 피드
 * @Auth 해운 
 */

import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CreateFeedModal from './modals/CreateFeedModal';
import ReactHtmlParser from "react-html-parser";
import ModifyFeedModal from './modals/ModifyFeedModal';
import ModifyCmtModal from './modals/ModifyCmtModal';
import CareFeedModal from './modals/CareFeedModal';
import ModifyCareFeedModal from './modals/ModifyCareFeedModal';
import moment from 'moment';


export default function GroupFeed(){
    
    let params = useParams();
    let grpName = params.grpName;
    
    const userId = 'test123';

    const [grpCmtNo, setGrpCmtNo] = useState('');

    // 해당 그룹에 가입된 인원인지 확인
    const [member, setMember] = useState(false);

    const [groupFeed, setGroupFeed] = useState([]);
    const [careGroupFeed, setCareGroupFeed] = useState([]);
    const [groupLeader, setGroupLeader] = useState('');
    const [joinRequest, setJoinRequest] = useState([]);

    const [createFeedModal, setCreateFeedModal] = useState(false);
    const [modifyFeedModal, setModifyFeedModal] = useState(false);
    const [modifyCmtModal, setModifyCmtModal] = useState(false);
    const [careFeedModal, setCareFeedModal] = useState(false);
    const [modifyCareFeedModal, setModifyCareFeedModal] = useState(false);

    const [selectedGrpFeedId, setSelectedGrpFeedId] = useState('');

    // 특정 그룹의 멤버 수를 가져오는 함수
    const [groupMember, setGroupMember] = useState('');
    const groupMemberHandler = async () => {
        axios.get("http://localhost:3000/group/getGroupMember", {params:{"grpName":params.grpName}})
        .then(function(res){
            setGroupMember(res.data);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 특정 그룹의 리더를 가져오는 함수
    const getGroupLeader = async () => {
        axios.get("http://localhost:3000/group/getGroupLeader", {params:{"grpNo":params.grpNo}})
        .then(function(res) {
            setGroupLeader(res.data);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 특정 그룹에 가입 요청한 회원을 가져오는 함수
    const getGroupJoinRequest = async () => {
        axios.get("http://localhost:3000/group/getGroupJoinRequest", {params:{"grpNo":params.grpNo}})
        .then(function(res) {
            setJoinRequest(res.data.joinRequestList);
        })
        .catch(function(err) {
            alert(err);
        })
    }

    useEffect(()=>{
        if(params.grpName === "돌봄") {
            getCareGroupAllFeed();
        }
        isMember();
        getGroupLeader();
        getGroupJoinRequest();
        groupMemberHandler();
    },[params.grpNo])


    // 해당 그룹 가입 여부에 따른, 피드 출력 방식 
    const isMember = async () => {
        axios.post("http://localhost:3000/group/isMember", null, {params:{"groupId":params.grpNo, "memberId":userId}})
        .then(function(res) {
            if(res.data.count !== 0) {
                setMember(true);
                setGroupFeed(res.data.groupAllFeed);
            } else {
                setMember(false);
                setGroupFeed(res.data.groupFeed);
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 돌봄 그룹 피드 출력
    const getCareGroupAllFeed = async () => {
        axios.get("http://localhost:3000/group/getCareGroupAllFeed", {params:{"grpNo":params.grpNo}})
        .then(function(res){
            setCareGroupFeed(res.data.careGroupFeedList);
            console.log(res.data.careGroupFeedList);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 댓글 리스트 커스텀 훅
    const useCommentList = (grpFeedNo) => {
        const [commentList, setCommentList] = useState([]);

        useEffect(()=>{
            axios.get("http://localhost:3000/group/getCommentList", {params:{"grpFeedNo":grpFeedNo}})
            .then(function(res){
                setCommentList(res.data.cmtList);
            })
            .catch(function(err){
                alert(err);
            })
        }, [grpFeedNo]);

        return commentList;
    }

    // 특정 인원의 그룹 가입 요청 승인 함수
    const acceptJoinRequest = async (memberId) => {
        axios.post("http://localhost:3000/group/acceptJoinRequest", null, {params:{"groupId":params.grpNo, "memberId": memberId}})
        .then(function(res) {
            alert(res.data);
            window.location.reload();
        })
        .catch(function(err){
            alert(err);
        })
    }


    // 피드 삭제
    const feedDelete = async (grpFeedNo) => {
        if(window.confirm("피드를 삭제하시겠습니까?")) {
            axios.get("http://localhost:3000/group/feedDelete", {params:{"grpFeedNo":grpFeedNo}})
            .then(function(res){
                alert(res.data);
                window.location.reload();
            })
            .catch(function(err){
                alert(err);
            })
        }
    }

    // 좋아요 처리
    const likeHandler = async (feedNo) => {
        axios.post("http://localhost:3000/group/groupFeedLike", null, {params:{"grpFeedNo":feedNo, "grpFeedLikeId":userId}})
        .then(function(res) {
            alert(res.data);
            window.location.reload();
        })
        .catch(function(err){
            alert(err);
        })
    }

    {/*일반 그룹 피드 및 해당 피드 댓글 출력 component*/}
    const FeedWithComments = ((props)=>{

        const html = props.feed.grpFeedContent.replace(/<img /g, '<img class="img-fluid rounded w-100" ');

        const commentList = useCommentList(props.feed.grpFeedNo);

        const [count, setCount] = useState('');
        const [comment, setComment]= useState('');

        // 댓글 카운트
        axios.get("http://localhost:3000/group/getCommentList", {params:{"grpFeedNo":props.feed.grpFeedNo}})
        .then(function(res){
            setCount(res.data.cmtCount);
        })
        .catch(function(err){
            alert(err);
        })

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
                 <div className="post-item">
                    <div className="user-post-data py-3">
                        <div className="d-flex justify-content-between">
                            <div className="me-3">
                                {/* // TO-DO 유저 프로필 사진 넣어주세요 */}
                                <img className="rounded-circle img-fluid" src="/assets/images/user/04.jpg" alt=""></img>
                            </div>
                            <div className="w-100">
                                <div className="d-flex justify-content-between">
                                    <div className=''>
                                        {/* // TO-DO 이름 클릭 시, 해당 유저의 피드로 이동 */}
                                        <h5 className="mb-0 d-inline-block"><a href="#" className="">{props.feed.grpFeedId}</a></h5>
                                        <p className="mb-0">
                                        {props.feed.grpFeedSetting  === "멤버 공개"
                                            ?
                                            <>
                                                <i className="ri-lock-fill pe-1"></i>
                                                멤버 공개
                                            </>
                                            :
                                            <>
                                                <i className="ri-global-line pe-1"></i>
                                                전체 공개
                                            </>
                                        }
                                        ㆍ{props.feed.grpFeedWd.substring(0,10)}</p>
                                    </div>
                                    {/* 수정 및 삭제는 해당 피드를 작성한 사람만 가능 */}
                                    {userId === props.feed.grpFeedId && (
                                    <div className="card-post-toolbar">
                                        <div className="dropdown">
                                            <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                                <i className="ri-more-fill"></i>                                                
                                            </span>
                                            <div className="dropdown-menu m-0 p-0">
                                                <a className="dropdown-item p-3" onClick={()=>{ 
                                                                                                                                    setModifyFeedModal(true);
                                                                                                                                    setSelectedGrpFeedId(props.feed.grpFeedNo);
                                                                                                                                    }}>
                                                    <div className="d-flex align-items-top">
                                                        <i className="ri-pencil-line h4"></i>
                                                        <div className="data ms-2">
                                                            <h6>피드 수정</h6>
                                                            <p className="mb-0">Update your post and saved items</p>
                                                        </div>
                                                    </div>
                                                </a>
                                                <a className="dropdown-item p-3"  onClick={()=>{ 
                                                                                                                                    feedDelete(props.feed.grpFeedNo)
                                                                                                                                    }}>
                                                    <div className="d-flex align-items-top">
                                                        <i className="ri-delete-bin-7-line h4"></i>
                                                        <div className="data ms-2">
                                                            <h6>피드 삭제</h6>
                                                            <p className="mb-0">Remove this Post on Timeline</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div> // end of toolbar
                                    )}
                                </div>
                            </div> {/*end of w-100 */}
                        </div>
                        <div className="user-post my-3 mx-1">
                            {ReactHtmlParser(html)}
                        </div>
                        <div className="comment-area mt-3">
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                        <div className="like-block position-relative d-flex align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="total-like-block ms-2 me-3">
                                                    <span onClick={()=>{likeHandler(props.feed.grpFeedNo)}}>
                                                        <img src="/assets/images/icon/01.png" className="img-fluid" alt="" />
                                                    </span>
                                                    <span className="mx-1">{props.feed.grpFeedLikeCount} Likes</span>
                                                </div>
                                            </div>
                                            <div className="total-comment-block">
                                                <span>{count} Comments</span>
                                            </div>
                                        </div>
                            </div>
                            <hr />
                            <ul className="post-comments p-0 m-0">
                                <li className="mb-2">
                                    {commentList.map((cmt) => (
                                        <div className="d-flex" key={cmt.grpCmtNo}>
                                            <div className="user-img">
                                                {/* // TO-DO 유저 프로필 사진 넣어주세요 */}
                                                <img src="/assets/images/user/02.jpg" alt="user-img" className="avatar-35 rounded-circle img-fluid" />
                                            </div>
                                            <div className="comment-data-block ms-3">
                                                <h6>{cmt.grpFeedCmtId}</h6>
                                                <p className="mb-0">{cmt.grpFeedCmtContent}</p>
                                                <div className="d-flex flex-wrap align-items-center comment-activity ml-3">
                                                    {/* // TO-DO 답글 기능 추가해주세요 */}
                                                    <a href="javascript:void(0);">답글</a>
                                                    {/* 댓글 수정 및 삭제 버튼은 댓글 작성자만 가능 하도록 출력 */}
                                                    {userId === cmt.grpFeedCmtId &&
                                                    <>
                                                        <a
                                                        href="javascript:void(0);"
                                                        onClick={ () => { 
                                                            const handleClick = () => {
                                                                setModifyCmtModal(true);
                                                                setGrpCmtNo(cmt.grpCmtNo);
                                                            }
                                                            return handleClick(); }}
                                                        >수정</a>
                                                        <a
                                                            href="javascript:void(0)"
                                                            onClick={()=>{cmtDelete(cmt.grpCmtNo)}}
                                                        >삭제</a>
                                                    </>
                                                    }
                                                    <span>{cmt.grpFeedCmtWd.substring(0,10)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </li>
                            </ul> {/*end of post-comments} */}
                            <form className="comment-text d-flex align-items-center mt-3">
                                <input type="text" className="form-control rounded" value={comment} placeholder="소중한 댓글을 남겨주세요." onChange={(e)=>{setComment(e.target.value);}} />
                                <div className="comment-attagement d-flex">
                                    <a href="javascript:void(0);" onClick={()=>{cmtSubmit(props.feed.grpFeedNo)}}><i className="ri-reply-line me-3"></i></a>
                                </div>
                                {/* <button type="button" className="btn btn-primary d-block w-30 mx-1" onClick={()=>{cmtSubmit(props.feed.grpFeedNo)}}>등록</button> */}
                            </form>
                        </div> {/* end of comment-area mt-3} */}
                    </div> {/* end of user-post-data*/}
                </div> {/* end of post-item*/}
            </>
        ) // end of FeedWithComments return
    }) // end of FeedWithComments
    
    return ( // start of GroupFeed Component return
    <>
    <CreateFeedModal show={createFeedModal}
                                            onHide={()=>{setCreateFeedModal(false)}} />
        <ModifyFeedModal show={modifyFeedModal}
                                            onHide={()=>{setModifyFeedModal(false)}}
                                            grpFeedNo={selectedGrpFeedId} />
        <ModifyCmtModal show={modifyCmtModal}
                                            onHide={()=>{setModifyCmtModal(false)}}
                                            grpCmtNo={grpCmtNo}/>
        <CareFeedModal show={careFeedModal}
                                            onHide={()=>{setCareFeedModal(false)}}
                                            />
        <ModifyCareFeedModal show={modifyCareFeedModal}
                                            onHide={()=>{setModifyCareFeedModal(false)}}
                                            grpFeedNo={selectedGrpFeedId}
                                            />
        <div className="wrapper">
            <div className="header-for-bg">
                <div className="background-header">
                    <img src="/assets/images/page-img/profile-bg7.jpg" className="img-fluid w-100" alt="header-bg" />
                    <div className="title-on-header">
                        <div className="data-block">
                            <h1>{grpName}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div id="content-page" className="content-page">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
                                <div className="group-info d-flex align-items-center">
                                    <div className="me-3">
                                        {/* TO DO 그룹 대표 이미지 가져오기 */}
                                        <img className="rounded-circle img-fluid avatar-100" src="/assets/images/page-img/gi-1.jpg" alt="" />
                                    </div>
                                    <div className="info">
                                        <h4>{grpName}</h4>
                                        <p className="mb-0">{groupMember - 1} members</p>
                                    </div>
                                </div>
                            </div>
                        </div> {/* end of col-lg-12 */}
                        <div className="col-lg-8">
                        {/* // 그룹에 가입한 회원일 때, create feed 출력 */}
                        {member === true && (
                        <>
                            <div id="post-modal-data" className="card">
                                <div className="card-header d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">Create Post</h4>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="user-img">
                                            {/* TO-DO 유저 프로필 사진 넣어주세요 */}
                                            <img src="/assets/images/user/1.jpg" alt="user-img" className="avatar-60 rounded-circle" />
                                        </div>
                                        <div className="post-text ms-3 w-100">
                                            <input
                                                readOnly
                                                style={{border:'none'}}
                                                type="text"
                                                size="50"
                                                onClick={()=>{grpName === '돌봄' ? setCareFeedModal(true) : setCreateFeedModal(true)}}
                                                placeholder={grpName === '돌봄' ? '돌봄이 필요하세요?' : '무슨 일이 일어나고 있나요?'}
                                            />
                                        </div>
                                    </div>
                                </div> {/* end of card-body */}
                            </div> {/*end of post-modal-data */}
                        </>
                        )}
                        {grpName !== '돌봄' ? <NormalGroup /> : <CareGroup />}
                        </div> {/*end of col-lg-8 */}
                        {/* 그룹 가입 요청 인원 목록 */}
                        {userId === groupLeader
                        ?
                        <>
                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">Join Request</h4>
                                        </div>
                                    </div>
                                    {joinRequest !== null && joinRequest.length !== 0
                                    ?
                                    <>
                                        <div className="card-body">
                                            <ul className="list-inline p-0 m-0">
                                    {
                                        joinRequest.map(function(list, i) {
                                            return (
                                                <>
                                                    <li className="mb-3 d-flex align-items-center" key={i}>
                                                        {/* TO-DO 유저 프로필 사진 넣어주세요 */}
                                                        <div className="avatar-40 rounded-circle bg-gray text-center me-3"><i className="ri-bank-card-line h4"></i></div>
                                                        <h6 className="mb-0">{list.memberId}</h6>
                                                        <button type="button"
                                                                        className="btn btn-primary d-block mx-4"
                                                                        onClick={()=>{acceptJoinRequest(list.memberId)}}>
                                                            <i className="ri-add-line pe-2"></i>가입 승인
                                                        </button>
                                                    </li>
                                                </>
                                            )
                                        })
                                    }
                                            </ul>
                                        </div> {/*end of card-body*/}
                                    </>
                                    :
                                    <>
                                    </>
                                     }
                                </div> {/*end of card*/}
                            </div> {/*end of col-lg-4*/}
                        </>
                         :
                        <>
                        </>
                        }
                    </div>
                </div>
            </div>
       </div>
       </>
    );

    function NormalGroup() {
        return (
                <div className="card">
                    <div className="card-body">
                        {groupFeed !== null && groupFeed.length !== 0
                        ?
                            <>
                            {groupFeed.map((feed, i) => (
                                <FeedWithComments key={i} feed={feed} />
                            ))}
                            </>
                    // <table text-align="center">
                    //     <colgroup>
                    //         <col width='70' /><col width='600' /><col width='100' /><col width='70' />
                    //     </colgroup>
                    //     <thead>
                    //         <tr>
                    //             <th>작성자</th>
                    //             <th>피드 내용</th>
                    //             <th>작성일</th>
                    //             <th>공개여부</th>
                    //             <th>수정/삭제</th>
                    //         </tr>
                    //     </thead>
                    //     <tbody>
                    //         {groupFeed.map((feed, i) => (
                    //             <>
                    //             <FeedWithComments
                    //                 key={i}
                    //                 feed={feed}
                    //             />
                    //             <tr>
                    //                 <td colSpan={5}>──────────────────────────────────────────────────────────────────────</td>
                    //             </tr>
                    //             </>
                    //         ))}
                    //     </tbody>
                    // </table>
            :
            <>
            <p>해당 그룹에 작성된 피드가 없습니다.</p>
            </>
            }
                    </div>
                </div>
        )
    }

    function CareGroup(){

        // 피드 삭제
        const deleteCareFeed = async (i) => {
            await axios.get("http://localhost:3000/group/deleteCareFeed", {params:{"careGrpFeedNo":i}})
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
             {careGroupFeed !== null && careGroupFeed.length !== 0
            ?
                    <table text-align="center">
                        <colgroup>
                            <col width='70' /><col width='200' /><col width='100' /><col width='200' /><col width='200' />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>분류</th>
                                <th>피드 내용</th>
                                <th>작성자</th>
                                <th>시작일</th>
                                <th>종료일</th>
                                <th>시작시간</th>
                                <th>종료시간</th>
                                <th>체크사항</th>
                                <th>작성일</th>
                                <th>공개여부</th>
                                <th>수정/삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {careGroupFeed.map(function(feed,i){
                                return(
                                    <>
                                    <tr key={i}>
                                        {feed.careGrpType === 'care' ? <td>돌봄</td> : <td>산책</td> }
                                        <td>{ReactHtmlParser(feed.careGrpContent)}</td>
                                        <td>{feed.careGrpFeedWriter}</td>
                                        <td>{moment(feed.careGrpStartDt).locale("ko").format("YY년 MM월 DD일")}</td>
                                        <td>{moment(feed.careGrpEndDt).locale("ko").format("YY년 MM월 DD일")}</td>
                                        <td>{moment(feed.careGrpStartTime).format("HH:mm")}</td>
                                        <td>{moment(feed.careGrpEndTime).format("HH:mm")}</td>
                                        <td>{feed.careGrpCheck}</td>
                                        <td>{feed.careGrpFeedWd.substring(0,10)}</td>
                                        <td>{feed.careGrpFeedSetting}</td>
                                        <td>
                                            <button
                                                onClick={()=>{
                                                    setModifyCareFeedModal(true);
                                                    setSelectedGrpFeedId(feed.careGrpFeedNo);
                                                }}>수정
                                            </button>
                                            <button onClick={()=>{deleteCareFeed(feed.careGrpFeedNo)}}>삭제</button>
                                        </td>
                                    </tr>
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
            :
            <>
            <p>해당 그룹에 작성된 피드가 없습니다.</p>
            </>
            }
            </>
        )
    }
}