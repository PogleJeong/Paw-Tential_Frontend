import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Session from "react-session-api"
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import { FeedImage, FeedContent } from "./FeedData";
import { FeedDropdown_user, FeedDropdown_writer } from "./FeedDropdown";
import MainFeedComment from "./MainFeedComment";
import ModifyMainFeedModal from "../router/Feed/modals/ModifyMainFeedModal";
import FeedReportModal from "../router/Feed/modals/FeedReportModal";
import { Form } from "react-bootstrap";


const MainFeed = (props) => {

  const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
  const [showReportModal, setShowReportModal] = useState(false);

  const navigate = useNavigate();


  // 피드 상세 모달로 넘겨줄 데이터(1) - 이미지 데이터
  // props로 받은 데이터 중, 이미지 데이터만 추려서 배열에 담기
  const [photo, setPhoto] = useState([]);

  const getPhoto = () => {
    const regex = /<img src="([^"]+)"/g;
    const urls = [];

    let match;
    while ((match = regex.exec(props.feedData.content)) !== null) {
      urls.push(match[1]);
    }

    setPhoto(urls);
  }

  // 피드 상세 모달로 넘겨줄 데이터(2) - 이미지 제외 데이터
  // props로 받은 데이터 중, 이미지 제외한 데이터만 추려서 배열에 담기
  const [noPhoto, setNoPhoto] = useState([]);

  const getNoPhoto = () => {
    const content = props.feedData.content;

    const regex = /<img.*?>|<figure.*?>|<\/figure>/gi;
    const result = content.replace(regex, '');

    setNoPhoto(result);
  }

  // 피드 수정 모달
  const [modifyMainFeedModal, setModifyMainFeedModal] = useState(false);

  // 상세 페이지로 넘겨줄 댓글 리스트
  const [commentList, setCommentList] = useState([]);

  const getCommentList = async () => {
    axios.get("http://localhost:3000/home/getCommentList", {params:{"feedSeq":props.feedData.seq}})
    .then(function(res){
        setCommentList(res.data.commentList);
    })
    .catch(function(err){
        alert(err);
    })    
}

// 신고 모달
const handleOpenReportModal = () => {
  setShowReportModal(true);
};

const handleCloseReportModal = () => {
  setShowReportModal(false);
};

  useEffect(()=>{
    getCommentList();
    getPhoto();
    getNoPhoto();
    console.log(noPhoto);
  },[props.feedData.seq]);

  // 좋아요 수
  const [likeCount, setLikeCount] = useState(props.feedData.favoriteCount);

  // 북마크 수
  const [bookMarkCount, setBookMarkCount] = useState(props.feedData.bookmarkCount);
  // 북마크 이력 체크
  const [bookMarkCheck, setBookMarkCheck] = useState(0);

  const hasBookMark = async () => {
    axios.get("http://localhost:3000/home/hasBookMark", {params:{"feedSeq":props.feedData.seq, "id":userId}})
    .then(function(res){
      res.data !== 0 ? setBookMarkCheck(1) : setBookMarkCheck(0);
    })
    .catch(function(err){
      alert(err);
    })
  }

  useEffect(()=>{
    hasBookMark();
  },[props.feedData.seq])

  // 댓글 수
  const [commentCount, setCommentCount] = useState(props.feedData.commentCount);

  const [isDropdown, setIsDropdown] = useState(false);
  const dropMenuRef = useRef(null);

  // 임시 아이디
  const userId = cookies.USER_ID;

  // 피드 삭제하기
  const feedDelete = (seq) => {
    axios.get("http://localhost:3000/home/feedDelete", {params:{"seq":seq}})
    .then(function(res){
      alert(res.data);
      window.location.reload();
    })
    .catch(function(err){
      alert(err);
    })
  }

  // 북마크 처리
  const bookMarkHandler = async (feedSeq) => {
    axios.get("http://localhost:3000/home/bookMark", {params:{"feedSeq":feedSeq, "id":userId}})
    .then(function(res){
      if(res.data === "bookMark") {
        alert("북마크 되었습니다.");
        setBookMarkCheck(1);
        setBookMarkCount(prevCount => prevCount + 1);
      } else {
        alert("북마크 해제 되었습니다.");
        setBookMarkCheck(0);
        setBookMarkCount(prevCount => prevCount -1);
      }
    })
  }

  // 좋아요 처리
  const likeHandler = async (feedSeq) => {

    axios.get("http://localhost:3000/home/like", {params:{"feedSeq":feedSeq, "id":userId}})
    .then(function(res){
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

  // 유저 아이디 클릭 시 피드로 이동
  const handleUserClick = (userId) => {
    navigate(`/myfeed/myfeed2/${userId}`); // Navigate to the user's MyFeed page
  };

  return (
    <>
      <ModifyMainFeedModal show={modifyMainFeedModal} onHide={()=>{setModifyMainFeedModal(false)}} seq={props.feedData.seq} />
      <div className="col-sm-12">
        <div className="card card-block card-stretch card-height">
          <div className="card-body">
            <div className="user-post-data">
              <div className="d-flex justify-content-between">
                <div className="me-3">
                  <img className="rounded-circle img-fluid" src={props.feedData.profile} alt="" style={{width:"60px", height:"55px"}} />
                </div>
                <div className="w-100">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5 className="mb-0 d-inline-block" onClick={() => handleUserClick(props.feedData.id)} onMouseOver={(e) => (e.target.style.cursor = 'pointer')}>{props.feedData.id}</h5>
                      <p className="mb-0 text-primary">{props.feedData.dateCreated.substring(0,10)}</p>
                    </div>
                    <div className="card-post-toolbar">
                      <div className="dropdown">
                        <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                          <i className="ri-more-fill">
                          </i>
                        </span>
                        <div className="dropdown-menu m-0 p-0">
                          <a className="dropdown-item p-3" href="javascript:void(0);" >
                              {showReportModal && <FeedReportModal
                              show={showReportModal} 
                              onClose={handleCloseReportModal} 
                              feedData={props.feedData}
                              userId={cookies.USER_ID} 
                              type={'피드'}/>}
                            <div className="d-flex align-items-top" onClick={handleOpenReportModal}  >
                              <div className="h4">
                                <i className="ri-alarm-warning-line">
                                </i>
                              </div>
                              <div className="data ms-2" >

                                <h6>피드 신고하기</h6>
                                <p className="mb-0">해당 피드에 우려되는 부분이 있습니다.</p>
                              </div>
                            </div>
                          </a>
                          {userId === props.feedData.id && (
                          <>
                            <a className="dropdown-item p-3" href="javascript:void(0);" onClick={()=>{setModifyMainFeedModal(true);}}>
                              <div className="d-flex align-items-top">
                                <div className="h4">
                                  <i className="ri-edit-line">
                                  </i>
                                </div>
                                <div className="data ms-2">
                                  <h6>피드 수정하기</h6>
                                  <p className="mb-0">해당 피드를 수정합니다.</p>
                                </div>
                              </div>
                            </a>
                            <a className="dropdown-item p-3" href="javascript:void(0);" onClick={()=>{feedDelete(props.feedData.seq)}}>
                              <div className="d-flex align-items-top">
                                <div className="h4">
                                  <i className="ri-delete-bin-line">
                                  </i>
                                </div>
                                <div className="data ms-2">
                                  <h6>피드 삭제하기</h6>
                                  <p className="mb-0">해당 피드를 삭제합니다.</p>
                                </div>
                              </div>
                            </a>
                          </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3">
            </div>
            <div className="user-post">
              {/* // TO-DO 이미지 클릭 시, 피드 상세보기 모달 띄어주세요 */}
              <a href="javascript:void(0);">
                <FeedImage content={props.feedData.content}
                                        feedData={props.feedData}
                                        photo={photo}
                                        noPhoto={noPhoto}
                                        getComment={getCommentList}
                />
              </a>
            </div>
            <div className="mt-3">
              <FeedContent content={props.feedData.content}
                                        feedData={props.feedData}
                                        photo={photo}
                                        noPhoto={noPhoto}
                                        getComment={getCommentList}
                />
            </div>
            <div className="comment-area mt-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="like-block position-relative d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="like-data">
                      <div className="dropdown">
                        <span>
                          <img src="/assets/images/icon/01.png" className="img-fluid" />
                        </span>
                      </div>
                    </div>
                    <div className="total-like-block ms-2 me-3">
                      <div className="dropdown">
                        <span onClick={()=>{likeHandler(props.feedData.seq)}}>{likeCount} Likes</span>
                      </div>
                    </div>
                  </div>
                  <div className="total-comment-block">
                    <div className="dropdown">
                      <img src="/assets/images/icon/16.png" className="img-fluid mx-1" style={{width:"30px"}}/>
                      <span>{commentCount} Comment</span>
                    </div>
                  </div>
                </div>
                <div className="share-block d-flex align-items-center feather-icon mt-2 mt-md-0" onClick={()=>{bookMarkHandler(props.feedData.seq)}}>
                  <a href="javascript:void(0);" data-bs-target="#share-btn" aria-controls="share-btn">
                    <i className={`ri-bookmark-${bookMarkCheck === 0 ? 'line' : 'fill'}`}></i>
                    <span className="ms-1">{bookMarkCount}</span>
                  </a>
                </div>
              </div>
              <hr />
              <MainFeedComment data={props.feedData}
                                                    id={userId}
                                                    photo={photo}
                                                    noPhoto={noPhoto}
                                                    onCommentSubmit={() => {
                                                                                          setCommentCount(commentCount + 1);
                                                                                          getCommentList();
                                                                                        }}
                                                    onCommentDelete={() => setCommentCount(commentCount - 1)} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainFeed;