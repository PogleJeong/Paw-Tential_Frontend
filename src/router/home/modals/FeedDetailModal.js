import { useEffect } from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Modal, Carousel } from "react-bootstrap";
import ReactHtmlParser from "react-html-parser";
import axios from 'axios';

export default function FeedDetailModal({show, onHide, feedData, photo, noPhoto, getComment}) {
    
    
    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    const userId = cookies.USER_ID;

    // Carousel Component
    const CarouselComponent = () => {

        const [idx, setIdx] = useState(0);
    
        const handleSelect = (selectedIndex, e) => {
            setIdx(selectedIndex);
        };

        return (
            <div className="w-50">
            {photo && photo.length !== 0 && (
                <Carousel activeIndex={idx} onSelect={handleSelect}>
                {photo.map((photo, index) => {
                    return (
                        <Carousel.Item key={index}>
                            <img className="d-block w-100" src={photo} alt="피드사진" />
                        </Carousel.Item>
                    )
                })}
                </Carousel>
            )}
            </div>
        )
    }


    const [comment, setComment] = useState([]);

    
    // 댓글 리스트
    const getCommentList = async () => {
        axios.get("http://localhost:3000/home/getCommentList",  {params:{"feedSeq":feedData.seq}})
        .then(function(res){
            setComment(res.data.commentList);

        })
        .catch(function(err){
            alert(err);
        })
    }
    


    useEffect(()=>{
        if(show) {
            getCommentList();
        }
    },[show, feedData]);


    // 댓글 리스트 컴포넌트
    const CommentItem = ({cmt, key}) => {

        const [commentText, setCommentText] = useState(cmt.comment);
        const [isEditing, setIsEditing] = useState(false);

        const handleEditClick = () => {
            setIsEditing(true);
        }

        const handleCommentChange = (e) => {
            setCommentText(e.target.value);
        }

        const handleCancelClick = () => {
            setCommentText(cmt.comment);
            setIsEditing(false);
        }

         // 댓글 수정 처리 함수
         const handleSaveClick = async (seq) => {

            if(window.confirm("댓글을 수정하시겠습니까?")) {
                axios.post("http://localhost:3000/home/modifyComment", null,  {params:{"comment":commentText, "seq":seq}})
                .then(function(res){
                    setIsEditing(false);
                    getCommentList();
                })
                .catch(function(err){
                    alert(err);
                })
            }

        }

         // 댓글 삭제처리
        const deleteComment = async (seq) => {

            if(window.confirm("댓글을 삭제하시겠습니까?")) {
                axios.get("http://localhost:3000/home/deleteComment", {params:{"seq":seq}})
                .then(function(res){
                    alert(res.data);
                    getCommentList();
                })
                .catch(function(err){
                    alert(err);
                })
            }

        }


        if(isEditing) {
            return (
                <li key={cmt.seq} className="mb-2">
                    <form className="comment-text d-flex align-items-center mt-3" action="javascript:void(0);">
                        <input value={commentText} className="form-control rounded" onChange={handleCommentChange} style={{"line-height":"50px"}} />
                    <div className="comment-attagement d-flex">
                        <a href="javascript:void(0);" onClick={()=>{handleSaveClick(cmt.seq)}}>
                            <button className="btn btn-light rounded-pill">수정</button>
                        </a>
                        <a href="javascript:void(0);" onClick={handleCancelClick}>
                            <button className="btn btn-danger rounded-pill mx-1">취소</button>
                        </a>
                    </div>
                    </form>
                </li>
            )
        } else {
            return (
                <li className="mb-2" key={key}>
                <div className="d-flex">
                    <div className="user-img">
                        <img className="rounded-circle img-fluid" src={`http://localhost:3000/${cmt.profile}`} alt="" style={{width:"60px", height:"60px"}} />
                    </div>
                    <div className="comment-data-block ms-3">
                        <h6>{cmt.nickname}ㆍ{cmt.dateCreated.substring(0,10)}</h6>
                        <span>{cmt.comment}</span>
                        <div className="d-flex flex-wrap align-items-center comment-activity">
                            {cmt.id === userId && (
                                <>
                                    <a href="javascript:void(0);" onClick={()=>{handleEditClick(cmt.seq)}}>수정</a>
                                    <a href="javascript:void(0);" onClick={()=>{deleteComment(cmt.seq)}}>삭제</a>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                </li>
            )
        }


    }

    return (
            <Modal size="xl" show={show} onHide={()=>{onHide(); getComment();}} centered>
                <Modal.Header closeButton />
                <Modal.Body>
                    <div className="d-flex">
                        <CarouselComponent />
                        <div className="w-50 ms-3">
                            <div className="d-flex justify-content-between">
                                <div className="me-2">
                                    <img className="rounded-circle img-fluid" src={`http://localhost:3000/${feedData.profile}`} alt="" style={{width:"60px", height:"55px"}} />
                                </div>
                                <div className="w-85">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h5 className="mb-0">{feedData.nickname}</h5>
                                            <span className="mb-0 d-inline-block">{feedData.dateCreated.substring(0,10)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <p>{ReactHtmlParser(noPhoto)}</p>
                            <hr />
                            <ul className="post-comments list-inline p-0 m-0">
                            {comment && comment.length !== 0 && (
                                <>
                                {comment.map(function(cmt, i) {
                                    return (
                                        <CommentItem cmt={cmt} key={i} />
                                    )
                                })}
                                </>
                            )}
                            </ul>
                        </div>
                    </div> {/* end of d-flex */}
                </Modal.Body>
            </Modal>
    )
}