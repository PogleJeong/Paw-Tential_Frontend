import React from "react";
import { Link } from "react-router-dom";
import "../styles/Nav.css";

const Nav = () =>{
    return (
        <div className="Nav">
        <label><div>메뉴</div></label>
        <ul>
            <li><Link className="nav-link" to="/login/login">로그인</Link></li>
            <br />
            <li><Link className="nav-link" to="/place/place">포텐플레이스</Link></li>
            <li><Link className="nav-link" to="/">마켓</Link></li>
            <li><Link className="nav-link" to="/">포텐스</Link></li>
            <li><Link className="nav-link" to="/">포텐콘테스트</Link></li>
            <li><Link className="nav-link" to="/">그룹</Link></li>
            <li><Link className="nav-link" to="/myfeed/myfeed">마이피드</Link></li>
            <li><Link className="nav-link" to="/">관리자페이지</Link></li>
        </ul>
    </div>
    )
}
export default Nav;