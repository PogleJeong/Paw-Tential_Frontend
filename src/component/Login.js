import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const login = async() => {
    const id = document.getElementById("id").value;
    const password = document.getElementById("password").value;
    const remember = document.getElementById("remember").checked;
    if ( !id ) {
        alert("아이디를 입력해주세요");
        return;
    } 
    if ( !password ) {
        alert("비밀번호를 입력해주세요");
        return;
    }
    remember ? localStorage.setItem("user_id", id) : localStorage.removeItem("user_id");

    await axios.get("http://localhost:3000/login", {params: {
        "id" : id,
        "password" : password,
    }}).then((response) => {

    });
};

/*
const changeRemember = (event) => {
    const isChecked = event.target.checked;
    if (!isChecked) localStorage.removeItem("user_id");
}
*/

export const LoginForm = () => {
    useEffect(()=>{
        const rememberId = localStorage.getItem("user_id");
        if (rememberId) {
            document.getElementById("id").value = rememberId;
            document.getElementById("remember").checked = true;
        }
    },[]);

    return(
        <div>
            <input id="id" type="text" placeholder='아이디를 입력해주세요' required /><br/>
            <input id="password" type="text" placeholder='아이디를 입력해주세요' required /><br/>
            <label><input id="remember" type="checkbox" />id 저장</label>
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