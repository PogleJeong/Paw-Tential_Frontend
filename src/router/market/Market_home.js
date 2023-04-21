import { useState } from "react";
import axios from "axios";

import MarketList from "../../component/Market";
import { useNavigate } from "react-router-dom";


const saleStateContent = ["전체","나눔","판매"];
const selectOptionList = ["전체","제목","내용"];

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
        const value = event.target.value;
        let willUpdate = true;
        if (typeof validation === "function"){
            willUpdate = validation(value, valid);
            if (willUpdate) {
                setValue(event.target.value);
            }
        }
    }
    return { value, onChange };
}

// 무한루프 -> onclick 에 함수를 애로우함수로 작성
const MarketHome = () => {
    const { activedTab, changeTab } = useSaleStateTabs(0, saleStateContent);
    const selectedOption = useSelect("전체");
    const searchWord = useInput("", maxLen, 10);
    const navigator = useNavigate();

    const searchMarket = async() => {
        await axios.post("http://localhost:3000/marketSearch", null, {params: {
            tab: activedTab,
            selectedOption: selectedOption.value,
            searchWord: searchWord.value,
            page: 8
        }})
        .then(response => {
            response = response.data;
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
            <div>
                <select {...selectedOption}>
                    {selectOptionList.map((option, index) => (
                        <option key={index} value={option}>{option}</option>))}
                </select>
            </div>
            <div>
                <input type="text" {...searchWord} />
                <button onClick={searchMarket}>찾기</button>
            </div>
            <div>
                <button onClick={writeMarketContent}>글쓰기</button>
            </div>
            <MarketList tabs={activedTab} select={selectedOption.value} search={searchWord.value} />
        </div>
    );
}

export default MarketHome;