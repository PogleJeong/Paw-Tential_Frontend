import React, { useState, useEffect } from "react";
import "../styles/FeedPost.css";
import axios from "axios";

const HomeFeed = (feedData, comment, image) => {
    const [favoriteSeq, setFavoriteSeq] = useState(feedData.feedData.favoriteSeq);
    const [isBookmark, setIsBookmark] = useState(false);
    const [commentList, setCommentList] = useState(feedData.feedData.comments || []);
    const [newComment, setNewComment] = useState("");




    //댓글 저장
    const saveComment = async () => {
        try {
            const data = {
                feed_seq: feedData.feedData.seq,
                id: "test", // login Id
                content: newComment,
            };
            const response = await axios.post("http://localhost:3000/Comments", data);
            setCommentList([...commentList, response.data]);
            setNewComment("");
        } catch (error) {
            console.error(error);
            alert("Failed to save comment");
        }
    };

    const onCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const onSubmitComment = (event) => {
        event.preventDefault();
        alert('#1');
        saveComment();
    };

    //좋아요
    const onClickLike = () => {
        saveLike(feedData.feedData.seq);
    };

    //북마크
    const onClickBookmark = () => {
        saveBookmark(feedData.feedData.seq);
        setIsBookmark(!isBookmark);
    };
    //좋아요
    const saveLike = async (seq) => {
        try {
            const data = {
                feed_seq: seq,
                id: "test", // login Id
            };
            if (favoriteSeq && favoriteSeq > 0) {
                const response = await axios.delete(
                    `http://localhost:3000/${favoriteSeq}/Favorites`
                );
                setFavoriteSeq(0);
            } else {
                const response = await axios.post(
                    `http://localhost:3000/Favorites`,
                    data
                );
                setFavoriteSeq(response.data);
                console.log(response);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save like");
        }
    };
    //북마크
    const saveBookmark = async (seq) => {
        try {
            const body = {
                feed_seq: seq,
                id: "euna_1", // login Id
            };
            const response = await axios.post("http://localhost:3000/Bookmark", body);
        } catch (error) {
            console.error(error);
            alert("Failed to save bookmark");
        }
    };

    return (
        <div>
            <div className="feed-post">
                <img
                    src="feedimages/icon.png"
                    alt="더보기"
                    style={{ width: 30, height: 30 }}
                />

                <div className="post-image">
                    <img src="feedimages/bc.jpg" alt="post" />
                </div>
                <div className="post-header">
                    <button onClick={onClickLike}>
                        <img
                            src={
                                "feedimages/" +
                                (favoriteSeq > 0 ? "likeon.png" : "likeoff.png")
                            }
                            alt="좋아요"
                        />
                    </button>
                    <button type="submit">
                        <img
                            src="feedimages/comment.png"
                            alt="댓글"
                            style={{ width: 50, height: 50 }}
                        />
                    </button>
                    <button onClick={onClickBookmark}>
                        <img
                            src={
                                "feedimages/" +
                                (isBookmark ? "bookmarkon.png" : "bookmarkoff.png")
                            }
                            alt="북마크"
                        />
                    </button>
                </div>
                {/*post-content*/}
                <div className="post-content">
                    <h2 style={{ textAlign: "center" }}>{feedData.feedData.content}</h2>
                </div>

                <div className="post-details">
                    <div className="post-details-left">
                        <p>좋아요 {feedData.feedData.favoriteCount}개</p>
                    </div>
                </div>

                <div className="post-comments">
                    {commentList.map((comment) => (
                        <div key={comment.seq}>
                            <span>{comment.id}</span>
                            <span>{comment.content}</span>
                        </div>
                    ))}

                    <div>
                        <p>{feedData.feedData.comment}</p>
                    </div>

                    <form onSubmit={onSubmitComment}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={onCommentChange}
                            placeholder="댓글달기..."
                        />
                        <button type="submit">게시</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HomeFeed;
