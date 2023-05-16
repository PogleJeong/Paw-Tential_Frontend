import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";
import { useCookies } from "react-cookie";
import { useParams } from 'react-router-dom';
import '../../styles/MyFeed.css';
import { FeedImage } from '../../component/FeedData';


import ProfileCard from '../../component/ProfileCard';

const MyFeed2 = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedFeed, setLoadedFeed] = useState([]);

  const { userId } = useParams();
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
      const res = await axios.get("http://localhost:3000/userInfo", {params: {id : userId}});
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
      const res = await axios.get("http://localhost:3000/Myfeed", { 
        params: {
          id: userId,
          page: pageNumber
        }
      });
      setFeed(prevFeed => [...prevFeed, ...res.data]);
      setHasMore(res.data.length > 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchFeed();
  }, [userId]);

  useEffect(() => {
    const uniqueFeed = feed.filter(item => !loadedFeed.find(loadedItem => loadedItem.id === item.id));
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
        <>
          <ProfileCard userInfo={userInfo} isCurrentUser={true} />

          </>
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
  
  export default MyFeed2;
  
