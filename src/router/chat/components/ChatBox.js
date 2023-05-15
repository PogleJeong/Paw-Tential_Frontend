import { styled, keyframes } from 'styled-components';


const ChatBox = styled.div`
    margin: 5px, 0px;
    padding: 5px;
    border: none;
    border-radius: 10px;
    box-shadow: 2px 3px 5px 0px;
`;

const MyChatBox = styled(ChatBox)`
    text-align: left;
    background-color: white;
`;

const OtherChatBox = styled(ChatBox)`
    text-align: right;
    background-color: skyblue;
`;

const Nickname = styled.h4`
    padding: 3px 10px;
    font-size: 18px;
    font-weight: bold;
`

const ChatContent = styled.span`
    display: block;
    padding: 5px 10px;
    font-size: 18px;
    color: black;
    
`

export const MyChat = ({chat}) => {
    return(
        <MyChatBox>
            <Nickname>나</Nickname>
            <ChatContent>{chat.message}</ChatContent>
            <small>{chat.sendDate}</small>
        </MyChatBox>
    );
}

export const OtherChat = ({chat, otherNick}) => {
    return(
        <OtherChatBox>
            <Nickname>{otherNick}</Nickname>
            <ChatContent>{chat.message}</ChatContent>
            <small>{chat.sendDate}</small>
        </OtherChatBox>
    )
}