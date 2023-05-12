import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

import activeHeartIcon from "../../../image/icon/active_heart.png"
import inactiveHeartIcon from "../../../image/icon/inactive_heart.png"
import viewIcon from "../../../image/icon/view_icon.png";

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
        <div style={{margin : "30px", padding: "10px", width: "330px", aspectRatio: "3/4", border: "5px solid black", borderRadius: "15px"}}>
            {/* 가로 330 세로 440 */}
            <Link to={`/market/detail/${marketInfo.posting}`} state={{marketInfo, imgInfo}}>
                <img src={`data:image/jpeg;base64,${imgInfo}`} style={{width: "300px", height: "300px", borderRadius: "15px"}} />
            </Link>
            <div>
                <h4>{marketInfo.title}</h4>
                <small>작성자: {writer}</small><br/>
                <small>{marketInfo.state}/{marketInfo.category}</small>
                {likeHistroy ? 
                <img src={activeHeartIcon} onClick={clickLike} alt="" style={{width: "30px", height: "30px"}}/>
                :
                <img src={inactiveHeartIcon} onClick={clickLike} alt="" style={{width: "30px", height: "30px"}}/>
                }
                <span style={{paddingLeft: "3px", paddingRight: "10px"}}>{likeNumber}</span>
                <img src={viewIcon} alt="" style={{width:"30px", height: "30px"}} />
                <span style={{paddingLeft: "3px", paddingRight: "10px"}}>{viewNumber}</span>
            </div>
        </div>
    );
}

// 특정 스크롤 위치에 따라 market list 가 추가됨. 
const MarketList = ({marketInfoList}) => {
    console.log("컴포넌트내", marketInfoList);
    return(
        <div style={{display: "flex", width: "1800px", flexWrap: "wrap"}}>
            
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