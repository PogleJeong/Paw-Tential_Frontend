import React, { useState, useEffect } from 'react';
import axios from "axios";
import Session from 'react-session-api';

const MyFeed = () => {

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState([]);


  const userData = async () => {
    try {
      const id = Session.get("user");
      const res = await axios.get("http://localhost:3000/userInfo", {
        params: { id },
      });
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
      const res = await axios.get("http://localhost:3000/mainFeed");
      setFeed(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    userData();
    fetchFeed();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userInfo && (
        <h1>{userInfo.id}님의 MYFEED</h1>
      )}
      {feed
        .filter(post => post.user_id === userInfo.id) // 해당 사용자의 피드만 필터링
        .map(post => (
          <div key={post.id}>
            <img src={post.image} alt={post.caption} />
            <p>{post.caption}</p>
          </div>
        ))}
    </div>
  );
  
};

export default MyFeed;
