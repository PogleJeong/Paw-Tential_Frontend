import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ChatroomInfo = ({chatInfo, user}) => {
    const [ notReadChatCount, setNotReadChatCount ] = useState(0);
    useEffect(()=>{
        const getNotReadChatCount = async() => {
            await axios.post("http://localhost:3000/chat/getNotReadChatCount", null, {params: {
                chatroomID: chatInfo.chatroomID,
                recipient: user
            }})
            .then((response)=>{
                if (response.status === 200) {
                    if (response.data) {
                        console.log(response.data);
                        setNotReadChatCount(response.data);
                    }
                }
            })
        }
        getNotReadChatCount();
    })
    console.log(notReadChatCount);
    return(
        <>
        {chatInfo.participant1 === user ? 
            <Link to={`/chat/${chatInfo.chatroomID}?chatroomID=${chatInfo.chatroomID}&sender=${chatInfo.participant1}&recipient=${chatInfo.participant2}`}>
                <li>
                    <div style={{width: "500px", height: "200px", border: "2px solid red"}}>
                        <p>상대방 : {chatInfo.participant2}</p>
                        {notReadChatCount > 0 ? <small>읽지 않은 메세지 {notReadChatCount}</small> : null}
                    </div>
                </li>
            </Link>
            :
            <Link to={`/chat/${chatInfo.chatroomID}?chatroomID=${chatInfo.chatroomID}&sender=${chatInfo.participant2}&recipient=${chatInfo.participant1}`}>
                <li style={{width: "500px", height: "200px", border: "2px solid red"}}>
                    <div>
                        <h2>채팅방 ID: {chatInfo.chatroomID}</h2>
                        <p>상대방 : {chatInfo.participant1}</p>
                        {notReadChatCount > 0 ? <small>읽지 않은 메세지 {notReadChatCount}</small> : null}
                    </div>
                </li>
            </Link>
        }    
        </>
        )
}

const ChatroomList = ({chatInfoList, user}) => {
    console.log("출력컴포넌트 >> ",chatInfoList)
    return(
        <ul>
            {chatInfoList.map((chatInfo, index)=>
                <ChatroomInfo chatInfo={chatInfo} user={user}/>
            )}
        </ul>
    );
}

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
    console.log(chatInfoList);
    return(
        <div>
            <h1>메시지 페이지</h1>
            { !chatInfoList ? 
            <h2>채팅내역이 존재하지 않습니다.</h2>
            :
            <ChatroomList chatInfoList={chatInfoList} user={cookie.USER_ID} />
        }   
        </div>
    )
}

export default ChatroomHome;