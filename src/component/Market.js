import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import MarketHome from "../router/market/Market_home";

// 특정 스크롤 위치에 따라 market list 가 추가됨. 


const MarketList = ({tabs, select, search}) => {
    const [marketList, setMarketList] = useState([]);
    // 스크롤 위치가 스크롤 끝에 닿는다면 데이터 더 불러옴.
    const callMarketInfo = (pages) => {
        Axios.post("https://localhost:3000/market/getMarketList", { params: { pages }}) // 처음에는 4줄
        .then((addMarketList) => {
            setMarketList([...addMarketList]);
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
    useEffect(()=>{
        const initialPage = 4;
        callMarketInfo(initialPage);
    },[]);
    return(
        <div>
            <div onScroll={overScroll}>
                <small>검색 : {tabs}/{select}/{search}</small>
            </div>
        </div>
    );
}

export default MarketList;