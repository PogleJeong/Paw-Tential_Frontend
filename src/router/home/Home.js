import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../../styles/FeedPost.css";
import MainFeed from "../../component/MainFeed";

import CreateFeedModal from './modals/CreateFeedModal';
import ReactHtmlParser from "react-html-parser";

const Home = () => {
  const [createFeedModal, setCreateFeedModal] = useState(false);

  const [feeds, setFeeds] = useState([]);
  const [comments, setComments] = useState([]);
  const [images, setImages] = useState([]);
  
  // SNS-login - 정은성
  const [ searchParams, setSearchParams ] = useSearchParams(); 
  const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID","USER_NICKNAME"]);
  
  /** 소셜로그인시 유저정보를 쿠키에 저장 */
  const saveCookie = async() => {

    // 만약 소셜로그인을 통했을 시, url 에 search 가 존재
    const USER_ID = searchParams.get("USER_ID");
    const USER_NICKNAME = searchParams.get("USER_NICKNAME");
    console.log(USER_ID, USER_NICKNAME);
    if (USER_ID) {
      setCookies("USER_ID", USER_ID, {path:"/", maxAge: 3600});
      setCookies("USER_NICKNAME", USER_NICKNAME, {path:"/", maxAge: 3600});
    }
  }


//content
  const fetchFeeds = async () => {
    try {
      const response = await axios.get("http://localhost:3000/mainFeed");
      setFeeds(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch feeds");
    }
  };

//comment
  const fetchComments = async (seq) => {
    try {
      const response = await axios.get(`http://localhost:3000/${seq}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch comments");
    }
  };

  useEffect(() => {
    saveCookie();
    fetchFeeds();
  }, []);

  return (
    <div>
      <p style={{ textAlign: "center" }}>Welcome to faw-tential</p>
      <div style={{ width: "600px", display: "grid" }}>
        <CreateFeedModal show={createFeedModal}
                                              onHide={()=>{setCreateFeedModal(false)}} />
        <input readOnly style={{border:'none'}} className="my-3 py-3" type="text" size="50" onClick={()=>{setCreateFeedModal(true)}} placeholder="무슨 일이 일어나고 있나요?" />

        {feeds &&
          feeds.length > 0 &&
          feeds.map((feed, index) => (
            <MainFeed key={index} feedData={feed} />
          ))}
      </div>
    </div>
  );
};

export default Home;