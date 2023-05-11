import { useState } from "react";

/** 실시간 입력값 체크 */
export const useInput = (initValue, validator, valid) => {
    const [value, setValue] = useState(initValue);  
    const onChange = (event) => {
        const {target: { value }} = event;
        let willUpdate = true;
        if (typeof validator === "function") {
            willUpdate = validator(value, valid);
            if (willUpdate) {
                setValue(value);
            }
        }
        console.log(value);
    }
    return { value, onChange };
}

export const useSaleStateTabs = (initialState, content) => {
    const [ activedTabIndex, setActivedTabIndex ] = useState(initialState);
    
    return { activedTab : content[activedTabIndex],
            changeTab: setActivedTabIndex};
}

export const useSelect = (initialOption) => {
    const [ selectedOption, setSeletedOption ] = useState(initialOption);
    const onChange = (event) => {
        setSeletedOption(event.currentTarget.value);
    }
    return { value: selectedOption, onChange }
}

/** 정규식 체크 함수*/
export const checkRegExp = (value, regExp) => {
    return regExp.test(value);
}

/** 문자열길이 제한에 사용하는 검증 함수 */
export const maxLen = (value, valid) => value.length <= valid;

/**  스크롤 이벤트 성능저하 방지를 위한 쓰로틀*/
export const throttle =(callback) => {
    let throttle;
    return()=>{
        if (throttle) return;
        throttle = setTimeout(()=> {
            throttle = null;
            callback();
        },2000);
    };
};


/**  이중 리스트 생성*/
export const wrapperTo2Arrays = (array1, array2) =>{
    let crossArray = []
    for (let i=0; i<array1.length; i++) {
        crossArray.push([array1[i], array2[i]])
    }
    return crossArray;
}