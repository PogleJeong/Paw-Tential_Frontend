import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import session from "react-session-api";
import MarketHome from "../router/market/Market_home";

import activeHeartIcon from "../image/icon/active_heart.png"
import inactiveHeartIcon from "../image/icon/inactive_heart.png"
import viewIcon from "../image/icon/view_icon.png";

// 이중 리트스 생성
const wrapperTo2Arrays = (array1, array2) =>{
    let crossArray = []
    for (let i=0; i<array1.length; i++) {
        crossArray.push([array1[i], array2[i]])
    }
    console.log("함수결과 >> ",crossArray);
    return crossArray;
}

const MarketInfo = ({marketInfo, imgInfo}) => {
    const [ likeHistroy, setLikeHistory ] = useState(false);
    const [ viewNumber, setViewNumber ] = useState(0);
    const [ likeNumber, setLikeNumber ] = useState(0);

    const navigate = useNavigate();
    // 처음 랜더링 될때 해당 게시물에 좋아요 유무에 따라 아이콘 다름
    useEffect(()=>{
        const loginUser = session.get("user") || false;
        if (!loginUser) {
            alert("로그인 먼저 해주세요!");
            navigate("/");
            return;
        }
        const posting = marketInfo.posting;
        callLike(loginUser, posting);
        callView(loginUser, posting);
    },[])

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
        const loginUser = session.get("user");
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
        <div style={{margin : "10px", border: "5px solid black", borderRadius: "15px"}}>
            <Link to={`/market/detail/${marketInfo.posting}`} state={{marketInfo, imgInfo}}>
                <img src={`data:image/jpeg;base64,${imgInfo}`} style={{width: "300px", height: "300px", borderRadius: "15px"}} />
            </Link>
            <div>
                <h4>{marketInfo.title}</h4>
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
const MarketList = ({marketInfoList, setMarketInfoList}) => {
    useEffect(()=>{
        callMarketInfo();
    },[]);

    // 스크롤 위치가 스크롤 끝에 닿는다면 데이터 더 불러옴.
    const callMarketInfo = async (pages=4) => {
        await axios.post("http://localhost:3000/market", null, { params: { pages }}) // 처음에는 4줄
        .then((response) => {
            if(response.status === 200){

                let marketInfo = response.data.marketInfoList;
                let imageInfo = response.data.imageList;
                console.log("마켓정보 >> ", marketInfo);
                console.log("이미지정보 >> ",imageInfo);
                let addMarketInfoList = wrapperTo2Arrays(marketInfo, imageInfo);
                setMarketInfoList([...addMarketInfoList]);
            }
        })
    }

    const overScroll = (event) => {
        let currentScroll = event.target.scrollTop;
        let scrollEndPoint = event.target.scrollHeight;
        
        if (currentScroll >= scrollEndPoint) {
            let pages = scrollEndPoint / 1000; // height 200에 1 line 게시물
            callMarketInfo(pages);
        }
    }
    return(
        <div onScroll={overScroll} style={{display: "flex", width: "1500px", flexWrap: "wrap"}}>
            
            {marketInfoList.length !== 0 ? 
            (marketInfoList.map((marketInfo, index)=>(
               <MarketInfo key={index} marketInfo={marketInfo[0]} imgInfo={marketInfo[1]} /> 
            )))
            :
            (<p>검색결과 없음</p>)}
        </div>
     
    );
}

export default MarketList;