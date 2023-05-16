import { useState, useRef, useEffect} from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import webstomp from "webstomp-client";
import SockJS from "sockjs-client";
import { styled, keyframes } from 'styled-components';

import { MyChat, OtherChat } from './components/ChatBox'

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const ChatContainer = styled.div`
    width: 800px;
    height: 1200px;
    padding: 10px 50px;
    border: none;
    border-radius: 15px;
    box-shadow: 2px 3px 5px 0px;
    background-color: white;
`

const ChatTitle = styled.h2`
    text-align: center;
    font-size: 35px;
    font-weight: bold;
    margin: 20px;
    padding: 20px;
`

const ChatWrapper = styled.div`
    height: 800px;
    overflow: scroll;
    background-color: rgba(204,204,204,0.3);

    &:-webkit-scrollbar-track{
        background-color: rgba(0,0,0,0);
    }

    &:-webkit-scrollbar-thumb{
        background-color: rgba(255,255,255,1);
        /* 스크롤바 둥글게 설정    */
        border-radius: 10px; 
        border: 7px solid rgba(0,0,0,0.8);
    }
`

const ChatInputWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50px;
    padding: 50px;
    height: 100px;

    border: none;
    border-radius: 15px;
    box-shadow: 2px 3px 5px 3px;
`

const ChatInputBox = styled.input`
    width: 300px;
    height: 40px;
    margin-right: 20px;
    padding: 8px;
    font-size: 15px;

    border: none;
    border-bottom: 3px solid black;
`

const ChatSendBtn = styled.button`
    width: 80px;
    height: 45px;
    padding: 5px;
    border: none;
    border-radius: 15px;
    color: white;
    background-color: aqua;

    transition: scale 1s;
    &:hover {
        scale: 0.95;
    }
`

const ChatLeftAlignBox = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 5px;
`

const ChatRightAlignBox = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    padding: 5px;
`   

let stomp = null

// market_detail 에서 채팅하기 누르면 나타나는 페이지
const Chatroom = () => {
    const location = useLocation();
    const [ receiveChatInfo, setReceiveChatInfo ] = useState([]);
    const [ otherNick, setOtherNick ] = useState("");
    const messageRef = useRef(null);
    const [ message, setMessage ] = useState("");
    const chatWrapperRef = useRef();
    const { chatroomID, sender, recipient } = location.state;


    useEffect(()=>{

        const getPrevChat = async() => {
            await axios.post("http://localhost:3000/chat/getPrevChat", null, {params:{chatroomID}})
            .then((response) => {
                if (response.status === 200) {
                    setReceiveChatInfo(receiveChatInfo => receiveChatInfo.concat(response.data));
                }
            });
        }
        
        const getOtherNick = async () => {
            await axios.post("http://localhost:3000/get/nickname", null, {params:{id:recipient}})
            .then((response)=>{
                if (response.status === 200) {
                    if (response.data) {
                        setOtherNick(response.data);
                    }
                }
            })
        }

        getOtherNick();        
        getPrevChat();

        // 웹소켓 연결 (sockjs-client);
        const websocket = new SockJS("http://localhost:3000/stomp/chat");
        stomp = webstomp.over(websocket);

        stomp.connect({}, function(){
            console.log("STOMP Connection");
            
            // subscribe(path, callback) 으로 웹소켓으로부터 메세지 받음.
            stomp.subscribe("/sub/chat/room/" + chatroomID, function(chat){
                const chatInfo = JSON.parse(chat.body);
                console.log("받은내용 >> " ,chatInfo)
                console.log("이전내용 >> ",receiveChatInfo);
                // 두 내용을 합칠때는 concat + 느낀점 js 공부많이 해야겠는데??;;
                console.log("받은+이전내용 >> ",receiveChatInfo.concat(chatInfo));
                setReceiveChatInfo(receiveChatInfo => receiveChatInfo.concat(chatInfo));
            });
        })

        return () => {
            stomp.disconnect(()=>{
                console.log("stomp disconnect");
                stomp.unsubscribe();
            })
        }
    },[])

    useEffect(()=>{
        // 처음 접속했을때 작동방지
        if (message) {
            let chatInfo = {
                chatroomID,
                sender,
                recipient,
                sendDate: new Date(),
                isViewed: "0",
                message,
            }
            //stomp.send(path, body, header) : body 부분에 chatInfo 들어가야함.
            stomp.send("/pub/chat/send",JSON.stringify(chatInfo));
            saveChat();
        }
    },[message])

    useEffect(()=>{
        const element = chatWrapperRef.current;
        element.scrollTop = element.scrollHeight;

        const viewChat = async() => {
            await axios.post("http://localhost:3000/chat/view", null, {params: {
                chatroomID,
                recipient: sender, // 자기자신이 view 함.
            }})
        }
        viewChat();
    },[receiveChatInfo]);

    // 채팅내역 저장
    const saveChat = async() => {
        console.log("채팅 axios: ",chatroomID, sender, recipient, message)
        await axios.post("http://localhost:3000/chat/save", null, {params: {
            chatroomID,
            sender,
            recipient,
            message,
        }});
    }
    
    // 메세지보내기
    const sendChat = () => {
        setMessage(messageRef.current.value);
        messageRef.current.value = "";
    }
    return (
        <Container>
            <ChatContainer>
                <ChatTitle>{otherNick} 님과의 대화</ChatTitle>
                {/* chat container */}
                <ChatWrapper ref={chatWrapperRef}>
                
                { receiveChatInfo.map((chatInfo, index)=> (
                    chatInfo.sender === sender ? 
                    <ChatLeftAlignBox>
                        <MyChat key={index} chat={chatInfo} />
                    </ChatLeftAlignBox>
                    : 
                    <ChatRightAlignBox>
                        <OtherChat key={index} chat={chatInfo} otherNick={otherNick}/>
                    </ChatRightAlignBox>
                    ))}
                </ChatWrapper>
                {/* chat input */}
                <ChatInputWrapper>
                    <ChatInputBox ref={messageRef} type="text" placeholder="typing chat!"/>
                    <ChatSendBtn onClick={sendChat} >전송</ChatSendBtn>
                </ChatInputWrapper>
            </ChatContainer>
        </Container>
    );
}
export default Chatroom;