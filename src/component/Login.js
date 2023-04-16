import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import session from "react-session-api";

export const LoginForm = () => {
    const idRef = useRef();
    const pwdRef = useRef();
    const rememberRef = useRef();
    useEffect(()=>{
        const rememberId = localStorage.getItem("user_id");
        if (rememberId) {
            idRef.current.value = rememberId;
            rememberRef.current.checked = true;
        }
    },[]);

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
        remember ? localStorage.setItem("user_id", id) : localStorage.removeItem("user_id");
    
        await axios.post("http://localhost:3000/login", null,{params: {
            "id" : id,
            "password" : password
        }}).then((response) => {
            response = response.data;
            if (!response) {
                alert("회원정보가 없습니다.")
                return;
            }
            alert(response);
            const user = response;
            session.set("user",user);
            console.log("api : ",session.get("user"));
        });
    };
    return(
        <div>
            <input ref={idRef}id="id" type="text" placeholder="아이디를 입력해주세요" required /><br/>
            <input ref={pwdRef} id="password" type="text" placeholder= "비밀번호를 입력해주세요" required /><br/>
            <label><input ref={rememberRef} id="remember" type="checkbox" />id 저장</label>
            <button id="login" onClick={login}>Login!</button><br/>
        </div>
    );
};

const simpleLoginKakao = () => {

};

const simpleLoginNaver = () => {

};

export const SimpleSNSLogin = () => {
    return(
        <div>
            <p>SNS 간편로그인</p>
            <button onClick={null} id="kakao">카카오</button>
            <button onClick={null} id="naver">네이버</button>
        </div>
    );
};

export const LinkToPage = () => {
    return (
        <div>
            <ul>
                <li><Link to="/login/regi">Register</Link></li>
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