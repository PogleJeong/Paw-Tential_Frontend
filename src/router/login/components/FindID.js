import { useState } from "react";
import axios from "axios";
import { styled } from "styled-components";
import { useInput, maxLen } from "../../../utils/UseHook"; 

const Wrapper = styled.div`
    width: 800px;
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

const ResultMsg = styled.p`
  padding-top: 30px;
  padding-bottom: 30px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;

const FindID = () => {
    const email = useInput("", maxLen, 30);
    const phone = useInput("", maxLen, 11);
    const [ foundID, setFountID ]  = useState("");
    
    const clickFindId = async() => {

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
        <Wrapper>
            <Title>아이디 찾기!</Title>
            <Label>이메일</Label><InputBox type="email" {...email} placeholder="가입한 이메일" /><br/>
            <Label>전화번호</Label><InputBox type="text" {...phone} placeholder="ex) 01012345678" /><br/>
            <FindIdBtn onClick={clickFindId}>아이디찾기</FindIdBtn>
            {foundID ? <ResultMsg>{"찾으시는 ID :" + foundID}.</ResultMsg> : null}
        </Wrapper>
    );
}

export default FindID;