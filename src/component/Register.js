import { useState, useRef } from 'react';
import axios from 'axios';
import PetRegi from './PetRegi';

let userInfo;

const RegisterForm = () => {
    const [ idSuccess ,setIdSuccess ] = useState(false);
    const [ passwordSuccess, setPasswordSuccess ] = useState(false);
    const [ nickSuccess, setNickSuccess ] = useState(false);
    const [ radioValue, setRadioValue ] = useState("");
    const [ next, setNext ] = useState(false);

    const idRef = useRef();
    const passwordRef = useRef();
    const confirmRef = useRef();
    const emailRef = useRef();
    const nickRef = useRef();
    const numberRef = useRef();
    const birthRef = useRef();

    const idCheckMsgRef = useRef();
    const pwdCheckMsgRef = useRef();
    const nickCheckMsgRef = useRef();
    
    const nextPage = async() => {
        const id = idRef.current.value;
        const password = passwordRef.current.value;
        const email = emailRef.current.value;
        const nick = nickRef.current.value;
        const number = numberRef.current.value;
        const birth = birthRef.current.value;
        const gender = radioValue;
        if (!id) {
            alert("아이디가 입력되지 않았습니다.");
            idRef.current.focus();
            return;
        }
        if (!password) {
            alert("비밀번호가 입력되지 않았습니다.");
            passwordRef.focus();
            return;
        }
        if (!email) {
            alert("이메일이 입력되지 않았습니다.");
            emailRef.focus();
            return;
        }
        if (!nick) {
            alert("닉네임이 입력되지 않았습니다.");
            nickRef.focus();
            return;
        }
        if (!number) {
            alert("전화번호가 입력되지 않았습니다.");
            numberRef.focus();
            return;
        }
        if (!birth) {
            alert("생년월일이 입력되지 않았습니다.");
            birthRef.focus();
            return;
        }
        if (gender === "") {
            alert("성별이 입력되지 않았습니다.");
            return;
        }

        if (!idSuccess) {
            alert("아이디 중복을 확인해주세요.");
            idCheckMsgRef.current.focus();
            return;
        }
        if (!passwordSuccess) {
            alert("비밀번호가 일치하지 않습니다.");
            idCheckMsgRef.current.focus();
            return;
        }
        if (!nickSuccess) {
            alert("닉네임 중복을 확인해주세요");
            idCheckMsgRef.current.focus();
            return;
        }
        // 유저정보 입력 후 다음 버튼을 통해 반려동물 정보입력가능
        userInfo = {id, password, email, nick, number, birth, gender};
        setNext(true);
    }

    const checkId = async() => {
        const id = idRef.current.value;
        
        await axios.post("http://localhost:3000/idCheck", null, {params: {id}})
        .then((response) => {
            response = response.data;
            if (response === "exist") {
                idCheckMsgRef.current.innerText = "이미존재하는 아이디입니다.";
                setIdSuccess(false);
            } else {
                idCheckMsgRef.current.innerText = "사용가능한 아이디입니다.";
                setIdSuccess(true);
            }
        });
    };

    const checkNickname =  async() => {
        const nickname = nickRef.current.value;

        await axios.post("http://localhost:3000/nicknameCheck", null, {params: {"nickname": nickname}})
        .then((response) => {
            response = response.data;
            console.log(response);
            if (response === "exist") {
                nickCheckMsgRef.current.innerText = "이미존재하는 닉네임입니다.";
                setNickSuccess(false);
            } else {
                nickCheckMsgRef.current.innerText = "사용가능한 닉네임입니다.";
                setNickSuccess(true);
            }
        });
    };

    const changePassword = (event) => {
        const password = passwordRef.current.value;
        const confirm = confirmRef.current.value;
        if (confirm) {
            if(password === confirm) {
                pwdCheckMsgRef.current.innerText = "비밀번호가 일치합니다.";
                setPasswordSuccess(true);
            } else{
                pwdCheckMsgRef.current.innerText = "비밀번호가 일치하지 않습니다.";
                setPasswordSuccess(false);
            }
        } else {
            pwdCheckMsgRef.current.innerText = "";
        }
    }
    /*
    const chagneRadio = (event) =>{
        if (event.target.checked) {
            setRadioValue(event.target.value);
        }
    }
    */

    console.log(radioValue);
    return(
        <div>
            <label>아이디<input ref={idRef} id="id" type="text" required/></label>
            <button onClick={checkId}>중복확인</button><br/>
            <small ref={idCheckMsgRef}></small><br/>
            <label>비밀번호<input ref={passwordRef} id="password" type="password" required/></label><br/>
            <label>비밀번호 확인<input ref={confirmRef} id="confirm" type="password" onChange={changePassword} required/></label><br/>
            <small ref={pwdCheckMsgRef}></small><br/>
            <label>이메일<input ref={emailRef} id="email" type="email" required /></label><br/>
            <label>닉네임<input ref={nickRef} id="nickname" type="text" required /></label>
            <button onClick={checkNickname}>중복확인</button><br/>
            <small ref={nickCheckMsgRef}></small><br/>
            <div>
                <label>전화번호<input ref={numberRef} id="number" type="text" required /></label><br/>
                <label>생년월일<input ref={birthRef} id="birth" type="text" required /></label><br/>
            </div>
            <label>
                성별
                <div>
                    <input type="radio" name="gender" onChange={()=>setRadioValue(0)} />
                    <label>남자</label>
                    <input type="radio" name="gender" onChange={()=>setRadioValue(1)} />
                    <label>여자</label>
                </div>
            </label>
            <button onClick={nextPage}>회원등록</button>
            { next ? <PetRegi userInfo={userInfo}/> : null }
        </div>
    );
};

export default RegisterForm;