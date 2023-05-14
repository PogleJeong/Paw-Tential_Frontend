import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar } from 'antd';
import axios from 'axios';

const { Meta } = Card;

const SearchUser = (prop) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate(`/myfeed/myfeed2/${userId}`); // 검색된 유저의 MyFeed 페이지로 이동
  };

  useEffect(() => {
    if (prop.keyword === '') {
      setUsers([]); // 검색어가 비어있으면 검색 결과 초기화
      return;
    }

    // 검색어가 변경될 때마다 검색을 수행
    const userId = prop.keyword.trim();
    fetchUsers(userId);
  }, [prop.keyword]);

  const fetchUsers = async (userId) => {
    await axios.get('http://localhost:3000/userList', { params:{ "search": userId } })
    .then(function(res){
      console.log(res.data.list);
      const filteredUsers = res.data.list.filter((user) =>
        user.id.includes(userId)
      );
      setUsers(filteredUsers);
    })
    .catch (function(error) {
      console.log(error);
    })
  }

  return (
    <div>
      {users.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          {users.map((user) => (
            <Card
              key={user.id}
              style={{ width: 200, display: 'inline-block', margin: '10px' }}
              cover={<img alt="프로필 이미지" src={user.profile} />}
              onClick={() => handleUserClick(user.id)}
            >
              <Meta
                avatar={<Avatar src={user.profile} />}
                title={user.id}
                description={user.intro}
              />

            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
