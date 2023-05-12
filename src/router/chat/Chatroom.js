import axios from "axios";
import { useState, useRef, useEffect} from "react";
import { useSearchParams } from "react-router-dom";
import webstomp from "webstomp-client";
import SockJS from "sockjs-client";

const MyChat = ({chat}) => {
    return(
        <div style={{backgroundColor: "skyblue"}}>
            <h4>나</h4>
            <p>{chat.message}</p>
            <small>{chat.sendDate}</small>
        </div>
    );
}

const OtherChat = ({chat, otherNick}) => {
    return(
        <div style={{backgroundColor: "azure"}}>
            <h4>{otherNick}</h4>
            <p>{chat.message}</p>
            <small>{chat.sendDate}</small>
        </div>
    )
}

let stomp = null

// market_detail 에서 채팅하기 누르면 나타나는 페이지
const Chatroom = () => {
    const [ searchParams, setSearchParams ] = useSearchParams(); 
    const [ receiveChatInfo, setReceiveChatInfo ] = useState([]);
    const [ otherNick, setOtherNick ] = useState("");
    const messageRef = useRef(null);
    const [ message, setMessage ] = useState("");

    const chatroomID = searchParams.get("chatroomID");
    const sender = searchParams.get("sender");
    const recipient = searchParams.get("recipient");

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
            console.log(JSON.stringify(chatInfo));
            //stomp.send(path, body, header) : body 부분에 chatInfo 들어가야함.
            stomp.send("/pub/chat/send",JSON.stringify(chatInfo));
            saveChat();
        }
    },[message])

    useEffect(()=>{
        const viewChat = async() => {
            await axios.post("http://localhost:3000/chat/view", null, {params: {
                chatroomID,
                recipient: sender, // 자기자신이 view 함.
            }})
        }
        viewChat();
    },[receiveChatInfo]);

    
    
    console.log("출력할 채팅내용 : ", receiveChatInfo);
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
        <div>
            <h1>{otherNick} 님과의 대화</h1>
            {/* chat container */}
            <div>
            
            { receiveChatInfo.map((chatInfo, index)=> (
                chatInfo.sender === sender ? 
                <MyChat key={index} chat={chatInfo} />
                : 
                <OtherChat key={index} chat={chatInfo} otherNick={otherNick}/>
                
                ))}
            </div>
            {/* chat input */}
            <div>
                <input ref={messageRef} type="text" placeholder="typing chat!"/>
                <button onClick={sendChat} >전송</button>
            </div>
        </div>
    );
}
export default Chatroom;