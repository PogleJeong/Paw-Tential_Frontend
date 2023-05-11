import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { styled, keyframes } from "styled-components";

import MarketList from "./components/Market";

import { maxLen, useInput, useSaleStateTabs, useSelect, throttle, wrapperTo2Arrays } from "../../utils/UseHook";

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
    width: 80%;
    min-height: 800px;
    padding: 50px;
    animation: ${fadeIn} 2s;
`;

const Wrapper = styled.div`
    width: 100%;
    min-height: inherit;
    margin: 0px;
    background-color: white;
    border-radius: 15px;
    box-shadow: 2px 3px 5px 0px;
`;

const Title = styled.h1`
    font-size: 30px;
    text-align: center;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const SearchWrapper = styled.div`
    display: flex;
    justify-content: right;
    align-items: center;

    padding-right: 20px;
    width: 100%;
    height: 60px;
    background-color: tomato;
    border-radius: 15px;
`;

const SelectBox = styled.select`
    border: none;
    border-radius: 10px;
    margin-right: 5px;
    padding-left: 5px;
    width: 80px;
    height: 30px;
`
const SearchBox = styled.input`
    width: 200px;
    height: 30px;
    padding-left: 10px;
    margin-right: 5px;
    border: none;
    border-radius: 10px;
    border-bottom: 2px soild black;
`
const SearchBtn = styled.button`
    width: 50px;
    height: 30px;
    border: none;
    border-radius: 5px;
    background-color: #66FFCC;

    &:hover {
        transform: scale(0.95) 1s;
    }
`

const MarketWriteBtn = styled.button`
    width: 100px;
    height: 40px;
    border: none;
    margin: 20px;
    background-color: #FF9933;
`;

const saleStateContent = ["전체","나눔","판매"];
const selectOptionList = ["전체","제목","내용","카테고리","제품상태"];

const MarketHome = () => {
    const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID","USER_NICKNAME"]);
    const [ marketInfoList, setMarketInfoList ] = useState([]);
    // const { activedTab, changeTab } = useSaleStateTabs(0, saleStateContent);
    const selectedOption = useSelect("전체");
    const searchWord = useInput("", maxLen, 30);
    const [ pages, setPages ] = useState(0);
    const [ filterMarketInfoList, setFilterMarketInfoList ] = useState([]);
    const [ filterOn, setFliterOn ] = useState(false);
    
    const navigate = useNavigate();
    useEffect(()=> {
        console.log(cookies);
        if (!cookies.USER_ID) {
            alert("로그인 후 이용해주세요.");
            navigate("/");
            return;
        }
        callMarketInfo("search");

        window.addEventListener("scroll",throttle(scrollFunction));
        return ()=>{
            window.removeEventListener("scroll",throttle(scrollFunction))
        }
    })

    useEffect(()=>{
        callMarketInfo("scroll");
    },[pages])

    // 스크롤 이벤트 추가
    const scrollFunction = () => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        console.log(scrollHeight, scrollTop, clientHeight);
        if (scrollTop + clientHeight >= scrollHeight-100) {
            console.log("끝에 도달")
            setPages(pages => pages+20);
        }
    }

    const filterByState = (array, state) => {
        if (state === "전체") {
            setFliterOn(false);
            return;
        }
        const result = array.filter(item => item[0].state === state);
        setFilterMarketInfoList(result);
        setFliterOn(true);
    }

    // 스크롤 위치가 스크롤 끝에 닿는다면 데이터 더 불러옴.
    const callMarketInfo = async (option="search") => {
        
        await axios.post("http://localhost:3000/searchMarket", null, { params: { 
            selectedOption: selectedOption.value,
            searchWord: searchWord.value,
            pages: option === "search" ? 0 : pages,
        }}) // 처음에는 20ro
        .then((response) => {
            if(response.status === 200){
                if (response.data.marketInfoList.length) {
                    let marketInfo = response.data.marketInfoList;
                    let imageInfo = response.data.imageList;
                    let addMarketInfoList = wrapperTo2Arrays(marketInfo, imageInfo);
                    // 스크롤을 통해 더 많은 정보를 가져올때
                    if(option === "scroll") {
                        console.log("무한 스크롤기능을 통해 가져온 게시물입니다.");
                        console.log("add marketInfoList.length >>",addMarketInfoList.length);
                        console.log("기존에 있던 게시물 리스트 >> ",marketInfoList);
                        console.log("추가로 가져온 게시물 리스트 >> ",addMarketInfoList);
                        console.log([...marketInfoList, ...addMarketInfoList]);
                        setMarketInfoList(marketInfoList => marketInfoList.concat(addMarketInfoList));
                    }
                    // 검색기능을 통해 새로 가져올때.
                    if(option === "search") {
                        console.log("검색기능을 통해 가져온 게시물입니다.");
                        setMarketInfoList(addMarketInfoList);
                    }
                }
            }
        })    
    }

    return(
        <Container>
            <Wrapper>
                <Title>Welcome to Paw-tential market!</Title>
                   {/*  <ul style={{display: "flex"}}>
                    {saleStateContent.map((state, index)=>    
                    (<li key={index} onClick={()=>filterByState(marketInfoList,state)} style={{border: "2px solid gray", padding: "10px", width: "30px", aspectRatio: "4/1"}} >{state}</li>))}
                    </ul>
                    
                    <Link to="/market/write"><MarketWriteBtn>마켓 등록하기</MarketWriteBtn></Link> */}
                    
                    
                <SearchWrapper>
                    <SelectBox {...selectedOption}>
                        {selectOptionList.map((option, index) => (
                            <option key={index} value={option}>{option}</option>))}
                    </SelectBox>
                    <SearchBox {...searchWord} />
                    <SearchBtn onClick={()=>callMarketInfo("search")}>찾기</SearchBtn>
                    <Link to="/market/write"><MarketWriteBtn>마켓 등록하기</MarketWriteBtn></Link> 
                </SearchWrapper>
                
                {filterOn ?
                <MarketList marketInfoList={filterMarketInfoList} />
                :
                <MarketList marketInfoList={marketInfoList} />
                }
            </Wrapper>
        </Container>
    );
}

export default MarketHome;