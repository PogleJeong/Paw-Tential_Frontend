import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Session from "react-session-api"
import { useCookies } from "react-cookie";
import { FeedImage, FeedContent } from "./FeedData";
import { FeedDropdown_user, FeedDropdown_writer } from "./FeedDropdown";

const MainFeed = (feedData) => {
  const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
  const [isLike, setIsLike] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);
  const dropMenuRef = useRef(null);

  useEffect(()=>{

  }, []);

  const onClickLike = () =>{
    saveLike(feedData.feedData.seq);
    setIsLike(!isLike);
  }

  const saveLike = async (seq) => {
    try {
      const body = {
        "feed_seq" : seq,
        "id" : cookies.USER_ID // login Id
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

  // useRef current에 담긴 엘리먼트 외부 영역 클릭 시 dropdown 메뉴 닫힘
  // useEffect(() => {
  //   const handleOutsideClose = (e) => {
  //     if(isDropdown && (!dropMenuRef.current.contains(e.target))) setIsDropdown(false);
  //   };
  //   document.addEventListener('click', handleOutsideClose);
    
  //   return () => document.removeEventListener('click', handleOutsideClose);
  // }, [isDropdown]);

  return (
    <div>
      <div className="feed-post" ref={dropMenuRef}>

        <div>
          <div className="feed-icon" style={{float:"left"}}>
            <img src={"../feedimages/"+ feedData.feedData.profile +".png"} alt="프로필" />
          </div>
          {cookies.USER_ID !== '' &&
            <div className="feed-icon" style={{float:"left"}}>
              <img src="../feedimages/icon.png" alt="더보기" onClick={() => setIsDropdown(!isDropdown)}/>
              {cookies.USER_ID === feedData.feedData.id
              ? isDropdown && <FeedDropdown_writer seq={feedData.feedData.seq} />
              : isDropdown && <FeedDropdown_user seq={feedData.feedData.seq} />}
            </div>
          }
        </div>

        <FeedImage content={feedData.feedData.content} />

        <div className="post-actions">
          <button onClick={onClickLike}>
            <img src={"../feedimages/"+(isLike?"likeon.png" : "likeoff.png")} alt="좋아요" />
          </button>
          <button>
            <img src="../feedimages/comment.png" alt="댓글" />
          </button>
          <button>
            <img src="../feedimages/bookmarkoff.png" alt="북마크" />
          </button>
        </div>

        <div className="post-info">
          <FeedContent content={feedData.feedData.content} />
        </div>

        <hr/>
        <div className="feed-comment">
          <p>댓글란</p>
        </div>

      </div>
    </div>
  );
};

export default MainFeed;