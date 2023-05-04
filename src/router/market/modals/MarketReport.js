import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import session from "react-session-api";

const useInput = (initValue, validator, valid) => {
  
    const [value, setValue ] = useState(initValue);
    
    const onChange = (event) => {
        const value = event.target.value;

        let willUpdate = true;
        if (typeof validator === "function") {
            willUpdate = validator(value, valid)
            if (willUpdate) {
                setValue(value);
            }
        }
    }
    return { value, onChange };
}

// posting 정보받기, modal 을 위한 onChange 함수 받기.
const maxLen = (value, valid) => value.length <= valid;

function MarketReport({writer, setActiveReportModal}) {
    const title = useInput("", maxLen, 45);
    const category = useInput("--전체--", maxLen, 45);
    const content = useInput("", maxLen, 500);
    const location = useLocation();
    
    const sendReport = async() => {
        const reporter = session.get("user") || null;
        const { pathname } = location;
        if (!title.value) {
            alert("신고제목을 입력해주세요.");
            return;
        }
        if (!reporter) {
            alert("로그인 후 진행해주세요");
            return;
        }
        if (!category) {
            alert("신고카테고리를 입력해주세요.");
            return;
        }
        if (!content) {
            alert("신고내용을 입력해주세요.");
            return;
        }
        await axios.post("http://localhost:3000/market/report", null, {params: {
            title: title.value,
            reporter,
            reported: writer,
            category: category.value,
            content: content.value,
            url: pathname,
        }})
        .then((response) => {
            if (response.status === 200){
                if (response.data === "REPORT_MARKET_OK"){
                    alert("신고되었습니다.");
                    setActiveReportModal(false);
                    return;
                }
                if( response.data === "REPORT_MARKET_NO"){
                    alert("신고실패!!");
                }
            }
        })
    }
    const closeModal = () => {
        setActiveReportModal(false);
    }

    return(
        <div style={{position: "fixed", top: "100px", left: "40%", width: "500px", aspectRatio: "4/3", backgroundColor: "gray", padding: "50px"}}>
            <span>제목: </span>
            <input {...title} placeholder="신고제목(45글자)"/><br/>
            
            <span>신고분류</span>
            <select {...category}>
                <option>--전체--</option>
                <option>부적절한 게시물</option>
                <option>광고 및 스팸</option>
                <option>욕설 및 비방</option>
            </select><br/>

            <span>신고내용: </span>
            <textarea {...content} placeholder="500자 이내로 작성해주세요"></textarea><br/>
            <button onClick={sendReport}>제출</button>
            <button onClick={closeModal}>닫기</button>
        </div>
    );
}

export default React.memo(MarketReport);