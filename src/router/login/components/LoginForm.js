import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useCookies } from "react-cookie";
import { styled } from 'styled-components';

import "https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js";

const LoginLabel = styled.span`
    display: inline-block;
    width: 60px;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 5px;
    text-align: center;
    font-weight: bold;
`;

const LoginInputBox = styled.input.attrs({required: true})`
    width: 300px;
    padding: 10px;
    padding-bottom: 5px;
    margin: 5px;
    border: none;
    border-bottom: 2px solid black;
    font-size: 15px;
`

const LoginBtn = styled.button`
    margin: 10px;
    width: 200px;
    height: 40px;
    background-color: tomato;
    border-style: none;

`;

const LoginForm = () => {
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
        <>
            <LoginLabel>아이디</LoginLabel>
            <LoginInputBox ref={idRef}id="id" type="text" placeholder="아이디를 입력해주세요" /><br/>
            <LoginLabel>비밀번호</LoginLabel>
            <LoginInputBox ref={pwdRef} type="password" placeholder= "비밀번호를 입력해주세요" /><br/>
            <LoginBtn onClick={login}>Login!</LoginBtn><br/>
            <label><input ref={rememberRef} type="checkbox" />id 저장</label>
        </>
    );
};

export default LoginForm;