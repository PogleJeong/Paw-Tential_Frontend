import { useState, useRef } from 'react';
import axios from 'axios';
import PetRegi from './PetRegi';

let userInfo;

const useInput = (initialValue, validator, valid) => {
    const [ value, setValue ] = useState(initialValue);

    const onChange = (event) => {
        const value = event.currentTarget.value;
        let willUpdate = true;
        if (typeof validator === "function") {
            willUpdate = validator(value, valid);
            if (willUpdate) {
                setValue(value);
            }
        }
    }
    return { value, onChange };
}

const maxLen = (value, valid) => value.length <= valid;

const RegisterForm = () => {
    const [ idSuccess ,setIdSuccess ] = useState(false);
    const [ passwordSuccess, setPasswordSuccess ] = useState(false);
    const [ nickSuccess, setNickSuccess ] = useState(false);
    const [ next, setNext ] = useState(false);
    
    const [ radioValue, setRadioValue ] = useState("");
    const id = useInput("", maxLen, 15);
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
        const password = passwordRef.current.value;
        const email = emailRef.current.value;
        const nick = nickRef.current.value;
        const number = numberRef.current.value;
        const birth = birthRef.current.value;
        const gender = radioValue;
        if (!id.value) {
            alert("아이디가 입력되지 않았습니다.");
            return;
        }
        if (!password) {
            alert("비밀번호가 입력되지 않았습니다.");
            passwordRef.focus();
            return;
        }
        if (password.length < 8) {
            alert("비밀번호는 최소 8자 이상이어야합니다.");
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
        userInfo = {id: id.value, password, email, nick, number, birth, gender};
        setNext(true);
    }

    const checkId = async() => {
        
        await axios.post("http://localhost:3000/idCheck", null, {params: {id: id.value}})
        .then((response) => {
            console.log("ID Check >> ", response.data);
            if (response.status === 200){
                if (response.data === "exist") {
                    idCheckMsgRef.current.innerText = "이미존재하는 아이디입니다.";
                    setIdSuccess(false);
                    return;
                };
                if (response.data === "notExist") {
                    idCheckMsgRef.current.innerText = "사용가능한 아이디입니다.";
                    setIdSuccess(true);
                    return;
                };
            }
        });
    };

    const checkNickname =  async() => {
        const nickname = nickRef.current.value;

        await axios.post("http://localhost:3000/nicknameCheck", null, {params: {nickname}})
        .then((response) => {
            console.log("Nick Name Check >> ", response.data);
            if (response.status === 200) {
                if (response.data === "exist") {
                    nickCheckMsgRef.current.innerText = "이미존재하는 닉네임입니다.";
                    setNickSuccess(false);
                    return;
                };
                if (response.data === "notExist") {
                    nickCheckMsgRef.current.innerText = "사용가능한 닉네임입니다.";
                    setNickSuccess(true);
                    return;
                };
            }
        });
    };

    const changePassword = () => {
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

    return(
        <div>
            <label>아이디<input {...id} placeholder='최대 15자 까지 가능합니다.' required/></label>
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
                    <input type="radio" name="gender" value="남자" onChange={()=>setRadioValue(0)} />
                    <label>남자</label>
                    <input type="radio" name="gender" value="여자" onChange={()=>setRadioValue(1)} />
                    <label>여자</label>
                </div>
            </label>
            <button onClick={nextPage}>회원등록</button>
            { next ? <PetRegi userInfo={userInfo}/> : null }
        </div>
    );
};

export default RegisterForm;