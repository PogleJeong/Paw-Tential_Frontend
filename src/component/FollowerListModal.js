import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, List, Input } from 'antd';

const FollowerListModal = ({ userId, closeModal }) => {
  const [followerList, setFollowerList] = useState([]);
  const [filteredFollowerList, setFilteredFollowerList] = useState([]);
  const [searchText, setSearchText] = useState('');

  console.log(userId);

  useEffect(() => {
    const fetchFollowerList = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/followerList?id=${userId}`, { params: { 'following_id': userId } });
        setFollowerList(response.data);
        console.log(response.data);
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
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default FollowerListModal;
