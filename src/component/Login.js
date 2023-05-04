import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useCookies } from "react-cookie";

import "https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js";

import kakao from "../image/kakao_login_icon.png";
import naver from "../image/btnG_naver.png";

export const LoginForm = () => {
    const [ cookies, setCookies, removeCookies] = useCookies(["id", "nickname"]);
    const idRef = useRef();
    const pwdRef = useRef();
    const rememberRef = useRef();
    const navigate = useNavigate();

    useEffect(()=>{
        const rememberId = localStorage.getItem("USER_ID");
        if (rememberId) {
            idRef.current.value = rememberId;
            rememberRef.current.checked = true;
        }
    },[]);

    //  아이디 저장기능 + 로그인 기능
    const login = async() => {
        const id = idRef.current.value;
        const password = pwdRef.current.value;
        const remember = rememberRef.current.checked;
        if ( !id ) {
            alert("아이디를 입력해주세요");
            return;
        } 
        if ( !password ) {
            alert("비밀번호를 입력해주세요");
            return;
        }
        remember ? localStorage.setItem("USER_ID", id) : localStorage.removeItem("USER_ID");
    
        await axios.post("http://localhost:3000/login", null,{params: {
            "id" : id,
            "password" : password
        }}).then((response) => {
            if (response.status === 200) {
                const state = response.data.state;
                if (state === "LOGIN_NOT_FOUND_ID") {
                    alert("입력하신 ID 가 존재하지 않습니다.");
                    return;
                }
                if (state === "LOGIN_NOT_MATCH_PASSWORD") {
                    alert("비밀번호가 일치하지 않습니다.");
                    return
                }
                const loginUser = response.data.USER_ID;
                const loginUserNickname = response.data.USER_NICKNAME;
                setCookies("USER_ID", loginUser, {path:"/", maxAge: 3600});
                setCookies("USER_NICKNAME", loginUserNickname, {path:"/", maxAge: 3600});
                navigate("/");
                return;
            }
        });
    };
    return(
        <div>
            <input ref={idRef}id="id" type="text" placeholder="아이디를 입력해주세요" required /><br/>
            <input ref={pwdRef} id="password" type="password" placeholder= "비밀번호를 입력해주세요" required /><br/>
            <label><input ref={rememberRef} id="remember" type="checkbox" />id 저장</label>
            <button id="login" onClick={login}>Login!</button><br/>
        </div>
    );
};


export const SimpleSNSLogin = () => {
    const navigate = useNavigate();
    // 카카오 로그인
    // AUTH_URL 으로 이동하면 KAKAO 로그인창이 뜨고, 로그인창에서 ID, PASSWORD 를 입력하고 로그인하면 AUTH(인가)를 얻는다.
    // 로그인후 REDIRECT_URI 로 이동됨.
    const simpleLoginKakao = () => {
        const REST_API_KEY = "83e8bb6f53c1f3fcc8901a9678d3eaa3";
        const REDIRECT_URI = "http://localhost:3000/kakaoAuth";
        const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        navigate(KAKAO_AUTH_URL);
    };

    const simpleLoginNaver = () => {
        const CLIENT_ID = "UP1Ll7qeXuqAoC6oqcxk";
        const STATE_STRING = "1234ABCD";
        const CALLBACK_URL = "http://localhost:3000/naverAuth";
        const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&state=${STATE_STRING}&redirect_uri=${CALLBACK_URL}`
        window.location.href = NAVER_AUTH_URL;
    };
    return(
        <div>
            <p>SNS 간편로그인</p>
            <input type="button" onClick={simpleLoginKakao} style={{border: "none", width: "200px", height: "50px", background: `url(${kakao}) no-repeat`, backgroundSize: "cover", padding: "10px", borderRadius: "15px"}}/>
            <input type="button" onClick={simpleLoginNaver} style={{border: "none", width: "200px", height: "50px", background: `url(${naver}) no-repeat`, backgroundSize: "cover", padding: "10px", borderRadius: "15px"}}/>
        </div>
    );
};

export const LinkToPage = () => {
    return (
        <div>
            <ul>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login/findAccount">Find ID / Find PASSWORD</Link></li>
            </ul>
        </div>
    );
}

/*
const changeRemember = (event) => {
    const isChecked = event.target.checked;
    if (!isChecked) localStorage.removeItem("user_id");
}
*/