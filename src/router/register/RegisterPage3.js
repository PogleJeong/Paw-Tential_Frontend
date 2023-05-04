import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import axios from "axios";

import PetCategoryModal from "./modals/PetCategory";

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

/** 정규식 체크 함수 */
const checkRegExp = (value, regExp) => {
    return regExp.test(value);
}

const maxLen = (value, valid) => value.length <= valid;

/** 만약 반려동물이 있다면 나오는 추가페이지 */
function RegisterPage3() {
    // 유저 id 정보가져오기
    const location = useLocation();
    const { userId } = location.state;

    // 모달창
    const [ activeModal, setActiveModal ] = useState(false);

    // 입력값
    const [ petCategory, setPetCategory ] = useState("반려동물 선택");
    const [ imgFile, setImgFile ] = useState("baseprofile.png");
    const petName = useInput("", checkRegExp, /^[가-힣a-zA-Z]+$/);
    const petBirth = useInput("", checkRegExp, /^[0-9]{0,8}$/);
    const petIntro = useInput("", maxLen, 100);
    const [ petGender, setPetGender] = useState("");

    // 입력값
    const petNameRef = useRef();
    const petBirthRef = useRef();
    const petIntroRef = useRef();
    const imgRef = useRef();
    const navigate = useNavigate();

    const imgLoad = () => {
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file); // file을 url로 읽고
        reader.onloadend = () => { // 읽기가 끝나면
          setImgFile(reader.result); // reader 결과(이미지)를 img 태그에 설정
        }
    }

    const registerPet = async() => {
        const petName = petNameRef.current.value;
        const petBirth = petBirthRef.current.value;
        const petIntro = petIntroRef.current.value;

        // 입력값 체크
        if (!petCategory || petCategory === "반려동물 선택") {
            alert("카테고리가 선택되지 않았습니다.");
            return;
        }
        if (!petName) {
            alert("변려동물의 이름이 작성되지 않았습니다.");
            return;
        }
        if (!petBirth) {
            alert("반려동물의 생일이 작성되지 않았습니다.");
            return;
        }
        if (petBirth.length !== 8) {
            alert("생년월일 8글자를 입력해주세요.");
            return;
        }
        if (!petIntro) {
            alert("반려동물 소개를 입력해주세요!");
            return;
        }
        if (!petGender) {
            alert("반려동물의 성별을 입력해주세요!");
            return;
        }

        let petInfo = { id: userId, cate: petCategory, name: petName, birth: petBirth, intro: petIntro, gender: petGender };
        let formData = new FormData();
        formData.append("file", imgRef.current.files[0]);
        formData.append("petInfo", new Blob([JSON.stringify(petInfo)], {type: "application/json"}))

        await axios.post("http://localhost:3000/petRegister", formData, {"Content-Type": `multipart/form-data`})
        .then((response)=> {
            if (response.status === 200){
                if (response.data === "YES") {
                    alert("반려동물 등록이 완료되었습니다!.");
                    navigate("/login");
                    return;
                }
                else {
                    alert("반려동물 등록에 실패하였습니다");
                    navigate("/register");
                    return;
                };
            }
            alert("에러코드 :",response.status);
        });
    }

    return(
        <div>
            <h1 style={{textAlign: "center"}}>대표 반려동물 추가하기</h1>
            {activeModal ? <PetCategoryModal getPetCategory={setPetCategory} getModalActive={setActiveModal}/> : null}
            <div>
                <button onClick={()=>setActiveModal(true)}>{petCategory}</button><br/>
                <img src={imgFile} style={{width: "200px", aspectRatio: "16/9"}} alt="" /><br/>
                <input type="file" ref={imgRef} onChange={imgLoad} /><br/>
                <input ref={petNameRef} {...petName} placeholder="이름을 입력하세요(1~10 글자(영문/한글)" /><br/>
                <input ref={petBirthRef} {...petBirth} placeholder="생년월일 8자리를 입력해주세요" /><br/>
                <textarea ref={petIntroRef} {...petIntro} rows="10" maxLength="100" placeholder="100자 이내로 소개해주세요" ></textarea>
                <div>
                    <label><input type="radio" onChange={()=>setPetGender(0)} name="petGender" />남아</label><br/>
                    <label><input type="radio" onChange={()=>setPetGender(1)} name="petGender" />여아</label><br/>
                </div>
                <button onClick={registerPet}>가입하기</button>
            </div>
        </div>
    );
}

export default RegisterPage3;