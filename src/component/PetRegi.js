import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../image/baseprofile.png";

const selectInfo = [
    {
        id: "1",
        text: "반려동물과 함께 살고있어요"
    },
    {
        id: "0",
        text: "반려동물과 함께 살진 않지만, 반려동물을 좋아해요"
    },
];
const petCategory = ["dog", "cat", "hamster", "duck", "hedgehog"];

const useInput = (initial, validation) => {
    const [ value, setValue] = useState(initial);
    /*if (typeof validation != "function"){
        return;
    }
    */
    const onChange = (event) => {
        setValue(event.target.value);
    }
    return [ value, onChange ];
}

const PetCategoryModal = ({getModalActive, getPetCategory}) => {
   
    // 카테고리를 선택하면 부모노드에게 값을 보내고 modal 창 닫음
    const sendParent = (event) => {
        getPetCategory(event.target.getAttribute("data-key"));
        getModalActive(false);
    }
    return(
        <div style={{display:"flex"}}>
            {petCategory.map((pet, index) => (<div key={index} data-key={pet} style={{width: "100px", aspectRatio: "1/1", border:"1px solid red", borderRadius:"100px"}} onClick={sendParent}>{pet}</div>))}
        </div>
    );
}

const PetInfo = ({userId}) => {
    const [ imgFile, setImgFile ] = useState("baseprofile.png");
    const [ activeModal, setActiveModal ] = useState(false);
    const [ petCategory, setPetCategory ] = useState("");
    const [ petName, setPetName ] = useInput("", null);
    const [ petBirth, setPetBirth] = useInput("", null);
    const [ petIntro, setPetIntro ] = useInput("", null);
    const [ petGender, setPetGender] = useState("")
    const imgRef = useRef();
    const navigator = useNavigate();
    
    console.log(petCategory);
    const imgLoad = () => {
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file); // file을 url로 읽고
        reader.onloadend = () => { // 읽기가 끝나면
          setImgFile(reader.result); // reader 결과(이미지)를 img 태그에 설정
        }
    }
    const registerPet = async() => {
        if (!petCategory) {
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
            if (response.data === "YES") {
                alert("회원가입이 완료되었습니다!.");
                navigator("/login/login");
                return;
            }
            else {
                alert("에러! 회원가입에 실패하였습니다");
                navigator("login/regi");
                return;
            }
        });

    }
    const activeModalBtn = () => {
        setActiveModal(true);
    }
    return(
        <div>
            <h1 style={{textAlign: "center"}}>대표 반려동물 추가하기</h1>
            {activeModal===true ? <PetCategoryModal getPetCategory={setPetCategory} getModalActive={setActiveModal}/> : null}
            <div >
                <button onClick={activeModalBtn}>카테고리 선택</button><br/>
                <img src={imgFile} style={{width: "200px", aspectRatio: "16/9"}} alt="" /><br/>
                <input type="file" ref={imgRef} onChange={imgLoad} /><br/>
                <input value={petName} onChange={setPetName} type="text" placeholder="이름을 입력하세요" /><br/>
                <input value={petBirth} onChange={setPetBirth} type="text" placeholder="생년월일 8자리를 입력해주세요" /><br/>
                <textarea value={petIntro} onChange={setPetIntro} rows="10" maxLength="300" placeholder="300자 이내로 소개해주세요" ></textarea>
                <div>
                    <label><input type="radio" onChange={()=>setPetGender(0)} name="petGender" />남아</label><br/>
                    <label><input type="radio" onChange={()=>setPetGender(1)} name="petGender" />여아</label><br/>
                </div>
                <button onClick={registerPet}>가입하기</button>

            </div>
        </div>
    )
}

const PetRegi = ({userInfo}) => {
    const [ selected, setSelected ] = useState("");
    const navigator = useNavigate();

    // user 정보 입력은 종료되고, user 의 정보는 저장됩니다.
    const selectPet = async(event) => {
        const userHavePet = event.target.getAttribute("data-key");
        setSelected(userHavePet);
        userInfo.petHave = userHavePet; // useState 는 재랜더링 이후에 업데이트 됨.
        
        await axios.post("http://localhost:3000/register", null, {params: userInfo})
        .then(response => {
            if (response.data === "REGISTER_NO") {
                alert("회원가입에 실패하였습니다.");
                return;
            }
            if (userHavePet === "0"){
                alert("회원가입에 성공하였습니다.")
                navigator("/");
            }
        });
    }
    return(
        <div>
            <h1 style={{textAlign: "center"}}>반려동물 유무 선택 페이지</h1>
            {/*임시 style*/}
            <div className="selectBox" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                {selectInfo.map((selector, index)=> (<div key={index} data-key={selector.id} onDoubleClick={selectPet} style={{borderRadius: "50px", width: "100px", aspectRatio: "1/1", background: "gray"}}>{selector.text}</div>))}
            </div>
            { selected === "1" ? <PetInfo userId={userInfo.id}/> : null }
        </div>
    );
}

export default PetRegi;