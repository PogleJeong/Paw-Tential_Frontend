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

  // 메인 - 모든 피드 불러오기
  const getAllFeed = async () => {
    axios.get("http://localhost:3000/home/allFeed")
    .then(function(res){
      setFeeds(res.data.feedList);
      console.log(res.data);
    })
    .catch(function(err){
      alert(err);
    })
  }

  useEffect(() => {
    saveCookie();
    fetchFeeds();
  }, []);

  return (
    <>
    <CreateFeedModal show={createFeedModal}
                                        onHide={()=>{setCreateFeedModal(false)}}/>
    <div id="content-page" className="content-page">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 row m-0 p-0">
            <div className="col-sm-12">
              <div id="post-modal-data" className="card card-block card-stretch card-height">
                <div className="card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h4 className="card-title">CREATE POST</h4>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="user-img">
                    {/* // TO-DO 유저 프로필 사진 넣어주세요 */}
                      <img src="/assets/images/user/1.jpg" alt="userImg" className="avatar-60 rounded-circle" />
                    </div>
                    <form className="post-text ms-3 w-100" data-bs-target="#post-modal">
                      <input type="text"
                                  style={{border:'none'}}
                                  className="form-control rounded"
                                  size="50"
                                  onKeyDown={()=>{setCreateFeedModal(true)}}
                                  onClick={()=>{setCreateFeedModal(true)}}
                                  placeholder={`${userId}님, 반려동물과 함께 하는 일상을 그려보세요.`}
                        />
                    </form>
                  </div>
                  <hr />
                </div> {/* end of card-body */}
              </div>
            </div> {/* end of col-sm-12 */}
            {feeds && feeds.length > 0 ? (
              feeds.map((feed) => (
                <MainFeed feedData={feed} />
              ))
            ) : <p>표시할 피드가 없습니다.</p>
            }
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;