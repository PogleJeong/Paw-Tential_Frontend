import React, { useState, useEffect } from "react";
import "../styles/FeedPost.css";
import axios from "axios";

const HomeFeed = (feedData, comment, image) => {
  const [isLike, setIsLike] = useState(false);
  //console.log(feedData.feedData);
  const onClickLike = () =>{
    saveLike(feedData.feedData.seq);
    setIsLike(!isLike);
  }

  const saveLike = async (seq) => {
    try {
      const body = {
        feed_seq : seq,
        id : 'ms_1' // login Id
      }
      if(!isLike){
        const response = await axios.post(`http://localhost:3000/Favorites`,body);
      }else{
        const response = await axios.delete(`http://localhost:3000/Favorites`,body);
      }

    } catch (error) {
      console.error(error);
      alert("화내지말기");
    }
  };
  return (
    <div>
      <div className="feed-post">
        <div className="feed-icon">

          <img src="feedimages/icon.png" alt="더보기" />

        </div>
        <img src="feedimages/bc.jpg" alt="post" />
        {/*<img src={feedData.image} alt="post" />*/}

        <div className="post-actions">
          <button onClick={onClickLike}>
            <img src={"feedimages/"+(isLike?"likeon.png" : "likeoff.png")} alt="좋아요" />
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