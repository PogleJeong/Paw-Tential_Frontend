import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../styles/Nav.css";

const Logout = () => {
    const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID"]);
    const logout = () => {
        // 쿠키가 존재해야 지울 수 있음.
        if (cookies.USER_ID) {
            removeCookies("USER_ID");
            removeCookies("USER_NICKNAME");
        }
    }
    return(
        <li onClick={logout}><Link to="/login">로그아웃</Link></li>
    );
}

const Nav = () =>{
    const [ loginState, setLoginState ] = useState(false);
    const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID"]);
    useEffect(()=>{
        cookies.USER_ID ? setLoginState(true) : setLoginState(false)
    },[cookies.USER_ID]);

    return (
        <div className="Nav">
        <label><div>메뉴</div></label>
        <ul>
            {loginState ? 
            <Logout />
            : 
            <li><Link className="nav-link" to="/login">로그인</Link></li> 
            }
            <br />
            <li><Link className="nav-link" to="/place">포텐플레이스</Link></li>
            <li><Link className="nav-link" to="/market">마켓</Link></li>
            <li><Link className="nav-link" to="/pawtens">포텐스</Link></li>
            <li><Link className="nav-link" to="/contest">포텐콘테스트</Link></li>
            <li><Link className="nav-link" to="/group/newsfeed">그룹</Link></li>
            <li><Link className="nav-link" to="/myfeed/myfeed">프로필</Link></li>
            <br/><br/>
            <li><Link className="nav-link" to="/admin/admin" target="_blank">관리자페이지</Link></li>
        </ul>
    </div>
    )
}
export default Nav;