import { useState, useRef } from 'react';
import axios from 'axios';


const RegisterForm = () => {
    const [ idSuccess ,setIdSuccess ] = useState(false);
    const [ passwordSuccess, setPasswordSuccess ] = useState(false);
    const [ nickSuccess, setNickSuccess ] = useState(false);

    const [ radioValue, setRadioValue ] = useState("man");
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
    
    const register = async() => {
        const id = idRef.current.value;
        const password = passwordRef.current.value;
        const email = emailRef.current.value;
        const nick = nickRef.current.value;
        const number = numberRef.current.value;
        const birth = birth.current.value;

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
        await axios.post("http://localhost:3000/register", null, {params: {
            id, password, email, nick, number, birth, gender: radioValue}})
        .then((response) => {
            response = JSON.stringify(response.data);
            if (response) {
                alert("회원등록이 완료되었습니다.");
            }
            //window.location.href="http://localhost:3000/home";
        });
    }

    const checkId = async() => {
        const id = idRef.current.value;
        
        await axios.post("http://localhost:3000/idCheck", null, {params: {id}})
        .then((response) => {
            response = JSON.stringify(response.data);
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
            response = JSON.stringify(response.data);
            if (response === "exist") {
                nickCheckMsgRef.current.innerText = "이미존재하는 아이디입니다.";
                setNickSuccess(false);
            } else {
                nickCheckMsgRef.current.innerText = "사용가능한 아이디입니다.";
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

    const chagneRadio = (event) =>{
        console.log(event.target.value);
        if (event.target.checked) {
            setRadioValue(event.target.value);
        }
    }
    return(
        <div>
            <label>아이디<input id="id" type="text" required/></label>
            <button ref={idRef} onClick={checkId}>중복확인</button><br/>
            <small ref={idCheckMsgRef}></small><br/>
            <label>비밀번호<input ref={passwordRef} id="password" type="password" required/></label><br/>
            <label>비밀번호 확인<input ref={confirmRef} id="confirm" type="password" onChange={changePassword} required/></label><br/>
            <small ref={pwdCheckMsgRef}></small><br/>
            <label>이메일<input ref={emailRef} id="email" type="email" required /></label><br/>
            <label>닉네임<input ref={nickRef} id="nickname" type="text" required /></label> <br/>
            <button onClick={checkNickname}>중복확인</button>
            <small ref={nickCheckMsgRef}></small>
           
            <label>전화번호<input ref={numberRef} id="number" type="text" required /></label><br/>
            <label>생년월일<input ref={birthRef} id="birth" type="text" required /></label><br/>
            <label>
                성별
                <div>
                    <input type="radio" name="gender" value="0" onChange={chagneRadio} />
                    <label>남자</label>
                    <input type="radio" name="gender" value="1" onChange={chagneRadio} />
                    <label>여자</label>
                </div>
            </label>
            <button onClick={register}>회원등록</button>
        </div>
    );
};

export default RegisterForm;