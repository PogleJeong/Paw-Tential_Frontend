import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import petIcon from "../../image/icon/pet.png";
import loveIcon from "../../image/icon/love.png";


/** 반려동물이 있는지 선택하는 페이지 간단함! */
function RegisterPage2() {
    // RegisterPage1 에서 보낸 state 값 활용
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo } = location.state;
    useEffect(()=>{
        console.log(location.state);
    },[])

    const selectPetHave = async(event) => {
        
        const userHavePet = event.target.dataset.value;

        userInfo.petHave = userHavePet; // 기존 유저정보에 추가해서 서버로 전송
        console.log("추가된 유저정보 :", userInfo);
        await axios.post("http://localhost:3000/register", null, {params: userInfo})
        .then(response => {
            if (response.status === 200){

                if (response.data === "REGISTER_NO") {
                    alert("회원가입에 실패하였습니다.");
                    return;
                }
            
                if (userHavePet === "1"){
                    alert("회원가입에 성공하였습니다.");
                    navigate("/login");
                    return;
                }

                if (userHavePet === "0"){
                    navigate("/register/petInfo",{
                        state: {
                            userId: userInfo.id
                        }
                    });
                }
            }
            else { //500
                alert("에러코드 >>", response.status);
                return;
            }
        });
    }

    return(
        <div>
            <h1 style={{textAlign: "center"}}>반려동물 유무 선택 페이지</h1>
            {/*임시 style 왠지모르겠는데 image 에 이벤트가 없음에도 발동하여 data-value가 찍힘*/}
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
               <div data-value="0" onDoubleClick={selectPetHave} style={{width: "200px", aspectRatio: "1/1", padding: "10px", margin: "100px"}}>
                    <img data-value="0" src={petIcon} style={{width: "150px", aspectRatio: "1/1", border: "1px solid black",borderRadius: "100px"}}/><br/>
                    <small>반려동물과 함께 살고있어요</small>
               </div>
               <div data-value="1" onDoubleClick={selectPetHave} style={{width: "200px", aspectRatio: "1/1", padding: "10px", margin: "100px"}}>
                    <img data-value="1" src={loveIcon} style={{width: "150px", aspectRatio: "1/1", border: "1px solid black", borderRadius: "100px"}}/><br/>
                    <small>반려동물과 함께 살진 않지만 반려동물을 좋아해요</small>
               </div>
            </div>
        </div>
    );
}

export default RegisterPage2;

/*
    "https://www.flaticon.com/free-icons/cat"
    "https://www.flaticon.com/free-icons/heart"
*/