import React, { useState, useEffect } from "react";
import axios from "axios";
import Session from 'react-session-api';


import AdminSidebar from "../../component/AdminSidebar";
import Data from "./Data";

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
      <div className="admin-page-content">
        <AdminSidebar />
        <Data />
      </div>
    </div>
  );
}

export default AdminMainPage;
