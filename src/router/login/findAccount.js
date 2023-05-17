import { useState, useRef } from "react";
import { styled } from "styled-components";
import FindID from "./components/FindID";
import ChangePassword from "./components/ChangePassword";

const Container = styled.div`
    display: flex;
    margin-top: 50px;
    margin-left: 300px;
    max-width: 800px;
    flex-flow : row wrap;
`;

const Tabs = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 500px;
    height: 40px;
`

const Tab = styled.li`
    width: 400px;
    height: 40px;
    text-align: center;
    box-shadow: 2px 3px 5px 0px;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    background: white;
    
    &:hover {
        background: sky;
        cursor: pointer;
    }
`;


// 아이디 찾기
const FindAccount = () => {
    const [ option, setOption ] = useState("findId");
    
    return (
        <Container>
            <Tabs>
                <Tab onClick={()=>setOption("findId")} >아이디 찾기</Tab>
                <Tab onClick={()=>setOption("findPassword")} >비밀번호 재설정</Tab>
            </Tabs>
            {option === "findId" ? <FindID /> : <ChangePassword />}
           
        </Container>
    );
};

export default FindAccount;