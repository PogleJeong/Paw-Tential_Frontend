
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";
import Session from 'react-session-api';
import '../../styles/MyFeed.css';
import { FeedImage } from '../../component/FeedData';
import  MyfeedDropdown_user  from '../../component/MyfeedDropdown_user';
import  MyfeedDropdown_others from '../../component/MyfeedDropdown_others';



const MyFeed = () => {

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedFeed, setLoadedFeed] = useState([]);
  const [isDropdown, setIsDropdown] = useState(false);



  const observer = useRef();
  const lastFeedElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchUserInfo = async () => {
    try {
      const id = Session.get("user");
      const res = await axios.get("http://localhost:3000/userInfo", {params: {id : id}});
      setUserInfo(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeed = async () => {
    try {
      const id = Session.get("user");
      const res = await axios.get("http://localhost:3000/Myfeed", { 
        params: {
          id: id,
          page: pageNumber
        }
      });
      setFeed(prevFeed => {
        return [...prevFeed, ...res.data];
      });
      setHasMore(res.data.length > 0);
    } catch (err) {
      console.log(err);
    }
  };

  

  useEffect(() => {
    fetchUserInfo();
    fetchFeed();
  }, []);

  useEffect(() => {
    // 중복된 피드 항목 제거하기
    const uniqueFeed = feed.filter((item) => !loadedFeed.find((loadedItem) => loadedItem.id === item.id));
    setLoadedFeed(prevLoadedFeed => [...prevLoadedFeed, ...uniqueFeed]);
  }, [feed]);

  useEffect(() => {
    if (!loading && hasMore) {
      fetchFeed();
    }
  }, [pageNumber]);

  return (
    <div className="my-feed-container">
      {userInfo && (
        <div className="profile-card">
          <img
            className="profile-image"
            src={userInfo.profile}
            alt={userInfo.id}
          />
          <div className="profile-info">
            <h1>{userInfo.id}</h1>
            <p className="bio">{userInfo.intro}</p>
            </div>
            {userInfo !== '' &&
            <div className="feed-icon" style={{float:"right"}}>
              <img src="feedimages/icon.png" alt="더보기" onClick={() => setIsDropdown(!isDropdown)}/>
              {Session.get("user") === userInfo.id
              ? isDropdown && <MyfeedDropdown_user id={userInfo.id} />
              : isDropdown && <MyfeedDropdown_others id={userInfo.id} />}
            </div>
          }
          </div>

      )}

      <div className="feed-container">
        {loadedFeed.map((feedData, index) => {
          if (loadedFeed.length === index + 1) {
            return (
              <div
                className="myfeedimg img"
                ref={lastFeedElementRef}
                key={index}
              >
                <FeedImage content={feedData.content} />
              </div>
            );
          } else {
            return (
              <div className="myfeedimg img" key={index}>
                <FeedImage content={feedData.content} />
              </div>
            );
          }
        })}
        {loading && (
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFeed;
