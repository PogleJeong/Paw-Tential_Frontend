import { useEffect, useState } from "react";
import axios from "axios";
import ModifyFeedModal from "../router/group/modals/ModifyFeedModal";
import { Carousel } from "react-bootstrap";
import ReactHtmlParser from "react-html-parser";


export default function GroupFeedItems(props){

    const [selectedGrpFeedId, setSelectedGrpFeedId] = useState('');
    const [modifyFeedModal, setModifyFeedModal] = useState(false);

     // content 내에서 이미지, 글 분리하기
     const [image, setImage] = useState([]);
     const [noImage, setNoImage] = useState([]);
 
     const getImage = () => {
         const regex = /<img src="([^"]+)"/g;
         const urls = [];
 
         let match;
         while ((match = regex.exec(props.data.grpFeedContent)) !== null) {
             urls.push(match[1]);
         }
 
         setImage(urls);
     };
 
     const getNoImage = () => {
         const noImage = props.data.grpFeedContent;
 
         const regex = /<img.*?>|<figure.*?>|<\/figure>/gi;
         const result = noImage.replace(regex, '');

         setNoImage(result);
     };

     // 좋아요 컴포넌트
     const LikeComponent = (count) => {
        const [hasLiked, setHasLiked] = useState(0);
        const [likeCount, setLikeCount] = useState(count.likeCount);
        const [likes, setLikes] = useState([]);

         // 특정 피드에 좋아요 누른 인원
        const likesMember = async () => {
            axios.get("http://localhost:3000/group/likesMember", {params:{"grpFeedNo":props.data.grpFeedNo}})
            .then(function(res){
                setLikes(res.data.likes);
            })
            .catch(function(err){
                alert(err);
            })
        }

        // 좋아요 이력체크
        const likeCheck = async () => {
            axios.get("http://localhost:3000/group/likeCheck", {params:{"grpFeedNo":props.data.grpFeedNo,"grpFeedLikeId":props.userId}})
            .then(function(res){
                res.data !== 0 ? setHasLiked(1) : setHasLiked(0);
            })
            .catch(function(err){
                alert(err);
            })
         }

         // 좋아요 처리
         const likeHandler = async (feedNo) => {
            axios.post("http://localhost:3000/group/groupFeedLike", null, {params:{"grpFeedNo":feedNo, "grpFeedLikeId":props.userId}})
            .then(function(res) {
                alert(res.data);
                if(res.data === "좋아요가 반영되었습니다.") {
                    setHasLiked(1);
                    setLikeCount(prevCount => prevCount +1);
                    likesMember();
                } else {
                    setHasLiked(0);
                    setLikeCount(prevCount => prevCount -1);
                    likesMember();
                }
            })
            .catch(function(err){
                alert(err);
            })
        }

        useEffect(()=>{
            likeCheck();
            likesMember();
        }, []);

        return (
            <>
                <div className="d-flex align-items-center" onClick={()=>{likeHandler(props.data.grpFeedNo)}}>
                    <div className="like-data">
                        <div className="dropdown">
                            <span>
                                <img
                                    className="avatar-35 img-fluid"
                                    src={hasLiked === 0 ? "/feedimages/unLikeImg.png" : "/feedimages/likeImg.png"}
                                    alt={hasLiked === 0 ? "unLike" : "like"}
                                    style={{width:"25px", height:"25px"}}
                                />
                            </span>
                        </div>
                    </div>
                    <div className="total-like-block ms-2 me-3">
                        <div className="dropdown">
                            <span className="dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                            {likeCount}명이 좋아합니다.
                            </span>
                            <div className="dropdown-menu">
                            {likes && likes.length !== 0 && 
                                <>
                                {likes.map((mem, i) => {
                                    return (
                                        <a key={i} className="dropdown-item" href="javascript:void(0);">{mem.nickname}</a>
                                    )
                                })}   
                                </>
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
     }

     // 댓글 컴포넌트
     const CommentComponent = () => {

        // 댓글 카운트
        const [commentCount, setCommentCount] = useState(props.data.grpCommentCount);
        
        // 작성 댓글
        const [comment, setComment] = useState('');

        // 댓글 작성 처리
        const writeComment = async () => {
            if(window.confirm("댓글을 등록하시겠습니까?")) {
                axios.post("http://localhost:3000/group/writeGrpFeedCmt", null, {params:{"grpFeedNo":props.data.grpFeedNo, "grpFeedCmtId":props.userId, "grpFeedCmtContent":comment}})
                .then(function(res){
                    setComment('');
                    setCommentCount(prevCount => prevCount +1);
                    getCommentList();
                })
                .catch(function(err){
                    alert(err);
                })
            }
        }
        
        // 댓글 수정
        const [isEditing, setIsEditing] = useState(false);
        const [commentText, setCommentText] = useState('');
        const [editingCommentId, setEditingCommentId] = useState(null);
        const handleEditClick = (cmt) => {
            setIsEditing(true);
            setCommentText(cmt.grpFeedCmtContent);
            setEditingCommentId(cmt.grpCmtNo);
        }
        const handleCommentChange = (e) => {
            setCommentText(e.target.value);
        }

        // 댓글 수정 처리 함수
        const handleSaveClick = async (seq) => {
            if(window.confirm("댓글을 수정하시겠습니까?")) {
                axios.post("http://localhost:3000/group/cmtModify", null,  {params:{"grpFeedCmtContent":commentText, "grpCmtNo":seq}})
                .then(function(res){
                    setIsEditing(false);
                    getCommentList();
                })
                .catch(function(err){
                    alert(err);
                })
            }
        }

        // 댓글 삭제 처리
        const deleteComment = async (grpCmtNo) => {
            if(window.confirm("댓글을 삭제하시겠습니까?")) {
                axios.get("http://localhost:3000/group/cmtDelete", {params:{"grpCmtNo":grpCmtNo}})
                .then(function(res){
                    setCommentCount(prevCount => prevCount -1);
                    getCommentList();
                })
                .catch(function(err){
                    alert(err);
                })
            };
        }

        // 댓글 리스트
        const [commentList, setCommentList] = useState([]);
        const getCommentList = async () => {
            axios.get("http://localhost:3000/group/getCommentList", {params:{"grpFeedNo":props.data.grpFeedNo}})
            .then(function(res) {
                setCommentList(res.data.cmtList);
            })
            .catch(function(err){
                alert(err);
            })
        }

        useEffect(()=>{
            getCommentList();
        },[props.data.grpFeedNo]);

        return (
            <>
            <div className="total-comment-block my-3">
                <img src="/feedimages/comment.png" className="img-fluid mx-1" style={{width:"20px"}}/>
                <span>댓글({commentCount})</span>
            </div>
            <ul className="post-comments list-inline p-0 m-0">
                {commentList && commentList.length != 0 && (
                    commentList.map(function(cmt) {
                        return (
                            <>
                            <li className="mb-2" key={cmt.grpCmtNo}>
                                <div className="d-flex">
                                    <div className="user-img">
                                        <img className="avatar-35 rounded-circle img-fluid" src={`http://localhost:3000/${cmt.profile}`} alt="" />
                                    </div>
                                    <div className="comment-data-block ms-3">
                                        <h6>{cmt.grpFeedCmtId}</h6>
                                        {isEditing && editingCommentId === cmt.grpCmtNo ? (
                                            <form className="comment-text d-flex align-items-center mt-3" action="javascript:void(0);">
                                                <input type="text"
                                                            className="form-control rounded"
                                                            value={commentText}
                                                            style={{"line-height":"50px"}}
                                                            size="50"
                                                            onChange={handleCommentChange}
                                                />
                                                <div className="comment-attagement d-flex">
                                                    <a href="javascript:void(0);">
                                                        <button className="btn btn-light rounded-pill" onClick={()=>{handleSaveClick(cmt.grpCmtNo)}}>수정</button>
                                                    </a>
                                                    <a href="javascript:void(0);">
                                                        <button className="btn btn-danger rounded-pill mx-1" onClick={()=>{setEditingCommentId(null)}}>취소</button>
                                                    </a>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                            <p className="mb-0">{cmt.grpFeedCmtContent}</p>
                                            <div className="d-flex flex-wrap align-items-center comment-activity">
                                                <a href="javascript:void(0);">답글</a>
                                                {cmt.grpFeedCmtId === props.userId && (
                                                    <>
                                                        <a href="javascript:void(0);" onClick={() => handleEditClick(cmt)}>수정</a>
                                                        <a href="javascript:void(0);" onClick={() => {deleteComment(cmt.grpCmtNo)}}>삭제</a>
                                                    </>
                                                )}
                                                <span>{cmt.grpFeedCmtWd.substring(0,10)}</span>
                                            </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </li>
                            </>
                        )
                    })
                )}
                </ul>
                <form className="comment-text d-flex align-items-center mt-3" action="javascript:void(0);">
                    <input type="text" className="form-control rounded" placeholder="소중한 댓글을 남겨주세요." value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
                    <div className="comment-attagement d-flex">
                        <a href="javascript:void(0);" onClick={writeComment}>
                            <i className="ri-arrow-right-s-line mx-1" />
                        </a>
                    </div>
                </form>
            </>
        )
     }
     
     // 피드 삭제
     const feedDelete = async (grpFeedNo) => {
        if(window.confirm("피드를 삭제하시겠습니까?")) {
            axios.get("http://localhost:3000/group/feedDelete", {params:{"grpFeedNo":grpFeedNo}})
            .then(function(res){
                alert(res.data);
                props.isMember();
            })
            .catch(function(err){
                alert(err);
            })
        }
    }
    
    // Carousel Component
    const CarouselComponent = () => {
        const [idx, setIdx] = useState(0);
        const handleSelect = (selectedIdx) => {
            setIdx(selectedIdx);
        };
        return (
            <>
            {image && image.length !== 0 && (
                <Carousel activeIndex={idx} onSelect={handleSelect}>
                    {image.map((img, idx) => {
                        return (
                            <Carousel.Item key={idx}>
                                <img className="d-block w-100" src={img} alt="img" />
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
            )}
            </>
        )
    }

    useEffect(()=>{
        getImage();
        getNoImage();
    },[props.data]);

    return (
        <>
            <ModifyFeedModal show={modifyFeedModal} onHide={()=>{setModifyFeedModal(false)}} grpFeedNo={selectedGrpFeedId} fn={props.isMember} />
            <div className="post-item">
                <div className="user-post-data py-3">
                    <div className="d-flex justify-content-between">
                        <div className="me-3">
                            <img className="avatar-60 rounded-circle" src={`http://localhost:3000/${props.data.profile}`} alt="" style={{width:"60px", height:"60px"}} />
                        </div>
                        <div className="w-100">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5 className="mb-0 d-inline-block">{props.data.nickname}</h5>
                                    <p className="mb-0">{props.data.grpFeedWd.substring(0,10)}ㆍ<i className={`ri-${props.data.grpFeedSetting === "전체 공개" ? 'lock-fill pe-1' : 'global-line pe-1' }`} /></p>
                                </div>
                                <div className="card-post-toolbar">
                                    <div className="dropdown">
                                        <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                            <i className="ri-more-fill">
                                            </i>
                                        </span>
                                        <div className="dropdown-menu m-0 p-0">
                                            <a className="dropdown-item p-3" href="javascript:void(0);">
                                                <div className="d-flex align-items-top">
                                                    <div className="h4">
                                                        <i className="ri-alarm-warning-line" />
                                                    </div>
                                                    <div className="data ms-2">
                                                        <h6>피드 신고하기</h6>
                                                        <p className="mb-0">해당 피드에 우려되는 부분이 있습니다.</p>
                                                    </div>
                                                </div>
                                            </a>
                                            {props.userId === props.data.grpFeedId && (
                                            <>
                                            <a className="dropdown-item p-3"
                                                    href="javascript:void(0);"
                                                    onClick={ () => {
                                                        setModifyFeedModal(true);
                                                        setSelectedGrpFeedId(props.data.grpFeedNo);
                                                    }}
                                            >
                                                <div className="d-flex align-items-top">
                                                    <div className="h4">
                                                        <i className="ri-edit-line" />
                                                    </div>
                                                    <div className="data ms-2">
                                                        <h6>피드 수정하기</h6>
                                                        <p className="mb-0">해당 피드를 수정합니다.</p>
                                                    </div>
                                                </div>
                                            </a>
                                            <a className="dropdown-item p-3" href="javascript:void(0);" onClick={()=>{feedDelete(props.data.grpFeedNo)}}>
                                                <div className="d-flex align-items-top">
                                                    <div className="h4">
                                                        <i className="ri-delete-bin-line" />
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
                <div className="user-post">
                    <CarouselComponent />
                    <div className="mt-3">
                        <p>{ReactHtmlParser(noImage)}</p>
                    </div>
                </div>
                <div className="comment-area mt-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <div className="like-block position-relative d-flex align-items-center">
                            <LikeComponent likeCount={props.data.grpFeedLikeCount}/>
                        </div>
                    </div>
                    <hr />
                    <CommentComponent />
                </div>
            </div>
        </>
    )
}