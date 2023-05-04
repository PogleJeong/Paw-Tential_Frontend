import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/** 실시간 입력값 체크 */
const useInput = (initValue, validator, valid) => {
    const [value, setValue] = useState(initValue);  
    const onChange = (event) => {
        const {target: { value }} = event;
        let willUpdate = true;
        if (typeof validator === "function") {
            willUpdate = validator(value, valid);
            if (willUpdate) {
                setValue(value);
            }
        }
        console.log(value);
    }
    return { value, onChange };
}

/** 정규식 체크 함수*/
const checkRegExp = (value, regExp) => {
    return regExp.test(value);
}

const maxLen = (value, valid) => value.length <= valid;

function RegisterPage1() {
    // 입력값 검증
    const id = useInput("", maxLen, 15);
    const password = useInput("", maxLen, 20);
    const email = useInput("",maxLen, 45);
    const nick = useInput("", maxLen, 10);
    const number = useInput("", maxLen, 11);
    const birth = useInput("", maxLen, 8);
    const [ radioValue, setRadioValue ] = useState("male");

    // 입력값 검증
    const idRef = useRef();
    const passwordRef = useRef();
    const confirmRef = useRef();
    const emailRef = useRef();
    const nickRef = useRef();
    const numberRef = useRef();
    const birthRef = useRef();

    // DB 에서 중복검증
    const [ idSuccess ,setIdSuccess ] = useState(false);
    const [ passwordSuccess, setPasswordSuccess ] = useState(false);
    const [ emailSuccess, setEmailSuccess ] = useState(false);
    const [ nickSuccess, setNickSuccess ] = useState(false);

    // 메세지 출력
    const idCheckMsgRef = useRef();
    const pwdRegExpRef = useRef();
    const pwdCheckMsgRef = useRef();
    const emailCheckMsgRef = useRef();
    const nickCheckMsgRef = useRef();

    // 페이지이동
    const navigate = useNavigate();

    useEffect(()=>{
        const { value } = id;
  
        const idRegExp = /^[a-z0-9_-]{6,20}$/; 
        idCheckMsgRef.current.innerText = checkRegExp(value, idRegExp) ? "사용가능한 아이디입니다." : "6~20 자리의 영문자를 포함한 아이디를 입력해주세요.";
    }, [id.value])

    useEffect(()=>{
        const { value } = password;
        const pwdRegExp = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{8,24}/;
     
        pwdRegExpRef.current.innerText = checkRegExp(value, pwdRegExp) ? "사용가능한 비밀번호입니다." : "특수문자를 포함하는 8~24 자리의 비밀번호를 입력해주세요.";
    },[password.value]);

    useEffect(()=>{
        const { value } = email;
        const emailRegRef = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
    
        emailCheckMsgRef.current.innerText = checkRegExp(value, emailRegRef) ? "해당 이메일을 사용할 수 있습니다." : "이메일 형식에 맞지 않습니다.";
    },[email.value])

    useEffect(()=>{
        const { value } = nick;
        const nickRegExp = /^[가-힣a-zA-Z0-9]+$/;
     
        nickCheckMsgRef.current.innerText = checkRegExp(value, nickRegExp) ? null : "영문숫자조합 2~10 글자 가능합니다.";
    },[nick.value])

    /** 사용자 정보 입력후 다음 페이지로 이동 */
    const nextPage = async() => {
        // 입력값
        const id = idRef.current.value;
        const password = passwordRef.current.value;
        const email = emailRef.current.value;
        const nick = nickRef.current.value;
        const number = numberRef.current.value;
        const birth = birthRef.current.value;
        const gender = radioValue;
        
        // 정규식
        const idRegExp = /^[a-z0-9_-]{6,20}$/; 
        const pwdRegExp = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{8,24}/;
        const emailRegExp =  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        const nickRegExp = /^[가-힣a-zA-Z0-9]{2,10}$/;
        // 1. 정보가 모두 입력되었는가
        if (!id) {
            alert("아이디가 입력되지 않았습니다.");
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
        if( birth.length !== 8) {
            alert("생년월일 8자를 입력해주세요");
            return;
        }
        if (!gender) {
            alert("성별이 입력되지 않았습니다.");
            return;
        }

        // 2. 정규식
        if (!checkRegExp(id, idRegExp)) {
            
            alert("아이디를 다시 확인해주세요.");
            return;
        }
        if (!checkRegExp(password, pwdRegExp)){
            alert("비밀번호를 다시 확인해주세요.");
            return;
        }
        if (!checkRegExp(email, emailRegExp)) {
            alert("이메일을 다시 확인해주세요");
        }
        if (!checkRegExp(nick, nickRegExp)) {
            alert("닉네임을 다시 확인해주세요.");
            return;
        }
    
        // 3. 중복체크
        if (!idSuccess) {
            alert("아이디 중복을 확인해주세요.");
            return;
        }

        if(!passwordSuccess) {
            alert("비밀번호를 확인해주세요!");
            return;
        }

        if (!emailSuccess) {
            alert("이메일을 중복을 확인해주세요!")
            return;
        }

        if (!nickSuccess) {
            alert("닉네임 중복을 확인해주세요!");
            return;
        }
        // 유저정보 입력 후 다음 버튼을 통해 반려동물 정보입력가능
        const userInfo = {id, password, email, nick, number, birth, gender: gender === "female" ? 0 : 1};
        
        // useNavigator 으로 데이터보내기 => useLocation 로 데이터 받기
        
        navigate("/register/petHave", {
            state: {
                userInfo
            }
        });
        return;
    }

    /** 중복된 아이디가 있는지 체크 */
    const checkId = async() => {
        const id = idRef.current.value;
        const idRegExp = /^[a-z0-9_-]{6,20}$/; 
        if (!checkRegExp(id, idRegExp)){
            alert("아이디를 다시 확인해주세요.");
            return;
        }
        await axios.post("http://localhost:3000/idCheck", null, {params: {id}})
        .then((response) => {
            console.log("ID Check >> ", response.data);
            if (response.status === 200){
                if (response.data === "EXIST") {
                    idCheckMsgRef.current.innerText = "이미 존재하는 아이디입니다.";
                    setIdSuccess(false);
                    return;
                };
                if (response.data === "NOT_EXIST") {
                    idCheckMsgRef.current.innerText = "사용가능한 아이디입니다.";
                    setIdSuccess(true);
                    return;
                };
            }
        });
    };
    /** 이메일 체크 함수 */
    const checkEmail = async() => {
        const email = emailRef.current.value;
        console.log(email);
        const emailRegExp =  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        if (!checkRegExp(email, emailRegExp)) {
            alert("이메일을 다시 확인해주세요");
            return;
        }
        await axios.post("http://localhost:3000/emailCheck", null, {params: {email}})
        .then((response)=> {
            if (response.status === 200) {
                if (response.data === "EXIST"){
                    emailCheckMsgRef.current.innerText = "이미 존재하는 이메일입니다.";
                    setEmailSuccess(false);
                    return;
                };
                if (response.data === "NOT_EXIST"){
                    emailCheckMsgRef.current.innerText = "사용가능한 이메일입니다..";
                    setEmailSuccess(true);
                    return;
                }
            }
        })
    }

    /** 닉네임 체크 함수 */
    const checkNickname =  async() => {
        const nickname = nickRef.current.value;
        const nickRegExp = /^[가-힣a-zA-Z0-9]+$/;
        console.log(nickname)
        if (!checkRegExp(nickname, nickRegExp)){
            alert("닉네임을 다시 확인해주세요.");
            return;
        }

        await axios.post("http://localhost:3000/nicknameCheck", null, {params: {nickname}})
        .then((response) => {
            console.log("Nick Name Check >> ", response.data);
            if (response.status === 200) {
                if (response.data === "EXIST") {
                    nickCheckMsgRef.current.innerText = "이미존재하는 닉네임입니다.";
                    setNickSuccess(false);
                    return;
                };
                if (response.data === "NOT_EXIST") {
                    nickCheckMsgRef.current.innerText = "사용가능한 닉네임입니다.";
                    setNickSuccess(true);
                    return;
                };
            }
        });
    };

    /** 첫번쨰로 작성한 비밀번호와 두번째 재확인용 비밀번호와 일치하는지 체크 */
    const confirmPassword = () => {
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
             <label>아이디<input ref={idRef} {...id} placeholder='최대 15자 까지 가능합니다.' required/></label>
            <button onClick={checkId}>중복확인</button><br/>
            <small ref={idCheckMsgRef}></small><br/>
            <label>비밀번호<input ref={passwordRef} {...password} type="password" placeholder='특수문자를 포함하는 8~24 자리의 비밀번호' required/></label><br/>
            <small ref={pwdRegExpRef}></small><br/>
            <label>비밀번호 확인<input ref={confirmRef} type="password" onChange={confirmPassword} required/></label><br/>
            <small ref={pwdCheckMsgRef}></small><br/>
            <label>이메일<input ref={emailRef} {...email} type="email" required /></label>
            <button onClick={checkEmail}>중복확인</button><br/>
            <small ref={emailCheckMsgRef}></small><br/>
            <label>닉네임<input ref={nickRef} {...nick} required /></label>
            <button onClick={checkNickname}>중복확인</button><br/>
            <small ref={nickCheckMsgRef}></small><br/>
            <div>
                <label>전화번호<input ref={numberRef} {...number} required /></label><br/>
                <label>생년월일<input ref={birthRef} {...birth} required /></label><br/>
            </div>
            <label>
                성별
                <div>
                    <label htmlFor='male'>남성</label>
                    <input type="radio"  id="male" name="gender" checked={radioValue === "male"} value="male" onChange={(event)=>setRadioValue(event.target.value)} />
                    <label htmlFor='female'>여성</label>
                    <input type="radio" id="female" name="gender" checked={radioValue === "female"} value="female" onChange={(event)=>setRadioValue(event.target.value)} />
    
                </div>
            </label>
    
            <button onClick={nextPage}>회원등록</button>
        </div>
    );
};

export default RegisterPage1;