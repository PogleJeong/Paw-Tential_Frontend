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

/** 정규식 체크 함수*/
export const checkRegExp = (value, regExp) => {
    return regExp.test(value);
}

/** 문자열길이 제한에 사용하는 검증 함수 */
export const maxLen = (value, valid) => value.length <= valid;
