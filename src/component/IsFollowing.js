import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IsFollowing = ({ followerId, followingId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkIsFollowing = async () => {
      try {
        const response = await axios.post('http://localhost:3000/isFollowing', null, {
          params: {
            follower_id: followerId,
            following_id: followingId
          }
        });
        const result = response.data;

        setIsFollowing(result === 'YES');
      } catch (error) {
        console.error('팔로잉 체크 에러:', error);
      }
    };

    checkIsFollowing();
  }, [followerId, followingId]);

  return <div>{isFollowing ? '팔로잉 중입니다.' : '팔로잉 중이 아닙니다.'}</div>;
};

export default IsFollowing;
