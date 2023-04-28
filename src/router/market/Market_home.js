import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import session from "react-session-api";

import MarketList from "../../component/Market";


const saleStateContent = ["전체","나눔","판매"];
const selectOptionList = ["전체","제목","내용","카테고리","제품상태"];

// 이중 리트스 생성
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

// 무한루프 -> onclick 에 함수를 애로우함수로 작성
const MarketHome = () => {
    const [ marketInfoList, setMarketInfoList ] = useState([]);
    const { activedTab, changeTab } = useSaleStateTabs(0, saleStateContent);
    const selectedOption = useSelect("전체");
    const searchWord = useInput("", maxLen, 10);
    const navigator = useNavigate();
    
    useEffect(()=> {
        const loginUser = session.get("user") || false;
        if (!loginUser) {
            alert("로그인 먼저 해주세요!");
            navigator("/");
            return;
        }
    })
    const searchMarket = async() => {
        if (!searchWord.value) {
            alert("검색어를 입력해주세요");
            return;
        }
        if (!selectedOption) {
            alert("검색옵션을 선택해주세요");
            return;
        }
        await axios.post("http://localhost:3000/searchMarket", null, {params: {
            selectedOption: selectedOption.value,
            searchWord: searchWord.value,
            page: 8
        }})
        .then(response => {
            let marketInfo = response.data.marketInfoList;
            let imageInfo = response.data.imageList;
            let addMarketInfoList = wrapperTo2Arrays(marketInfo, imageInfo);
            setMarketInfoList([]);
            setMarketInfoList([...addMarketInfoList]);
        });
    }
    const writeMarketContent = () => {
        navigator("/market/write");
    }
    return(
        <div>
            <div>
                {saleStateContent.map((state, index)=>
                (<button onClick={()=>changeTab(index)}>{state}</button>))}
            </div>
            <select {...selectedOption}>
                {selectOptionList.map((option, index) => (
                    <option key={index} value={option}>{option}</option>))}
            </select>
            <input type="text" {...searchWord} />
            <button onClick={searchMarket}>찾기</button>
            
            <div>
                <button onClick={writeMarketContent}>글쓰기</button>
            </div>
            <MarketList marketInfoList={marketInfoList} setMarketInfoList={setMarketInfoList} />
        </div>
    );
}

export default MarketHome;