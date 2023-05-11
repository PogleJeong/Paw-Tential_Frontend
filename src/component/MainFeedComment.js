import { useEffect } from "react";
import { useState } from "react"
import axios from 'axios';
import FeedDetailModal from "../router/home/modals/FeedDetailModal";

export default function MainFeedComment(props) {

    // 각 피드에 대한 댓글 불러오기
    const [commentList, setCommentList] = useState([]);

    const [feedDetailModal, setFeedDetailModal] = useState(false);

    // 피드 자세히 보기 함수
    const handleClick = () => {
        setFeedDetailModal(true);
    }

    // 댓글
    const [comment, setComment] = useState('');

    const getCommentList = async () => {
        axios.get("http://localhost:3000/home/getCommentList", {params:{"feedSeq":props.data.seq}})
        .then(function(res){
            setCommentList(res.data.commentList);
        })
        .catch(function(err){
            alert(err);
        })    
    }

    useEffect(()=>{
        getCommentList();
    },[props.seq])

    // 댓글 작성처리
    const writeComment = async () => {
        axios.post("http://localhost:3000/home/writeComment", null, {params:{"feedSeq":props.data.seq, "id":props.id, "comment":comment}})
        .then(function(res){
            alert(res.data);
            setComment("");
            props.onCommentSubmit();
            getCommentList();
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 댓글 삭제처리
    const deleteComment = async (seq) => {
        if(window.confirm("댓글을 삭제하시겠습니까?")) {
            axios.get("http://localhost:3000/home/deleteComment", {params:{"seq":seq}})
            .then(function(res){
                alert(res.data);
                props.onCommentDelete();
                getCommentList();
            })
            .catch(function(err){
                alert(err);
            })
        }
    }

    const MainFeedCommentItem = ({list}) => {

        const [commentText, setCommentText] = useState(list.comment);
        const [isEditing, setIsEditing] = useState(false);

        const handleEditClick = () => {
            setIsEditing(true);
        }

        const handleCommentChange = (e) => {
            setCommentText(e.target.value);
        }

        const handleCancelClick = () => {
            setCommentText(list.comment);
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

        if(isEditing) {
            return (
                <li key={list.seq} className="mb-2">
                    <form className="comment-text d-flex align-items-center mt-3" action="javascript:void(0);">
                        <input value={commentText} className="form-control rounded" onChange={handleCommentChange} style={{"line-height":"50px"}} />
                    <div className="comment-attagement d-flex">
                        <a href="javascript:void(0);" onClick={()=>{handleSaveClick(list.seq)}}>
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
                <li key={list.seq} className="mb-2"> 
                <div className="d-flex">
                    <div className="user-img">
                    {list.profile === "baseprofile" || "test" && <img className="rounded-circle img-fluid" src="/feedimages/baseprofile.png" alt="" style={{width:"60px", height:"60px"}} />}
                    </div>
                    <div className="comment-data-block ms-3">
                        <h6>{list.id}</h6>
                        <p className="mb-0">{list.comment}</p>
                        <div className="d-flex flex-wrap align-items-center comment-activity">
                            {list.id === props.id && (
                                <>
                                <a href="javascript:void(0);" onClick={handleEditClick}>수정</a>
                                <a href="javascript:void(0);" onClick={()=>{deleteComment(list.seq)}}>삭제</a>
                            </>
                            )}
                            <span>{list.dateCreated.substring(0,10)}</span>
                        </div>
                    </div>
                </div>
            </li>
            )
        }
    }


    return (
        <>
            <FeedDetailModal show={feedDetailModal}
                                            onHide={()=>{setFeedDetailModal(false)}}
                                            feedData={props.data}
                                            photo={props.photo}
                                            noPhoto={props.noPhoto}
                                            getComment={()=>{getCommentList()}} />
            <ul className="post-comments list-inline p-0 m-0">
                {commentList && commentList.length !== 0 && (
                <>
                {commentList.slice(0,2).map((list) => (
                <MainFeedCommentItem list={list} />
                ))}
                {commentList.length > 2 && (
                <div className="d-flex align-items-center">
                    <p className="mb-0 me-1 mx-2">
                        <a href="javascript:void(0);" onClick={handleClick}>{commentList.length -2}개의 댓글 더 보기...</a>
                    </p>
                </div>
                )}
                </>
                )}
            </ul>
            <form className="comment-text d-flex align-items-center mt-3" action="javascript:void(0);">
                <input type="text" className="form-control rounded" placeholder="소중한 댓글을 남겨주세요" value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
                <div className="comment-attagement d-flex">
                    <a href="javascript:void(0);" onClick={writeComment}>
                        <i className="ri-arrow-right-s-line mx-1"></i>
                    </a>
                </div>
            </form>
        </>
    )
}