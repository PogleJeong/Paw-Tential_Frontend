import React from "react";
import "../../styles/FeedPost.css";

function FeedPost() {
    return (
        <div className="feed-post">
            <img src="https://picsum.photos/640/640" alt="post" />
            <div className="post-info">
                <h2>게시물 제목</h2>
                <p>게시물 내용</p>
            </div>
            <div className="post-actions">
                <button>좋아요</button>
                <button>댓글</button>
                <button>공유</button>
            </div>
        </div>
    );
}

export default FeedPost;
