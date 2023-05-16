import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { styled, keyframes } from 'styled-components';


const ChatInfoBox = styled.li`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
    margin: 20px 0px;
    border: none;
    border-radius: 10px;
    box-shadow: 2px 3px 5px 2px;
`;

const Profile = styled.img`
    min-width: 75px;
    height: 75px;
    border: none;
    border-radius: 100px;
`

const Nickname = styled.span`
    display: inline-block;
    min-width: 150px;
    margin: 5px 20px;
    font-size: 12px;
`;

const NoReadCount = styled.span`
    display: inline-block;
    min-width: 80px;
    font-size: 12px;
`;



const ChatroomInfo = ({chatInfo, user}) => {
    const [ notReadChatCount, setNotReadChatCount ] = useState(0);
    const [ othersNick, setOthersNick ] = useState("");
    const [ profile, setProfile ] = useState("");
    useEffect(()=>{
        const getNotReadChatCount = async() => {
            await axios.post("http://localhost:3000/chat/getNotReadChatCount", null, {params: {
                chatroomID: chatInfo.chatroomID,
                recipient: user
            }})
            .then((response)=>{
                if (response.status === 200) {
                    if (response.data) {
                        setNotReadChatCount(response.data);
                    }
                }
            })
        }

        const getNickname = async() => {
            await axios.post("http://localhost:3000/get/nickname", null, {params: {id: chatInfo.participant1 === user? chatInfo.participant2 : chatInfo.participant1}})
            .then((response)=> {
                if (response.status === 200) {
                    if (response.data) {
                        setOthersNick(response.data)
                    }
                }
            })
        }

        const getProfile = async() => {
            await axios.post("http://localhost:3000/get/profile", null, { params: {id: chatInfo.participant1 === user? chatInfo.participant2 : chatInfo.participant1}})
            .then((response)=>{
                if (response.status === 200) {
                    if (response.data) {
                        setProfile(response.data.profile);
                        return;
                    }
                }
            })
        }
        getNotReadChatCount();
        getNickname();
        getProfile();
    })


    return(
        <>
        {chatInfo.participant1 === user ? 
            <Link to={`/chat/${chatInfo.chatroomID}`} state={{chatroomID: chatInfo.chatroomID, sender: chatInfo.participant1, recipient: chatInfo.participant2}}>
                <ChatInfoBox>
                    <Profile src={`data:image/jpeg;base64,${profile}`} alt="" />
                    <Nickname>{othersNick}</Nickname><br/>
                    {notReadChatCount > 0 ? <small>읽지 않은 메세지 {notReadChatCount}</small> : null}
                </ChatInfoBox>
            </Link>
            :
            <Link to={`/chat/${chatInfo.chatroomID}`} state={{chatroomID: chatInfo.chatroomID, sender: chatInfo.participant2, recipient: chatInfo.participant1}}>
                <ChatInfoBox>
                    <Profile src={`data:image/jpeg;base64,${profile}`} alt="" />
                    <Nickname>{othersNick}</Nickname><br/>
                    <NoReadCount>
                        {notReadChatCount > 0 ? <small>읽지않은 메세지: {notReadChatCount}</small>  : null}
                    </NoReadCount>
                </ChatInfoBox>
            </Link>
        }    
        </>
        )
}

export default ChatroomInfo;