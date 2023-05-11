import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/FeedPost.css";
import MainFeed from "../../component/MainFeed";

import CreateFeedModal from './modals/CreateFeedModal';
import ReactHtmlParser from "react-html-parser";

const Home = () => {

  const [createFeedModal, setCreateFeedModal] = useState(false);
  const [feeds, setFeeds] = useState([]);

  // 사용자 임시 ID
  const userId = 'test';

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
    getAllFeed();
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