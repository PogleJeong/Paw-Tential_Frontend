import { useEffect, useState, useRef } from "react";
import { useLocation, Link , useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { styled, keyframes } from 'styled-components';

import KakaoMapRead from "./components/GeoAPI2";
import MarketReport from "./modals/MarketReport";
import './style/style.css';

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

    margin: 10px 10%;
    padding: 100px;
    width: 80%;
    height: 1900px;

    animation: ${fadeIn} 2s;
`;

const Wrappers = styled.div`
    width: 1000px;
    height: 1500px;
    padding: 50px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 2px 3px 5px 0px;
`;

const UserSelfWrapper = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;
    margin: 20px 0px;
`

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ImageBox= styled.div`
    width: 450px;
    height: 430px;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 30px;
    text-align: center;
    margin-bottom: 10px;
    padding: 20px;
    border-bottom: 3px solid black;
    
    color: black;
`;

const Thumbnail = styled.img`
    width: 450px;
    height: 400px;
    border: 5px solid whitesmoke;
`;


const InfoBox = styled.div`

    width: 450px;
    height: 430px;
    padding: 60px 30px;
`;

const MsgBox = styled.span`
    display: inline-block;
    width: 100%;
    height: 40px;
    font-size: 15px;
    color: black;
`;

const SelectBox = styled.select`
    width: 100px;
    height: 40px;
    margin: 5px;
    border: none;
    border-bottom: 2px solid black;
    text-align: center;

    &:focus {
        background-color: rgba(255, 207, 159, 0.4);
    }
`;

const BodyWrapper = styled.div`
    padding: 30px;
    width: 100%;
    height: 450px;
    background-color: rgba(248,247,211,0.35);
`;

const FooterWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const ChatBtn = styled.button`
    width: 200px;
    height: 80px;
    margin: 0px 60px;
    border: none;
    border-radius: 10px;
    background-color: tomato;
    transition: background-color 2s,color 2s, scale 1s;
    &:hover {
        background-color: black;
        color: white;
    }
    &:active {
        scale: 0.9;
    }
`;

const OptionBtn = styled.button`
    width: 80px;
    height: 30px;
    margin: 5px 10px;
    border: none;
    border-radius: 10px;
    color: white;

    transition: background-color 2s;
    &:hover {
        background-color: gray;
    }
`

const DeleteBtn = styled(OptionBtn)`
    background-color: rgba(86, 108, 175, 0.8);

`

const UpdateBtn = styled(OptionBtn)`
    background-color: rgba(255, 155, 71, 0.5);
`

const ReportBtn = styled(OptionBtn)`
    background-color: rgba(255, 155, 175, 0.5);
`

const MarketDetail = () => {
    const location = useLocation();
    const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID","USER_NICKNAME"]);
    
    const { title, content, wdate, id, category, price ,state, conditions, productName, productNumber, geoLat, geoLng, posting } = location.state.marketInfo;
    const [ nickname, setNickname ] = useState("");
    const imgInfo  = location.state.imgInfo;
    const [ activeReportModal, setActiveReportModal ] = useState(false);
    const [ updateActive, setUpdateActive ] = useState(false);
    const addrRef = useRef();

    const navigate = useNavigate();

    useEffect(()=>{
        // 자신이 작성한 글일경우, 수정하기 및 삭제하기 기능 활성화
        const loginUser = cookies.USER_ID || false;

        if (loginUser === id) {
            setUpdateActive(true);
        }
        // 게시물 조회수 : 이미 본 유저와 아닌 유저를 검사하여 추가
        (async()=> await axios.post("http://localhost:3000/market/view/add", null, {params: {id: loginUser, posting}}))();
        (async()=> await axios.post("http://localhost:3000/get/nickname", null, {params: {id}})
        .then(response => {
            if (response.status === 200) {
                if (response.data){
                    setNickname(response.data);
                }
            }
        }))();
    })

    const marketDelete = async() => {
        const loginUser = cookies.USER_ID || false;

        await axios.post("http://localhost:3000/market/delete", null, {params: { id: loginUser, posting }})
        .then((response)=>{
            if (response.status === 200) {
                if (response.data === "MARKET_DELETE_OK") {
                    alert("게시물이 삭제되었습니다.")
                    navigate("/market");
                    return;
                }
                if (response.data === "MARKET_DELETE_NO") {
                    alert("게시물 삭제에 실패하였습니다.");
                }
            }
            if (response.status === 500) {
                alert("서버통신오류.");
                return;
            }
        })
    }

    const clickReportBtn = () => {
        setActiveReportModal(true);
    }

    const enterChat = async() => {
        // 서버에서 처리.
        await axios.post("http://localhost:3000/createChat",null, {params: {
            sender: cookies.USER_ID,
            recipient: id,
        }})
        .then((response)=> {
            if (response.status == 200) {
                if (response.data){
                    const { chatroomID, sender, recipient } = response.data;
                    navigate(`/chat/${chatroomID}`, {
                        state: {chatroomID, sender, recipient}
                        }
                    )
                }
            }
        });
    }
    return(

        <Container>
            <Wrappers>
                <Title>{title}</Title>
                <UserSelfWrapper>
                {updateActive ? 
                    <>
                        <Link to={`/market/update/${posting}`} state={location.state} ><UpdateBtn>수정하기</UpdateBtn></Link> 
                        <DeleteBtn onClick={marketDelete}>삭제하기</DeleteBtn>
                    </>
                    : 
                    null}
                <ReportBtn onClick={clickReportBtn} >신고</ReportBtn>
                </UserSelfWrapper> 
                <HeaderWrapper>
                    <ImageBox>
                        <Thumbnail src={`data:image/jpeg;base64,${imgInfo}`} alt="" /><br/>
                    </ImageBox>
                    <InfoBox>
                       
                        <MsgBox>&nbsp;&nbsp;작성자 &nbsp;&nbsp;| &nbsp; {`${nickname}`}</MsgBox>
                        <MsgBox>작성날짜  | &nbsp; {wdate}</MsgBox>
                        <MsgBox>&nbsp;&nbsp;제품명 &nbsp;&nbsp;| &nbsp; {productName}</MsgBox>
                        <MsgBox>제품개수 | &nbsp; {productNumber}개</MsgBox>
                        <MsgBox>제품분류 | &nbsp; {category}</MsgBox>
                        {price ? <MsgBox>제품가격 | &nbsp; {category}원</MsgBox> : null}
                        <MsgBox>제품상태 | &nbsp; {conditions}</MsgBox>
                        <MsgBox>주소 | &nbsp;</MsgBox><MsgBox ref={addrRef}></MsgBox>
                        
                    </InfoBox>
                </HeaderWrapper>
                <BodyWrapper dangerouslySetInnerHTML={{__html: `${content}`}}>
                </BodyWrapper>
                <FooterWrapper>
                    { cookies.USER_ID !== id ? <ChatBtn onClick={enterChat}>판매자와 채팅하기</ChatBtn> : null}
                    
                    <KakaoMapRead addrRef={addrRef} geoLat={geoLat} geoLng={geoLng}/>
                </FooterWrapper>
            </Wrappers>
            
            {activeReportModal ?
            <MarketReport writer={id} market_seq={posting} setActiveReportModal={setActiveReportModal}/> : null}
        </Container>
    );
}

export default MarketDetail;