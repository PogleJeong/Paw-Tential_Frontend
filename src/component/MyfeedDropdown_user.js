import React from 'react';
import { Link } from 'react-router-dom';

const MyfeedDropdown_user = ({ id }) => {


  return (
    <>
      <ul style={{ position: "absolute", backgroundColor: "white" }}>
      <Link to={{ pathname: "/myfeed/User_update", state: { userId: id } }} className="nav-link">
        정보 수정
        </Link> 
           <li>문의</li>
      </ul>
    </>
  );
};

export default MyfeedDropdown_user;
