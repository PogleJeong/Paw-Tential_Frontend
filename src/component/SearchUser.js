import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Card, Avatar } from 'antd';
import axios from 'axios';

const { Meta } = Card;

const SearchUser = () => {
  const [searchText, setSearchText] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleUserClick = (userId) => {
    navigate(`/myfeed/myfeed2/${userId}`); // Navigate to the user's MyFeed page
  };

  useEffect(() => {
    if (searchText === '') {
      setUsers([]); // Reset the search results if the search text is empty
      return;
    }

    // Perform the search when the search text changes
    const userId = searchText.trim();
    fetchUsers(userId);
  }, [searchText]);

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
      <Input.Search
        placeholder="Search by username"
        value={searchText}
        onChange={handleSearch}
      />

      {users.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          {users.map((user) => (
            <Card
  key={user.id}
  style={{ width: 200, display: 'inline-block', margin: '10px', cursor: 'pointer' }}
  cover={<img alt="Profile" src={user.profile} />}
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
