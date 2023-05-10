import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";



/** 실시간 입력값 체크 */
const useInput = (initValue) => {
    const [value, setValue] = useState(initValue);
    const onChange = (event) => {
      const { target: { value } } = event;
      setValue(value);
    };
    return { value, setValue, onChange };
  };
  



/** 정규식 체크 함수*/
const checkRegExp = (value, regExp) => {
    return regExp.test(value);
}

const maxLen = (value, valid) => value.length <= valid;



const EditProfileForm = () => {
    // 입력값 검증
    const profilePicture = useInput("", null, null);
    const id = useInput("", maxLen, 15);
    const password = useInput("", maxLen, 20);
    const confirm = useInput("", maxLen, 20);
    const email = useInput("", maxLen, 45);
    const nick = useInput("", maxLen, 10);
    const number = useInput("", maxLen, 11);
    const intro = useInput("", maxLen, 500);
    const [ radioValue, setRadioValue ] = useState("0");
    const [userInfo, setUserInfo] = useState(null);
    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);



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
    const [ nickSuccess, setNickSuccess ] = useState(false);

    // 메세지 출력
    const idCheckMsgRef = useRef();
    const pwdRegExpRef = useRef();
    const pwdCheckMsgRef = useRef();
    const emailRegExpRef = useRef();
    const nickCheckMsgRef = useRef();

    // 페이지이동
    const navigate = useNavigate();

    // DB에서 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const res = await axios.get("http://localhost:3000/userInfo", { params: { id: cookies.USER_ID } });
                setUserInfo(res.data);
                console.log(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUserInfo();
    }, []);
    
// 입력 필드에 기본값 설정
useEffect(() => {
    if (userInfo) {
      const { id: userId, email: userEmail, nickname: userNick, phone: userNumber, intro: userIntro, profilePicture: userProfilePicture } = userInfo;
      id.setValue(userId);
      email.setValue(userEmail);
      nick.setValue(userNick);
      number.setValue(userNumber);
      intro.setValue(userIntro);
      profilePicture.setValue(userProfilePicture); // 프로필 사진 값을 설정합니다.
    }
  }, [userInfo]);


    useEffect(()=>{
        const { value } = password;
        const pwdRegExp = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{8,24}/;
        console.log(value);
        pwdRegExpRef.current.innerText = checkRegExp(value, pwdRegExp) ? "사용가능한 비밀번호입니다." : "특수문자를 포함하는 8~24 자리의 비밀번호를 입력해주세요.";
    },[password.value]);


    useEffect(()=>{
        const { value } = nick;
        const nickRegExp = /^[가-힣a-zA-Z]{2,10}$/;
        console.log(value);
        nickCheckMsgRef.current.innerText = checkRegExp(value, nickRegExp) ? null : "영문숫자조합 2~10 글자 가능합니다.";
    },[nick.value])
    
    const nextPage = async() => {
        // 입력값
        const password = passwordRef.current.value;
        const email = emailRef.current.value;
        const nick = nickRef.current.value;
        const number = numberRef.current.value;

        // 정규식
        const pwdRegExp = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{8,24}/;
        const nickRegExp = /^[가-힣a-zA-Z0-9]+$/;;

        // 1. 정보가 모두 입력되었는가

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


        // 2. 정규식

        if (!checkRegExp(password, pwdRegExp)){
            alert("비밀번호를 다시 확인해주세요.");
            return;
        }
        if (!checkRegExp(nick, nickRegExp)) {
            alert("닉네임을 다시 확인해주세요.");
            console.log(nick, nickRegExp);
            return;
        }
    
        // 3. 중복체크

        if (!nickSuccess) {
            alert("닉네임 중복을 확인해주세요");
            return;
        }

    // 유저 정보 업데이트
    const userInfo = {
      id: id,
      pwd: password,
      email: email,
      nickname: nick,
      phone: number,
      intro : intro,
      profile: profilePicture.value,
    };

    const editMember = async (userInfo) => {
        try {
          const res = await axios.post("http://localhost:3000/editMember", null ,{params : {userInfo}});
          console.log(res.data);
          // 처리 완료 후 필요한 작업 수행
        } catch (err) {
          console.log(err);
          // 오류 처리
        }
      };
    
    editMember(userInfo);       
    // useNavigator 으로 데이터보내기 => useLocation 로 데이터 받기
    navigate("/myfeed/myfeed", {
        state: {
            userInfo
        }
    });
}



    /** 닉네임 체크 함수 */
    const checkNickname =  async() => {
        const nickname = nickRef.current.value;
        const nickRegExp = /^[가-힣a-zA-Z0-9]+$/;
        console.log(nickname)
        console.log('결과 ' + checkRegExp(nickname, nickRegExp));
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
          if (password === confirm) {
            pwdCheckMsgRef.current.innerText = "비밀번호가 일치합니다.";
          } else {
            pwdCheckMsgRef.current.innerText = "비밀번호가 일치하지 않습니다.";
          }
        } else {
          pwdCheckMsgRef.current.innerText = "";
        }
      };
      

    return(
        <div>
            <label>프로필 사진</label><br/>
            <input {...profilePicture} type="file" accept="image/*" /><br/><br/>
            <label>아이디<p>{id.value}</p></label>
            <small ref={idCheckMsgRef}></small><br/>
            <label>비밀번호<input ref={passwordRef} {...password} type="password" placeholder='특수문자를 포함하는 8~24 자리의 비밀번호' required/></label><br/>
            <small ref={pwdRegExpRef}></small><br/>
            <label>비밀번호 확인<input ref={confirmRef} type="password" onChange={confirmPassword} required /></label><br/>
    <small ref={pwdCheckMsgRef}></small><br/>          
      <label>이메일<input ref={emailRef} {...email} type="email" required /></label><br/>
            <small ref={emailRegExpRef}></small><br/>
            <label>닉네임<input ref={nickRef} {...nick} required /></label>
            <button onClick={checkNickname}>중복확인</button><br/>
            <small ref={nickCheckMsgRef}></small><br/>
            <div>
                <label>전화번호<input ref={numberRef} {...number} required /></label><br/>
            </div><br/>
            <label>소개</label>
            <input {...intro} required />   
            <br/><br/>
    
            <button onClick={nextPage}>정보수정</button>
        </div>
    );
};

export default EditProfileForm;