import { useState } from "react";
import MarketList from "../../component/Market";

const saleStateContent = ["전체","나눔","판매"];
const selectOptionList = ["전체","제목","내용"];

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

    return {
        selectedOption,
        changeOption: onChange
    }
    
}

const useInput = (initialValue, validation) => {
    const [ value, setValue ] = useState(initialValue); 
    if (!validation) {

    }
    const changeInput = (event) => {
        setValue(event.target.value);
    }
    return { value, changeInput };

}

// 무한루프 -> onclick 에 함수를 애로우함수로 작성
const MarketHome = () => {
    const { activedTab, changeTab } = useSaleStateTabs(0, saleStateContent);
    const { selectedOption, changeOption } = useSelect("전체");
    const { value, changeInput} = useInput("", null);
    return(
        <div>
            <div>
                {saleStateContent.map((state, index)=>
                (<button onClick={()=>changeTab(index)}>{state}</button>))}
            </div>
            <div>
                <select value={selectedOption} onChange={changeOption}>
                    {selectOptionList.map((option, index) => (
                        <option key={index} value={option}>{option}</option>))}
                </select>
            </div>
            <div>
                <input type="text" onChange={changeInput} value={value} />
                <button id="searchBtn">찾기</button>
            </div>
            <MarketList tabs={activedTab} select={selectedOption} search={value} />
        </div>
    );
}

export default MarketHome;