import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users');
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const handleBlockUser = async (userId) => {
    try {
      await axios.put(`/api/users/${userId}/block`);
      setUsers(users.map((user) => user.id === userId ? { ...user, status: 1 } : user));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      await axios.put(`/api/users/${userId}/unblock`);
      setUsers(users.map((user) => user.id === userId ? { ...user, status: 0 } : user));
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>관리자 페이지</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>닉네임</th>
            <th>이메일</th>
            <th>전화번호</th>
            <th>가입일</th>
            <th>상태</th>
            <th>차단/해제</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nickname}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{new Date(user.regiDate).toLocaleDateString()}</td>
              <td>{user.status === 0 ? '정상' : '정지'}</td>
              <td>
                {user.status === 0 ?
                  <button onClick={() => handleBlockUser(user.id)}>차단</button> :
                  <button onClick={() => handleUnblockUser(user.id)}>해제</button>
                }
              </td>
              <td><button onClick={() => handleDeleteUser(user.id)}>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/">돌아가기</Link>
    </div>
  );
};

export default Admin;