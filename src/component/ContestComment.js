import axios from "axios"
import { useEffect } from "react";
import { useState } from "react";

export default function ContestComment (props) {

    // 특정 컨테스트 or 당첨자 발표글에 작성된 댓글 리스트 및 댓글 갯수 가져오기
    const [commentList, setCommentList] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const getComment = async () => {
        axios.get("http://localhost:3000/contest/getComment", {params:{"contestSeq":props.seq}})
        .then(function(res){
            setCommentList(res.data.comment);
        })
        .catch(function(err){
            alert(err);
        })
    }
    const countHandler = async () => {
        axios.get("http://localhost:3000/contest/commentCount", {params:{"contestSeq":props.seq}})
        .then(function(res){
            setCommentCount(res.data);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 댓글 작성 처리
    const [comment, setComment] = useState('');
    const writeComment = async () => {
        if(comment !== '' && comment.trim() !== '') {
            if(window.confirm("댓글을 등록하시겠습니까?")) {
                axios.post("http://localhost:3000/contest/writeContestCmt", null, {params:{"contestSeq":props.seq, "id":'test33', "content":comment}})
                .then(function(res){
                    setComment('');
                    setCommentCount(prevCount => prevCount +1);
                    getComment();
                })
                .catch(function(err){
                    alert(err);
                })
            }
        } else {
            alert("댓글을 입력해주세요");
        }
    }

    // 댓글 수정 처리
    const [isEditing, setIsEditing] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState('');
    const handleEditClick = (list) => {
        setIsEditing(true);
        setCommentText(list.content);
        setEditingCommentId(list.seq);
    }
    const handleCommentChange = (e) => {
        setCommentText(e.target.value);
    }
    const handleSaveClick = async (seq) => {
        if(commentText !== '' && commentText.trim() !== '') {
            if(window.confirm("댓글을 수정하시겠습니까?")) {
                axios.post("http://localhost:3000/contest/cmtModify", null, {params:{"content":commentText, "seq":seq}})
                .then(function(res){
                    setIsEditing(false);
                    getComment();
                })
                .catch(function(err){
                    alert(err);
                })
            }
        } else {
            alert("댓글을 입력해주세요")
        }
    }

    // 댓글 삭제 처리
    const deleteComment = async (seq) => {
        if(window.confirm("댓글을 삭제하시겠습니까?")) {
            axios.get("http://localhost:3000/contest/cmtDelete", {params:{"seq":seq}})
            .then(function(res){
                setCommentCount(prevCount => prevCount -1);
                getComment();
            })
            .catch(function(err){
                alert(err);
            })
        };
    }

    useEffect(()=>{
        getComment();
        countHandler();
    },[props.seq]);

    
    return (
        <>
        <div className="comment-area mt-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="total-comment-block mb-3">
                    <img src="/feedimages/comment.png" className="img-fluid mx-1" style={{width:"20px"}}/>
                    <span>댓글({commentCount})</span>
                </div>
            </div>
            <ul className="post-comments list-inline p-0 m-0">
            {commentList && commentList.length !== 0 && (
                commentList.map(list => {
                    return (
                        <li className="mb-2" key={list.seq}>
                            <div className="d-flex">
                                <div className="user-img">
                                {list.profile === "test" && <img className="avatar-35 rounded-circle img-fluid" src="/feedimages/baseprofile.png" alt="" />}
                                {list.profile === "baseprofile" && <img className="avatar-35 rounded-circle img-fluid" src="/feedimages/baseprofile.png" alt="" />}
                                </div>
                                <div className="comment-data-block ms-2">
                                    <h6>{list.id}</h6>
                                    {isEditing && editingCommentId === list.seq ? (
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
                                                <button className="btn btn-light rounded-pill" onClick={()=>{handleSaveClick(list.seq)}}>수정</button>
                                            </a>
                                            <a href="javascript:void(0);">
                                                <button className="btn btn-danger rounded-pill mx-1" onClick={()=>{setEditingCommentId('')}}>취소</button>
                                            </a>
                                        </div>
                                        </form>
                                    ) : (
                                    <>
                                    <p className="mb-0">{list.content}</p>
                                    <div className="d-flex flex-wrap align-items-center comment-activity">
                                        <a href="javascript:void(0);" onClick={() => {handleEditClick(list)}}>수정</a>
                                        <a href="javascript:void(0);" onClick={() => {deleteComment(list.seq)}}>삭제</a>
                                        <span>{list.writeDt.substring(0,10)}</span>
                                    </div>
                                    </>
                                    )}
                                </div>
                            </div>
                        </li>
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
        </div>
        </>
    )
}