import React, { useState, useEffect } from "react";
import "../styles/FeedPost.css";

const HomeFeed = (feedData, comment, image) => {
  //console.log(feedData.feedData);
  return (
    <div>
      <div className="feed-post">
        <div className="feed-icon">

          <img src="feedimages/icon.png" alt="더보기" />

        </div>
        <img src="feedimages/bc.jpg" alt="post" />
        <img src={feedData.image} alt="post" />

        <div className="post-actions">
          <button>
            <img src="feedimages/likeoff.png" alt="좋아요" />
          </button>
          <button>
            <img src="feedimages/comment.png" alt="댓글" />
          </button>
          <button>
            <img src="feedimages/bookmarkoff.png" alt="북마크" />
          </button>
        </div>

        <div className="post-info">
          <h2 style={{ textAlign: "center" }}>{feedData.feedData.content}</h2>
        </div>
        <div>
        <p>{feedData.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default HomeFeed;