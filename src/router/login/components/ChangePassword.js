import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useInput, checkRegExp, maxLen } from "../../../utils/UseHook"; 


const Wrapper = styled.div`
    min-width: 800px;
    padding: 40px;
    border-radius: 10px;
    background-color: white;
    text-align: center;
    box-shadow: 2px 3px 5px 0px;
`;

const Title = styled.h1`
    font-size: 30px;
    text-align: center;
    margin-bottom: 20px;
`;

const InputBox = styled.input.attrs({required: true})`
    width: 200px;
    padding: 10px;
    padding-bottom: 5px;
    margin: 5px;
    border: none;
    border-bottom: 2px solid black;
    font-size: 15px;

    &:focus {
        background-color: rgba(255, 207, 159, 0.4);
    }
`;

const Label = styled.label`
    display: inline-block;
    width: 60px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    font-weight: bold;
`;

const MsgBox = styled.small`
  font-size: 12px;
  color: black;
  opacity: 0.5;
`;

const CheckBtn = styled.button.attrs({placeholder: "중복확인"})`
  font-size: 10px;
  width: 60px;
  aspect-ratio: 16/9;
  background-color: rgba(195, 54, 197, 0.2);
  border: none;
  border-radius: 10px;
  
  &:active {
    transform: scale(0.95);
  }
`;

const FindIdBtn = styled.button`
  width: 200px;
  height: 40px;
  margin: 30px;
  border: none;
  background-color: rgba(215, 155, 0, 0.2);
  transition: background-color 1s;
  &:hover {
    background-color: rgba(62, 185, 125, 0.4);
  }
`;


const ChangePassword = () => {
    const email = useInput("", maxLen, 20)
    const id = useInput("", maxLen, 10);
    const newPassword = useInput("", maxLen, 15);
    const confirmPassword = useInput("", maxLen, 15);
    const auth = useInput("", maxLen, 8);
    const authRef = useRef();
    const [ authCorrect, setAuthCorrect ]= useState(false);
    const navigate = useNavigate();

    /* // 초기값설정 : 인증번호 disabled
    useEffect(()=> {
        authRef.current.disabled = true;
    },[]) */

    const sendAuthorization = async() => {
        if (!email.value) {
            alert("이메일을 입력해주세요.");
            return;
        }
        alert(`${email.value} 로 인증번호를 전송하였습니다.`);
        /* authRef.current.disabled = false; */

        await axios.post("http://localhost:3000/findAccount/auth", null, {params: {
            id: id.value,
            email: email.value
        }}).then(response=>{
            if (response.status === 200) {
                if (response.data === "notExist") {
                    alert("아이디와 이메일이 일치하는 계정이 없습니다.");
                    return;
                }
                if (response.data === "AUTH_ADD_ERROR" || response.data === "AUTH_UPDATE_ERROR") {
                    alert("인증 DB 저장 실패");
                    return;
                }
            } else {
                alert("잘못된 request 요청")
            }

        });
    }
    const checkAuthorization = async() => {
        // 인증번호가 입력되지 않았을 경우
        if (!auth.value) {
            alert("인증번호가 입력되지 않았습니다.");
            return;
        }

        await axios.post("http://localhost:3000/findAccount/auth/check", null, {params: {
            id: id.value,
            email: email.value,
            authKey: auth.value}}).then(response => {
                if (response.data === "AUTH_CONFIRM_NO") {
                    alert("인증번호가 일치하지 않습니다.");
                    return;
                }
                if (response.data === "AUTH_DELETE_ERROR") {
                    alert("인증번호 삭제 오류(DB)");
                    return;
                }
                // 백엔드에서 검증을 거치고 입력받은 authkey 를 돌려받는다.
                // 인증번호가 일치할 경우 - password 입력창이 랜더링됨.
                setAuthCorrect(true);
            });
    }
    const resetPassword = async() => {
        // 비밀번호와 재확인 비교하여 일치하는지 봄.
        if (newPassword.value !== confirmPassword.value) {
            alert("비밀번호가 일치하지 않습니다.")
            return;
        }
        await axios.post("http://localhost:3000/findAccount/reset-password", null, {params: {
            id: id.value,
            email: email.value,
            newPassword: newPassword.value}})
            .then((response)=> {
                console.log(response);
                if (response.data === "PASSWORD_RESET_NO") {
                    alert("비밀번호 재설정에 실패하였습니다.");
                    return;
                }
                alert("비밀번호 재설정에 성공하였습니다.");
                window.location.href = "http://localhost:9001/login";
            });
    }

    return(
        <Wrapper>
            {/* 
                비밀번호 재설정시 id, email 을 사용한다, 만약에 인증번호 이후 id, email 을 수정한다면 악용될 수 있기에 
                이를 방지하기 위해서 인증번호 단계와 비밀번호 재설정 단계를 분리하였다.
            */}
            <Title>비밀번호 재설정</Title>
            { !authCorrect ?
                <div>
                    
                    <Label>아이디</Label><InputBox type="text" {...id} placeholder="가입한 아이디" /><br/>
                    <Label>이메일</Label><InputBox {...email} placeholder="가입한 이메일" />
                    <CheckBtn onClick={sendAuthorization} >인증번호전송</CheckBtn><br/>
                    <Label>인증번호</Label><InputBox {...auth} placeholder="인증번호" ref={authRef} />
                    <CheckBtn onClick={checkAuthorization}>인증하기</CheckBtn>
                </div>
                :
                <div>
                    <InputBox type="password" {...newPassword} placeholder="비밀번호를 입력해주세요" /><br/>
                    { checkRegExp(newPassword.value, /(?=.*[a-zA-ZS])(?=.*?[#?!@$%^&*-]).{8,24}/) ? null : <MsgBox>특수문자를 포함하는 8~24 자리의 비밀번호를 입력해주세요.</MsgBox>}
                    <br/><InputBox type="password" {...confirmPassword} placeholder="비밀번호를 다시 입력해주세요" /><br/>
                    { confirmPassword.value && (newPassword.value === confirmPassword.value) ? <MsgBox>비밀번호가 일치합니다.</MsgBox> : <MsgBox>비밀번호가 일치하지 않습니다.</MsgBox>}
                    <br/><CheckBtn onClick={resetPassword}>재설정</CheckBtn>
                </div> 
            }
        </Wrapper>
    );
}
export default ChangePassword;