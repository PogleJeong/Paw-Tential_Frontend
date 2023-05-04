import { useEffect, useState } from "react";
import { useLocation ,useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

//import session from "react-session-api";

import MarketList from "./components/Market";
import DetailSearch from "./components/DetailSearch";

const saleStateContent = ["전체","나눔","판매"];
const selectOptionList = ["전체","제목","내용","카테고리","제품상태"];

// 이중 리스트 생성
const wrapperTo2Arrays = (array1, array2) =>{
    let crossArray = []
    for (let i=0; i<array1.length; i++) {
        crossArray.push([array1[i], array2[i]])
    }
    console.log("함수결과 >> ",crossArray);
    return crossArray;
}

const maxLen = (value, max) => value.length <= max;

const useSaleStateTabs = (initialState, content) => {
    const [ activedTabIndex, setActivedTabIndex ] = useState(initialState);
    
    return { activedTab : content[activedTabIndex],
            changeTab: setActivedTabIndex};
}

const useSelect = (initialOption) => {
    const [ selectedOption, setSeletedOption ] = useState(initialOption);
    const onChange = (event) => {
        setSeletedOption(event.currentTarget.value);
    }
    return { value: selectedOption, onChange }
}

const useInput = (initialValue, validation, valid) => {
    const [ value, setValue ] = useState(initialValue); 
  
    const onChange = (event) => {
        const value = event.currentTarget.value;
        let willUpdate = true;
        if (typeof validation === "function"){
            willUpdate = validation(value, valid);
            if (willUpdate) {
                setValue(value);
            }
        }
    }
    return { value, onChange };
}

// 스크롤 이벤트 성능저하 방지를 위한 쓰로틀
const throttle =(callback) => {
    let throttle;
    return()=>{
        if (throttle) return;
        throttle = setTimeout(()=> {
            throttle = null;
            callback();
        },2000);
    };
};

// 무한루프 -> onclick 에 함수를 애로우함수로 작성
// 소셜로그인시 useLocation 으로 값 가져오기
const MarketHome = () => {
    const { search }  = useLocation();
    const [ searchParams, setSearchParams ] = useSearchParams(); 
    const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID","USER_NICKNAME"]);
    const [ marketInfoList, setMarketInfoList ] = useState([]);
    const { activedTab, changeTab } = useSaleStateTabs(0, saleStateContent);
    const selectedOption = useSelect("전체");
    const searchWord = useInput("", maxLen, 10);
    const navigate = useNavigate();
    const [ pages, setPages ] = useState(0);
    const [ maxScroll, setMaxScroll ] = useState(1700);
    
    useEffect(()=> {
        console.log(search);
        // 만약 소셜로그인을 통했을 시, url 에 search 가 존재
        const USER_ID = searchParams.get("USER_ID");
        const USER_NICKNAME = searchParams.get("USER_NICKNAME");

        const saveIntoCookie = async(id, nickname) => {
            await setCookies("USER_ID", USER_ID, {path:"/", maxAge: 3600});
        }
        if (search) {
            setCookies("USER_ID", USER_ID, {path:"/", maxAge: 3600});
            setCookies("USER_NICKNAME", USER_NICKNAME, {path:"/", maxAge: 3600});
        }
        // js 는 비동기로 작동하므로 setCookie 가 완료되기 전에 cookies 를 봄. (처리해야함..)
        setTimeout(function(){
            console.log(cookies)
            if (!cookies.USER_ID) {
                alert("로그인 후 이용해주세요.");
                navigate("/");
            }
        },1000);
        

        callMarketInfo("search");
        // 스크롤 이벤트 추가
        window.addEventListener("scroll",throttle(scrollFunction));
        return ()=>{
            window.removeEventListener("scroll",throttle(scrollFunction))
        }
    },[])

    useEffect(()=>{
        if (maxScroll <= window.scrollY) {
            callMarketInfo("scroll");
        }
    },[marketInfoList]);
    
    
    /* const searchMarket = async() => {
        // 검색버튼 누르면 기존의 게시물데이터를 초기화 시킴
        //setMarketInfoList([]);
        
        await axios.post("http://localhost:3000/searchMarket", null, {params: {
            selectedOption: selectedOption.value,
            searchWord: searchWord.value,
            pages,
        }})
        .then(response => {
            let marketInfo = response.data.marketInfoList;
            let imageInfo = response.data.imageList;
            let addMarketInfoList = wrapperTo2Arrays(marketInfo, imageInfo);
            setMarketInfoList([]);
            setMarketInfoList(addMarketInfoList);
        });
    } */

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
                        console.log(marketInfoList);
                        console.log(addMarketInfoList);
                        console.log([...marketInfoList, ...addMarketInfoList]);
                        setMarketInfoList(marketInfoList => [...marketInfoList, ...addMarketInfoList]);

                        // 스크롤 조정 : 1줄 당 440px 의 높이를 가지고 있으며 1줄에 4개의 게시물.
                        setMaxScroll(maxScroll => maxScroll + (addMarketInfoList.length / 4 * 440)) 
                        setPages(pages => pages + 20); // 20개씩 추가;
                    }
                    // 검색기능을 통해 새로 가져올때.
                    if(option === "search") {
                        console.log("검색기능을 통해 가져온 게시물입니다.");
                        setMarketInfoList(addMarketInfoList);
                        setMaxScroll(1700);
                        setPages(0);
                    }
                }
            }
        })    
    }
    console.log(marketInfoList);
    console.log("max scroll:", maxScroll);
    console.log("pages", pages);

    /* const clickSearch = (index) => {
        if (index) {
            console.log(index);
            console.log(saleStateContent[index]);
            changeTab(index);
        }
        setMarketInfoList([]); // 기존데이터 초기화
        setPages(0);
        callMarketInfo();
    } */

    // 만약 스크롤 위치가 끝에 다다르면 마켓데이터 추가
    // 임시 1800에 다다르면
    // setState 는 비동기로 작동하므로 async 사용;
    const scrollFunction = () => {
        console.log("스크롤 이벤트함수 ::", maxScroll, window.scrollY);
        if (maxScroll <= window.scrollY) {
            callMarketInfo("scroll");
        }
    }

    return(
        <div>
            <div>
                {saleStateContent.map((state, index)=>
                (<button onClick={null}>{state}</button>))}
            </div>
            <select {...selectedOption}>
                {selectOptionList.map((option, index) => (
                    <option key={index} value={option}>{option}</option>))}
            </select>
            <input type="text" {...searchWord} />
            <button onClick={()=>callMarketInfo("search")}>찾기</button>
            
            <div>
                <Link to="/market/write">글쓰기</Link>
            </div>
            <MarketList 
                activedTab={activedTab}
                selectedOption={selectedOption.value}
                searchWord={searchWord}
                marketInfoList={marketInfoList} 
            />
        </div>
    );
}

export default MarketHome;