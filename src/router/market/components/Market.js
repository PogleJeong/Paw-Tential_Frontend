import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { styled } from 'styled-components';

import activeHeartIcon from "../../../image/icon/active_heart.png"
import inactiveHeartIcon from "../../../image/icon/inactive_heart.png"
import viewIcon from "../../../image/icon/view_icon.png";

const Container =styled.div`
    margin : 15px;
    padding: 15px; 
    width: 18%; 
    aspect-ratio: 3/4; 
    border: none; 
    border-radius: 15px;
    box-shadow: 2px 3px 5px 3px;

    transition: scale 1s;
    &:hover {
        scale: 0.95;
    }
`

const ImageBox = styled.img`
    width: 100%;
    height: 300px;
    border: 5px solid whitesmoke;
    border-radius: 15px;
`

const InfoBox = styled.div`
`
const SubInfoBox = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 5px;
`

const IconBox = styled.div`
    display: flex;
    justify-content: right;
    margin: 5px;
`

const Title = styled.h4`
    margin: 5px;
`
const Content = styled.small`
`

const Icon = styled.img`
    width: 30px;
    height: 30px;
`

const IconNumber = styled.small`
    vertical-align: middle;
    font-size: 15px;
    font-weight: bold;
    padding-left: 3px;
    padding-right: 5px;
`

const MarketInfo = ({marketInfo, imgInfo}) => {
    const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID", "USER_NICKNAME"]);
    const [ writer, setWriter ] = useState("");
    const [ likeHistroy, setLikeHistory ] = useState(false);
    const [ viewNumber, setViewNumber ] = useState(0);
    const [ likeNumber, setLikeNumber ] = useState(0);

    // 처음 랜더링 될때 해당 게시물에 좋아요 유무에 따라 아이콘 다름
    useEffect(()=>{
        const loginUser = cookies.USER_ID;
        const writer = marketInfo.id;
        const posting = marketInfo.posting;
        callNickname(writer);
        callLike(loginUser, posting);
        callView(loginUser, posting);
    },[])

    const callNickname = async(writer) => {
        await axios.post("http://localhost:3000/get/nickname", null,{params: {id: writer}})
        .then((response) => {
            if (response.status === 200) {
                setWriter(response.data);
            }
        })
    }

    const callLike = async(loginUser, posting) => {
        await axios.post("http://localhost:3000/market/like", null, {params: {
            loginUser,
            posting
        }})
        .then((response)=>{
            if(!response.data){
                setLikeHistory(false);
                return;
            }
            response.data.clicked ? setLikeHistory(true) : setLikeHistory(false);
            setLikeNumber(response.data.like);
            return;
        });
    };

    const callView = async(loginUser, posting) => {
  
        await axios.post("http://localhost:3000/market/view/print", null, {params: {id: loginUser, posting}})
        .then((response)=> {
            if (response.status === 200) {
                setViewNumber(response.data);
                return;
            }
            if (response.status === 500) {
                alert("서버에러");
                return;
            }
        })
    }

    const clickLike = async() => {
        // hook 이 실행되기전에 함수가 선언되기 때문에 지역변수로 정의해주어야함
        const loginUser = cookies.USER_ID;
        const like = likeHistroy;

        await axios.post("http://localhost:3000/market/like/click", null, {params: {
            loginUser,
            posting: marketInfo.posting,
            like
        }})
        .then((response) => {
            if (!response.data){
                alert("좋아요 기능 에러발생");
                return;
            }

            response.data.message === "LIKE_ADD_OK" ? setLikeHistory(true) : setLikeHistory(false);
            setLikeNumber(response.data.likeNumber);
        });
    }

    return(
        <Container>
            {/* 가로 330 세로 440 */}
            <Link to={`/market/detail/${marketInfo.posting}`} state={{marketInfo, imgInfo}}>
                <ImageBox src={`data:image/jpeg;base64,${imgInfo}`} />
            </Link>
            <InfoBox>
                <Title>{marketInfo.title.length < 10 ? marketInfo.title : `${marketInfo.title?.substring(0,10)}...`}</Title>
                <SubInfoBox>
                <Content>작성자: {writer}</Content>
                <Content>{marketInfo.state}/{marketInfo.category}</Content>
                </SubInfoBox>
                <IconBox>
                {likeHistroy ? 
                    <Icon src={activeHeartIcon} onClick={clickLike} alt="" />
                    :
                    <Icon src={inactiveHeartIcon} onClick={clickLike} alt="" />
                    }
                    <IconNumber>{likeNumber}</IconNumber>
                    <Icon src={viewIcon} alt="" />
                    <IconNumber>{viewNumber}</IconNumber>
                </IconBox>
            </InfoBox>
        </Container>
    );
}

// 특정 스크롤 위치에 따라 market list 가 추가됨. 
const MarketList = ({marketInfoList}) => {
    return(
        <div style={{display: "flex", width: "100%", flexWrap: "wrap"}}>

            {marketInfoList?.length ? 
            (marketInfoList.map((marketInfo, index)=>(
               <MarketInfo key={index} marketInfo={marketInfo[0]} imgInfo={marketInfo[1]} /> 
               )))
            :
            (<span>검색결과 없음</span>)}
        </div>
     
    );
}

export default React.memo(MarketList);