import React, { useState, useEffect } from "react";
import axios from "axios";
import Session from 'react-session-api';

import AdminHeader from "../../component/AdminHeader";
import AdminSidebar from "../../component/AdminSidebar";
import AdminDashboard from "../../component/AdminDashboard";

function AdminMainPage() {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const userData = async () => {
    try {
      const id = Session.get("user");
      const res = await axios.get("http://localhost:3000/userInfo", {
        params: { id },
      });
      setUserInfo(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-page">
      <AdminHeader userInfo={userInfo} />
      <div className="admin-page-content">
        <AdminSidebar />
        <AdminDashboard />
        <p>대시보드는 회원, 신고, 문의, 데이터 미리보기 4분할</p>
      </div>
    </div>
  );
}

export default AdminMainPage;
