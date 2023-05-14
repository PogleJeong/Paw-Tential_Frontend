import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, List, Input } from 'antd';
import FollowButton from './FollowButton';
import { useCookies } from "react-cookie";

const FollowerListModal = ({ userId, closeModal }) => {
  const [followerList, setFollowerList] = useState([]);
  const [filteredFollowerList, setFilteredFollowerList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [cookies] = useCookies(["USER_ID"]);

  useEffect(() => {
    const fetchFollowerList = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/followerList?id=${userId}`, { params: { 'following_id': userId } });
        setFollowerList(response.data);
      } catch (error) {
        console.error('팔로워 리스트 조회 에러:', error);
      }
    };

    fetchFollowerList();
  }, [userId]);

  useEffect(() => {
    const filteredList = followerList.filter(item => item.includes(searchText));
    setFilteredFollowerList(filteredList);
  }, [followerList, searchText]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const checkIsFollowing = async (followerId) => {
    try {
      const response = await axios.post('http://localhost:3000/isFollowing', null, {
        params: {
          follower_id: followerId,
          following_id: cookies.USER_ID
        }
      });
      const result = response.data;
      return result === 'YES';
    } catch (error) {
      console.error('팔로잉 체크 에러:', error);
      return false;
    }
  };

  return (
    <Modal
      title="팔로워 리스트"
      visible={true}
      onCancel={closeModal}
      footer={null}
    >
      <Input.Search placeholder="아이디 검색" value={searchText} onChange={handleSearch} />

      <List
        dataSource={filteredFollowerList}
        renderItem={(item) => (
          <List.Item>
            <span>{item}</span>
            {cookies.USER_ID !== item && (
              <FollowButton userId={item} isFollowing={checkIsFollowing(item)} />
            )}
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default FollowerListModal;
