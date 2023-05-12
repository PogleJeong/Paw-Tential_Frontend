import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, List, Input } from 'antd';
import { useCookies } from "react-cookie";


const FollowingListModal = ({ userId, closeModal }) => {
  const [followingList, setFollowingList] = useState([]);
  const [filteredFollowingList, setFilteredFollowingList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [cookies] = useCookies(["USER_ID","USER_NICKNAME"]);

  useEffect(() => {
    const fetchFollowingList = async () => {
      try {
        const response = await axios.get('http://localhost:3000/followingList', { params: { 'id': userId } });
        setFollowingList(response.data);
      } catch (error) {
        console.error('팔로잉 리스트 조회 에러:', error);
      }
    };

    fetchFollowingList();
  }, [userId]);

  useEffect(() => {
    const filteredList = followingList.filter(item => item.includes(searchText));
    setFilteredFollowingList(filteredList);
  }, [followingList, searchText]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Modal
      title="팔로잉 리스트"
      visible={true}
      onCancel={closeModal}
      footer={null}
    >
      <Input.Search placeholder="아이디 검색" value={searchText} onChange={handleSearch} />

      <List
        dataSource={filteredFollowingList}
        renderItem={(item) => (
          <List.Item>
            <span>{item}</span>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default FollowingListModal;
