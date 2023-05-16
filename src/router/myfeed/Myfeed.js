
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from "axios";
import { useCookies } from "react-cookie";
import { AiFillHome} from "react-icons/ai"; 
import { BiBookmark } from "react-icons/bi";
import { FiMinus } from 'react-icons/fi';
import '../../styles/MyFeed.css';
import { FeedImage } from '../../component/FeedData';

import ProfileCard from '../../component/ProfileCard';



const Myfeed = () => {

  const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
  const [userInfo, setUserInfo] = useState(null);
  const [bookmarkFeeds, setBookmarkFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadedFeed, setLoadedFeed] = useState([]);




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
      const res = await axios.get("http://localhost:3000/userInfo", {params: {id : cookies.USER_ID}});
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
          id: cookies.USER_ID,
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

  const fetchBookmarkFeeds = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getBookmark", {
        params: {
          id: cookies.USER_ID,
        },
      });
      setBookmarkFeeds(response.data);
    } catch (error) {
      console.error("Error fetching bookmark feeds:", error);
    }
  };

  


  useEffect(() => {
    fetchUserInfo();
    fetchFeed();
    fetchBookmarkFeeds(); 
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
  
  const handleBookmarkClick = () => {
    setFeed(bookmarkFeeds);
    setLoadedFeed(bookmarkFeeds);
    setPageNumber(1);
    setHasMore(false); 
  };
  

  const handleHomemarkClick = () => {
    setFeed([]);
    setLoadedFeed([]);
    setPageNumber(1);
    setHasMore(true); 
    fetchFeed(); 
  };
  
  
  

  return (
    <div className="container mt-3">
      {userInfo && (
        <>
          <ProfileCard userInfo={userInfo} isCurrentUser={true} />
        </>
      )}
  
      <div className="feed-container">
      <div className="feed-categories">
      <div className="feed-category">
  {/* 홈 아이콘 (마이피드) */}
  <div className="category-icon" onMouseOver={(e) => (e.target.style.cursor = 'pointer')} onClick={handleHomemarkClick}>
  <AiFillHome size={40} />
</div>
</div>
<div className="feed-category-divider">
  <div className="divider-line"></div>
</div>

<div className="feed-category">
  {/* 북마크 아이콘 (북마크 피드) */}
  <div
    className="category-icon"
    onMouseOver={(e) => (e.target.style.cursor = 'pointer')}
    onClick={handleBookmarkClick}
  >
    <BiBookmark size={40} />
  </div>
</div>
</div>

  
<div className="myfeedimg-container">
    {loadedFeed.map((feedData, index) => {
      if (loadedFeed.length === index + 1) {
        return (
          <div className="myfeedimg img" ref={lastFeedElementRef} key={index}>
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
  </div>

  {loading && (
    <div className="loading-container">
      <div className="loader"></div>
    </div>
  )}
</div>
    </div>
  );
  
};

export default Myfeed;
