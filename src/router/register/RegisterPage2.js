import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { styled, keyframes } from "styled-components";

import petIcon from "../../image/icon/pet.png";
import loveIcon from "../../image/icon/love.png";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1000px;
    
    animation: ${fadeIn} 2s;
`;

const Title = styled.h1`
    font-size: 30px;
    text-align: center;
    margin-bottom: 20px;
`;

const Wrappers = styled.div`
    width: 800px;
    padding: 40px;
    border-radius: 10px;
    background-color: white;
    text-align: center;

    box-shadow: 2px 3px 5px 0px;
`
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const SelectBox = styled.div`
  width: 300px;
  height: 300px;
  margin: 50px;
  padding: 50px;
  border: none;
  border-radius: 15px;
  background-color: rgba(255, 61, 116, 0.1);
  
  transition: scale 1s;
  &:hover {
    border: 3px solid black;
    scale: 0.9;
  }
`
const Image = styled.img`
  width: 150px;
  height: 150px;
  border: 2px solid white;
  border-radius: 100px;
`;

const TextBox = styled.span`
  display: inline-block;
  width: 200px;
  padding-top: 30px;
  font-size: 15px;
  color: black;
`

/** 반려동물이 있는지 선택하는 페이지 간단함! */
function RegisterPage2() {
    // RegisterPage1 에서 보낸 state 값 활용
    const location = useLocation();
    const navigate = useNavigate();
    const { userInfo } = location.state;

    const selectPetHave = async(event) => {
        
        const userHavePet = event.target.dataset.value;

        userInfo.petHave = userHavePet; // 기존 유저정보에 추가해서 서버로 전송
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
        <Container>
            <Wrappers>
            {/*임시 style 왠지모르겠는데 image 에 이벤트가 없음에도 발동하여 data-value가 찍힘*/}
                <Wrapper>
                    <Title>반려동물 유무 선택 페이지</Title>
                </Wrapper>
                <Wrapper>
                    <SelectBox data-value="0" onDoubleClick={selectPetHave} >
                            <Image data-value="0" src={petIcon} style={{width: "150px", aspectRatio: "1/1", border: "1px solid black",borderRadius: "100px"}}/><br/>
                            <TextBox>반려동물과 함께 살고있어요</TextBox>
                    </SelectBox>
                    <SelectBox data-value="1" onDoubleClick={selectPetHave} >
                            <Image data-value="1" src={loveIcon} style={{width: "150px", aspectRatio: "1/1", border: "1px solid black", borderRadius: "100px"}}/><br/>
                            <TextBox>반려동물과 함께 살진 않지만 &nbsp; 반려동물을 좋아해요</TextBox>
                    </SelectBox>
               </Wrapper>
            </Wrappers>
        </Container>
    );
}

export default RegisterPage2;

/*
    "https://www.flaticon.com/free-icons/cat"
    "https://www.flaticon.com/free-icons/heart"
*/