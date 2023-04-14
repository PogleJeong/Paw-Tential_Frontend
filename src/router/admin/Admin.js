import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../../component/AdminHeader";
import AdminSidebar from "../../component/AdminSidebar";
import AdminDashboard from "../../component/AdminDashboard";




function AdminMainPage() {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

    const userData = async(id) =>{
        axios.get("http://localhost:3000/userInfo", {params : {'id':id}})
        
        .then(function(res){
            setUserInfo(res.data);
            setLoading(false);
        })
        .catch(function(err){
            console.log(err);

        });


    }

    useEffect(() => {
        userData('','');
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
      </div>
    </div>
  );
}

export default AdminMainPage;
