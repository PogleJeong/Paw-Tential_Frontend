import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar } from 'antd';
import axios from 'axios';

const { Meta } = Card;

const SearchUser = (prop) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    navigate(`/myfeed/myfeed2/${userId}`); // Navigate to the user's MyFeed page
  };

  useEffect(() => {

    if (prop.keyword === '') {
      setUsers([]); // 검색어가 비어있으면 검색 결과 초기화
      return;
    }

    // 검색어가 변경될 때마다 검색을 수행

const userId = prop.keyword;


    fetchUsers(userId);
  }, [prop.keyword]);

  const fetchUsers = async (userId) => {

    try {
      const response = await axios.get('http://localhost:3000/userList', {
        params: { search: userId }
      });
      console.log(response.data.list);
      const filteredUsers = response.data.list.filter((user) =>

        user.id.includes(userId)
      );

      const usersWithProfile = await Promise.all(
        filteredUsers.map(async (user) => {
          const userInfo = await fetchUserInfo(user.id);
          return {
            ...user,
            profile: userInfo.profile
          };
        })
      );

      setUsers(usersWithProfile);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserInfo = async (userId) => {
    try {
      const res = await axios.get('http://localhost:3000/userInfo', {
        params: { id: userId }
      });
      if (res.data.profile) {
        const profilePicturePath = `http://localhost:3000/${res.data.profile}`;
        return { profile: profilePicturePath };
      } else {
        return { profile: 'default-profile-picture.png' };
      }
    } catch (err) {
      console.log(err);
      return { profile: 'default-profile-picture.png' };
    }
  };

  return (
    <div>
      {users.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          {users.map((user) => (
            <Card
              key={user.id}
              style={{ width: 193, display: 'inline-block', marginTop: 10, cursor: 'pointer' }}
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
