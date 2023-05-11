import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

/** 실시간 입력값 체크 */
const useInput = (initValue, validator, valid) => {
    const [value, setValue] = useState(initValue);
    const onChange = (event) => {
      const { target } = event;
      const inputValue = target.type === 'file' ? target.files[0] : target.value;
      let willUpdate = true;
      if (typeof validator === 'function') {
        willUpdate = validator(inputValue, valid);
        if (willUpdate) {
          setValue(inputValue);
        }
      }
      console.log(inputValue);
    };
    return { value, onChange };
  };
  

/** 정규식 체크 함수*/
const checkRegExp = (value, regExp) => {
  return regExp.test(value);
};

const maxLen = (value, valid) => value.length <= valid;

const EditProfileForm = () => {
  // 입력값 검증
  const id = useInput("", maxLen, 15);
  // const password = useInput("", maxLen, 20);
  const confirm = useInput("", maxLen, 20);
  const email = useInput("", maxLen, 45);
  const nick = useInput("", maxLen, 10);
  const number = useInput("", maxLen, 11);
  const intro = useInput("", maxLen, 500);
  const [userInfo, setUserInfo] = useState(null);
  const [cookies, setCookies] = useCookies(["USER_ID", "USER_NICKNAME"]);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userNick, setUsernick] = useState('');

  // 입력값 검증
  const idRef = useRef();
  // const passwordRef = useRef();
  const confirmRef = useRef();
  const emailRef = useRef();
  const nickRef = useRef();
  const numberRef = useRef();
  const birthRef = useRef();

  // DB 에서 중복검증
  const [idSuccess, setIdSuccess] = useState(false);
  const [nickSuccess, setNickSuccess] = useState(false);

  // 메세지 출력
  const idCheckMsgRef = useRef();
  // const pwdRegExpRef = useRef();
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
        setUsernick(res.data.nickname);
        if (res.data.profile) {

          const profilePicturePath = `http://localhost:3000/${res.data.profile}`;
          setProfilePictureFile(profilePicturePath); // 프로필 사진을 설정합니다.
          setPreviewUrl(profilePicturePath); // 미리보기 URL을 설정합니다.
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchUserInfo();
  }, []);

  // 입력 필드에 기본값 설정
  useEffect(() => {
    if (userInfo) {
      const { id: userId, email: userEmail, nickname: userNick, phone: userNumber, intro: userIntro, profile: userProfilePicture } = userInfo;

      id.onChange({ target: { value: userId } }); // id 값을 설정합니다.
      email.onChange({ target: { value: userEmail } }); // email 값을 설정합니다.
      nick.onChange({ target: { value: userNick } }); // nick 값을 설정합니다
      number.onChange({ target: { value: userNumber } }); // number 값을 설정합니다.
      intro.onChange({ target: { value: userIntro } }); // intro 값을 설정합니다.
      setProfilePictureFile({ target: { value: userProfilePicture } }); // profile 값을 설정합니다.
    }
  }, [userInfo]);

  useEffect(() => {
    const { value } = nick;
    const nickRegExp = /^[가-힣a-zA-Z]{2,10}$/;
    console.log(value);
    nickCheckMsgRef.current.innerText = checkRegExp(value, nickRegExp) ? null : "영문숫자조합 2~10 글자 가능합니다.";
  }, [nick.value]);

  const editMember = async (userInfo) => {
    try {
      const formData = new FormData();
     formData.append('upload', profilePictureFile); // 파일을 FormData에 추가합니다.
      Object.entries(userInfo).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      const res = await axios.post('http://localhost:3000/editMember', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 파일 업로드를 위해 콘텐츠 타입을 multipart/form-data로 설정합니다.
        },
    });
    alert('프로필 수정이 완료되었습니다');
      // 처리 완료 후 필요한 작업 수행
    } catch (err) {
      console.log(err);
      // 오류 처리
    }
  };

  const nextPage = async () => {
    // 입력값
    // const password = passwordRef.current.value;
    const email = emailRef.current.value;
    const nick = nickRef.current.value;
    const number = numberRef.current.value;

    // 정규식
    // const pwdRegExp = /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{8,24}/;
    const nickRegExp = /^[가-힣a-zA-Z0-9]+$/;

    // 1. 정보가 모두 입력되었는가

    // if (!password) {
    //   alert("비밀번호가 입력되지 않았습니다.");
    //   passwordRef.focus();
    //   return;
    // }
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

    // if (!checkRegExp(password, pwdRegExp)) {
    //   alert("비밀번호를 다시 확인해주세요.");
    //   return;
    // }
    if (!checkRegExp(nick, nickRegExp)) {
      alert("닉네임을 다시 확인해주세요.");
      console.log(nick, nickRegExp);
      return;
    }

    // 3. 중복체크

    if (nick !== userNick) {
      alert("닉네임 중복을 확인해주세요");
      return;
    } else {
        setNickSuccess(true);
    }

    // 유저 정보 업데이트
    const userInfo = {
      id: id.value,
      email: email,
      nickname: nick,
      phone: number,
      intro: intro.value,
      profile: profilePictureFile.value,
    };


    editMember(userInfo);
    // useNavigator 으로 데이터보내기 => useLocation 로 데이터 받기
    // navigate("/myfeed/myfeed", {
    //   state: {
    //     userInfo
    //   }
    // });
  };

  /** 닉네임 체크 함수 */
  const checkNickname = async () => {
    const nickname = nickRef.current.value;
    const nickRegExp = /^[가-힣a-zA-Z0-9]+$/;
    console.log(nickname);
    console.log('결과 ' + checkRegExp(nickname, nickRegExp));
    if (!checkRegExp(nickname, nickRegExp)) {
      alert("닉네임을 다시 확인해주세요.");
      return;
    }

    await axios
      .post("http://localhost:3000/nicknameCheck", null, { params: { nickname } })
      .then((response) => {
        console.log("Nick Name Check >> ", response.data);
        if (response.status === 200) {
        
          if (response.data === "EXIST") {
            nickCheckMsgRef.current.innerText = "이미존재하는 닉네임입니다.";
            setNickSuccess(false);
            return;
          }
          if (response.data === "NOT_EXIST") {
            nickCheckMsgRef.current.innerText = "사용가능한 닉네임입니다.";
            setNickSuccess(true);
            return;
          }
        }
      });
  };

// 프로필 사진 변경 시 미리보기 업데이트
const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePictureFile(file); // 선택한 파일을 상태로 설정합니다.
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result); // 미리보기 URL을 설정합니다.
      };
      reader.readAsDataURL(file);
    }
  };



  return (
    <div>
          <label>프로필 사진</label>
      <br />
      <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
      <br />
      {previewUrl && ( // 미리보기 URL이 있는 경우에만 이미지를 표시합니다.
        <img src={previewUrl} alt="프로필 사진 미리보기" style={{ width: '200px', height: '200px' }} />
      )}
      <br />
      <label>
        아이디<p>{id.value}</p>
      </label>
      <small ref={idCheckMsgRef}></small>
      <br />
      {/* <label>비밀번호<input ref={passwordRef} {...password} type="password" placeholder='특수문자를 포함하는 8~24 자리의 비밀번호' required/></label><br/>
            <small ref={pwdRegExpRef}></small><br/> */}
      <label>
        이메일<input ref={emailRef} {...email} type="email" required />
      </label>
      <br />
      <small ref={emailRegExpRef}></small>
      <br />
      <label>
        닉네임<input ref={nickRef} {...nick} required />
      </label>
      <button onClick={checkNickname}>중복확인</button>
      <br />
      <small ref={nickCheckMsgRef}></small>
      <br />
      <div>
        <label>
          전화번호<input ref={numberRef} {...number} required />
        </label>
        <br />
      </div>
      <br />
      <label>소개</label>
      <input {...intro} required />
      <br />
      <br />

      <button onClick={nextPage}>정보수정</button>
    </div>
  );
};

export default EditProfileForm;