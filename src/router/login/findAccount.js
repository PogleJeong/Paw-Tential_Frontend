import { useState } from "react";
import { axios }  from "axios";
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
        setValue(value);
    }
    return { value, onChange };

}
const FindID = () => {
    const email = useInput("", maxLen, 30);
    const phone = useInput("", maxLen, 12);
    
    return(
        <div>
            <div>
                <input type="email" {...email} placeholder=""/><br/>
                <input type="text" {...phone} />
            </div>
            
        </div>
    );
}

const ChangePassword = () => {
    const id = useInput("", maxLen, 10);
    const newPassword = useInput("", maxLen, 15);
    const confirmPassword = useInput("", maxLen, 15);
    const auth = useInput("", maxLen, 6);
    const [ authCorrect, setAutoCorrect ]= useState("");

    const sendAuthorization = async() => {
        await axios.get("http://localhost:3000/findAccount/password", {params: {
            id: id.value,
            newPassword: newPassword.value
        }});
    }
    return(
        <div>
            <div>
            <input type="text" {...id} placeholder="아이디를 입력해주세요" /><br/>
            <input type="password" {...newPassword} placeholder="아이디를 입력해주세요" /><br/>
            <input type="password" {...confirmPassword} placeholder="비밀번호를 다시 입력해주세요" /><br/>
            { confirmPassword.value && (newPassword.value === confirmPassword.value) ? <span>비밀번호가 일치합니다.</span> : <span>비밀번호가 일치하지 않습니다.</span>}
            </div>
            <div>
                <button onClick={sendAuthorization} >인증번호 보내기</button>
            </div>
        </div>
    );
}

// 아이디 찾기
const FindAccount = () => {
    
    
    return (
        <div>
       

        </div>
    );
};