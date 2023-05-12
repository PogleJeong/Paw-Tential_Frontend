import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FollowerListModal from './FollowerListModal';
import FollowingListModal from './FollowingListModal';

const FollowerCount = ({ userId }) => {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowerListModal, setShowFollowerListModal] = useState(false);
  const [showFollowingListModal, setShowFollowingListModal] = useState(false);

  useEffect(() => {
    const fetchFollower = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getFollower', { params: { 'id' : userId } });
        setFollowerCount(response.data);
        console.log(response.data);
        console.log(userId); // 확인용 코드

      } catch (error) {
        console.error('팔로워 수 조회 에러:', error);
      }
    };
    
    fetchFollower();

    const fetchFolloing = async () => {
      try {
        const response = await axios.get('http://localhost:3000/getFollowing', { params: { 'id' : userId } });
        setFollowingCount(response.data);

      } catch (error) {
        console.error('팔로우 수 조회 에러:', error);
      }
    };
    
    fetchFolloing();
  }, [userId]);
  
  const openFollowerListModal = () => {
    setShowFollowerListModal(true);
  };

  const closeFollowerListModal = () => {
    setShowFollowerListModal(false);
  };

  const openFollowingListModal = () => {
    setShowFollowingListModal(true);
  };

  const closeFollowingListModal = () => {
    setShowFollowingListModal(false);
  };

  return (
    <div>
      <span onClick={openFollowerListModal}>팔로워 : {followerCount}</span>
      <span onClick={openFollowingListModal}>팔로잉 : {followingCount}</span>
      {showFollowerListModal && (
        <FollowerListModal userId={userId} closeModal={closeFollowerListModal} />
      )}
      {showFollowingListModal && (
        <FollowingListModal userId={userId} closeModal={closeFollowingListModal} />
      )}
    </div>
  );
};

export default FollowerCount;
