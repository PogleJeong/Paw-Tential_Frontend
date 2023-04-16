import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../image/baseprofile.png";

let selectInfo = [
    {
        id: "1",
        text: "반려동물과 함께 살고있어요"
    },
    {
        id: "0",
        text: "반려동물과 함께 살진 않지만, 반려동물을 좋아해요"
    },
];

const useInput = (initial, validation) => {
    const [value, setValue] = useState(initial);
    if (typeof validation != "function"){
        return;
    }
    const onChange = (event) => {
        setValue(event.target.value);
    }

    return value, onChange;

    
}


const PetInfo = ({userId}) => {
    const [petGender, setPetGender] = useState("")
    const [imgFile, setImgFile] = useState("baseprofile.png");
    const imgRef = useRef();

    const imgLoad = () => {
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file); // file url 읽고
        reader.onloadend = () => { // 읽기가 끝나면
          setImgFile(reader.result); // reader 결과(이미지)
        }
    }
    const registerPet = () => {
        const user = userId;

    }
    return(
        <div>
            <h1 style={{textAlign: "center"}}>대표 반려동물 추가하기</h1>
            <div >
                <button>카테고리 선택</button><br/>
                <img src={imgFile} style={{width: "200px", aspectRatio: "16/9"}} alt="" /><br/>
                <input type="file" ref={imgRef} onChange={imgLoad} /><br/>
                <input type="text" placeholder="이름을 입력하세요" /><br/>
                <input type="text" placeholder="생년월일 8자리를 입력해주세요" /><br/>
                <textarea rows="10" maxLength="300" placeholder="300자 이내로 소개해주세요" />
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
        const userHavePet = event.target.getAttribute("data-key")
        setSelected(userHavePet);
        userInfo.petHave = userHavePet // useState 는 재랜더링 이후에 업데이트 됨.
        
        await axios.post("http://localhost:3000/register", null, {params: userInfo});
        
        if (userHavePet === "0"){
            navigator("/");
        }
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