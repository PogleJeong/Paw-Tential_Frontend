import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { useCookies } from "react-cookie";

const FollowButton = ({ userId, isFollowing }) => {
  const [following, setFollowing] = useState(isFollowing);
  const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);

  useEffect(() => {
    const checkIsFollowing = async () => {
      try {
        const response = await axios.post('http://localhost:3000/isFollowing', null, {
          params: {
            follower_id: cookies.USER_ID,
            following_id: userId
          }
        });
        const result = response.data;

        setFollowing(result === 'YES');
      } catch (error) {
        console.error('팔로잉 체크 에러:', error);
      }
    };

    checkIsFollowing();
  }, [cookies.USER_ID, userId]);

  const followUser = async (userId) => {
    try {
      const response = await axios.post('http://localhost:3000/follow', null, {
        params: {
          'follower_id': cookies.USER_ID,
          'following_id': userId
        }
      });


      const result = response.data;
  
      if (result === "YES") {
        console.log("팔로우 성공");
        setFollowing(true); // Set following to true after successfully following
        // Additional actions on successful follow
      } else {
        console.log("팔로우 실패");
        // Additional actions on failed follow
      }
    } catch (error) {
      console.error("팔로우 에러:", error);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const response = await axios.post('http://localhost:3000/unfollow', null,
      { 
        params: {
          'follower_id': cookies.USER_ID,
          'following_id': userId
        }
      });
      console.log('언팔로우 성공:', response.data);
      setFollowing(false); // Set following to false after successfully unfollowing
    } catch (error) {
      console.error('언팔로우 에러:', error);
    }
  };

  const handleFollow = () => {
    if (!following) {
      followUser(userId);
    } else {
      unfollowUser(userId);
    }
  };

  return (
    <Button onClick={handleFollow}>{following ? '팔로잉' : '팔로우'}</Button>
  );
};

export default FollowButton;
