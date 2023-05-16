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
      <ul class="social-data-block d-flex align-items-center justify-content-between list-inline p-0 m-0">
      <li class="text-center ps-3" onClick={openFollowerListModal}  onMouseOver={(e) => (e.target.style.cursor = 'pointer')} >
      <h5>팔로워</h5>
      <p class="mb-0">{followerCount}</p>
       </li>
       <li class="text-center ps-3" onClick={openFollowingListModal} onMouseOver={(e) => (e.target.style.cursor = 'pointer')}>
       <h5>팔로잉</h5>
      <p class="mb-0">{followingCount}</p>
       </li>
                        </ul>

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
