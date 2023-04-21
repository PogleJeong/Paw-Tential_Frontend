import { useState, useRef, useEffect } from "react";
import axios from "axios";
const maxLen = (value, max) => value.length <= max;

const useInput = (initial, validator, valid) => {
    const [ value, setValue ] = useState(initial);

    const onChange = (event) => {
        const {
            target: { value }
        } = event;

        let willUpdate = true;
        if (typeof validator === "function") {
            willUpdate = validator(value, valid);
        }
        if (willUpdate) {
            setValue(value);
        }
    }
    return { value, onChange };

}

const FindID = () => {
    const email = useInput("", maxLen, 30);
    const phone = useInput("", maxLen, 12);
    const [ foundID, setFountID ]  = useState("");
    
    const clickFindId = async() => {
  
        alert('FindID')
        await axios.post("http://localhost:3000/findAccount/findID", null, {params: {
            email: email.value,
            phone: phone.value
        }}).then(response=>{
            if (response.data === "NOT_EXIST"){
                alert("입력한 정보에 해당하는 ID가 없습니다.");
                return;
            }
            setFountID(response.data);
       
        })
    }
    return(
        <div>
            <div>
                <input type="email" {...email} placeholder="가입한 이메일을 입력해주세요." /><br/>
                <input type="text" {...phone} placeholder="가입한 전화번호를 입력해주세요.(- 제외)" /><br/>
                <button onClick={clickFindId}>아이디찾기</button>
                {foundID ? <p>{"찾으시는 ID :" + foundID}.</p> : null}
            </div>
        </div>
    );
}

const ChangePassword = () => {
    const email = useInput("", maxLen, 20)
    const id = useInput("", maxLen, 10);
    const newPassword = useInput("", maxLen, 15);
    const confirmPassword = useInput("", maxLen, 15);
    const auth = useInput("", maxLen, 8);
    const authRef = useRef();
    const [ authCorrect, setAuthCorrect ]= useState(false);

    // 초기값설정 : 인증번호 disabled
    useEffect(()=> {
        authRef.current.disabled = true;
    })

    const sendAuthorization = async() => {
        authRef.current.disabled = false;

        await axios.post("http://localhost:3000/findAccount/auth", null, {params: {
            id: id.value,
            email: email.value
        }}).then(response=>{
            if (response.status === "200") {
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
        if (newPassword.value !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.")
            return;
        }
        await axios.post(("http://localhost:3000/findAccount/reset-password", null, {params: {
            id: id.value,
            email: email.value,
            newPassword: newPassword.value}}))
            .then(response=> {
                if (response.data === "PASSWORD_RESET_NO") {
                    alert("비밀번호 재설정에 실패하였습니다.");
                    return;
                }
                alert("비밀번호 재설정에 성공하였습니다.\n다시 로그인해주세요");
                window.location.href="http://localhost:9001/login/login";
            });


    }

    return(
        <div>
            {/* 
                비밀번호 재설정시 id, email 을 사용한다, 만약에 인증번호 이후 id, email 을 수정한다면 악용될 수 있기에 
                이를 방지하기 위해서 인증번호 단계와 비밀번호 재설정 단계를 분리하였다.
            */}
       
            { !authCorrect ?
                <div>
                    <input type="text" {...id} placeholder="아이디를 입력해주세요" /><br/>
                    <input type="email" {...email} placeholder="이메일을 입력해주세요" />
                    <button onClick={sendAuthorization} >인증번호 보내기</button><br/>
                    <input type="text" {...auth} placeholder="인증번호" ref={authRef} />
                    <button onClick={checkAuthorization}>인증하기</button>
                </div>
                :
                <div>
                    <h1>비밀번호 재설정</h1>
                    <input type="password" {...newPassword} placeholder="비밀번호를 입력해주세요" /><br/>
                    <input type="password" {...confirmPassword} placeholder="비밀번호를 다시 입력해주세요" /><br/>
                    { confirmPassword.value && (newPassword.value === confirmPassword.value) ? <span>비밀번호가 일치합니다.</span> : <span>비밀번호가 일치하지 않습니다.</span>}
                    <button onClick={resetPassword}>재설정</button>
                </div> 
            }
        </div>
    );
}

// 아이디 찾기
const FindAccount = () => {
    const [ option, setOption ] = useState("findId");
    
    return (
        <div>
            <div>
                <button onClick={()=>setOption("findId")} >아이디 찾기</button>
                <button onClick={()=>setOption("findPassword")} >비밀번호 재설정</button>
            </div>
            <div>
                {option === "findId" ? <FindID /> : <ChangePassword />}
            </div>
        </div>
    );
};

export default FindAccount;