import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { styled, keyframes } from 'styled-components';

import ChatroomInfo from './components/ChatroomInfo';

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
    flex-wrap: wrap;

    margin: 0px;
    padding: 30px 100px;
    width: 80%;
    height: 800px;

    animation: ${fadeIn} 2s;
`;

const Title = styled.h1`
    display: inline-block;
    font-size: 35px;
    font-weight: bold;
    text-align: center;
    margin: 30px;
    min-width: 100%;
`

const ChatListContainer = styled.div`
    width: 500px;
    min-height: 800px;
    overflow: scroll;
    padding: 20px;
    background-color: white;
    border: none;
    border-radius: 15px;
    box-shadow: 2px 3px 5px 0px;
`
/* const Title = styled.h1`
    font-size: 30px;
    text-align: center;
    margin-bottom: 20px;
`; */



const ChatroomHome = () => {
    const [ chatInfoList, setChatInfoList ] = useState([]);
    const [ cookie ] = useCookies(["USER_ID","USER_NICKNAME"]);

    useEffect(()=>{
        const USER_ID = cookie.USER_ID;
        if (!USER_ID) {
            alert("로그인 후 이용해주세요");
            window.location.href = "/login";
        }
        const callChatroomInfo = async() => {
            await axios.get("http://localhost:3000/chat/home", {params : {
                USER_ID,
            }})
            .then((response)=> {
                if (response.status === 200) {
                    setChatInfoList(response.data);
                    return;
                }
                if (response.status === 500) {
                    alert("서버 측 에러")
                    return;
                }
                else {
                    alert("200 . 500 이외")
                }
            })
        }
        callChatroomInfo();
    },[]);

    return(
        <Container>
            <Title>내 채팅 리스트</Title>
            <ChatListContainer>
                { !chatInfoList ? 
                <h2>채팅내역이 존재하지 않습니다.</h2>
                :
                <ul>
                    {chatInfoList.map((chatInfo, index)=> <ChatroomInfo key={index} chatInfo={chatInfo} user={cookie.USER_ID}/>)}
                </ul>
                }   
            </ChatListContainer>
        </Container>
    )
}

export default ChatroomHome;