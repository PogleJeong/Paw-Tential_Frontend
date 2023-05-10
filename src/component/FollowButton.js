import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import { useCookies } from "react-cookie";


const FollowButton = ({ userId, isFollowing }) => {
  const [following, setFollowing] = useState(isFollowing);
  const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);


  const followUser = async (userId) => {
    try {
      const response = await axios.post('http://localhost:3000/follow', null, {
        params: {
          'follower_id': cookies.USER_ID,
          'following_id': userId // 팔로우할 사용자의 ID를 설정
        }
      });
      const result = response.data; // 팔로우 결과를 받아옴
  
      if (result === "YES") {
        console.log("팔로우 성공");
        // 팔로우 성공한 경우 추가 작업 수행
      } else {
        console.log("팔로우 실패");
        // 팔로우 실패한 경우 추가 작업 수행
      }
    } catch (error) {
      console.error("팔로우 에러:", error);
    }
  };

  const unfollowUser = async (userId) => {
    try {
      const response = await axios.post('/api/unfollow', { userId });
      console.log('언팔로우 성공:', response.data);
    } catch (error) {
      console.error('언팔로우 에러:', error);
    }
  };

  const handleFollow = () => {
    if (!following) {
      followUser(userId);
      setFollowing(true);
    } else {
      unfollowUser(userId);
      setFollowing(false);
    }
  };

  return (
    <Button onClick={handleFollow}>{following ? '팔로잉' : '팔로우'}</Button>
  );
};

export default FollowButton;
