import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { styled, keyframes } from 'styled-components';

import { useInput, maxLen } from "../../../utils/UseHook";

const fadeIn = keyframes`
    0% {
    opacity: 0;
    }
    100% {
    opacity: 1;
    }
`;

const Container = styled.div`
    position: fixed;
    top: 100px;
    left: 40%;
    width: 600px;
    aspect-ratio: 4/3;
    padding: 20px;
    box-shadow: 2px 3px 5px 0px;
    background-color: white;
    animation: ${fadeIn} 2s;
`;

const Title = styled.h2`
    text-align: center;
    height: 50px;
`

const HeaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px;
    padding: 10px;
`

const BodyWrapper = styled.div`

`

const InputBox = styled.input`
    width: 300px;
    height: 40px;
    border: none;
    border-bottom: 3px solid black;
    padding-left: 5px;
    font-size: 15px;

    &:focus {
        background-color: rgba(255, 207, 159, 0.4);
    }
`

const SelectBox = styled.select`
    width: 100px;
    height: 30px;
    text-align: center;
    &:focus {
        background-color: rgba(255, 207, 159, 0.4);
    }
`

const Label = styled.span`
    display: inline-block;
    height: 30px;
    font-weight: bold;
    margin: 10px;
`
const TextBox = styled.textarea`
    width: 570px;
    height: 200px;
    padding: 10px;
    font-size: 15px;
`

const SubmitBtn = styled.button`
    width: 150px;
    height: 40px;
    border: none;
    border-radius: 10px;
    margin: 0px 50px;
    color: white;
    background-color: rgba(244,183,229,0.8);
`

const CloseBtn = styled.button`
    width: 150px;
    height: 40px;
    border: none;
    border-radius: 10px;
    margin: 0px 100px;
    color: white;
    background-color: rgba(90,183,229,0.8);
`

const FooterWrapper = styled.div`
    display: flex;
`

const LeftAlignBox = styled.div`
    display: flex;
    justify-content: left;
`

const RightAlignBox = styled.div`
    display: flex;
    justify-content: right;
`

function MarketReport({writer, setActiveReportModal}) {
    const title = useInput("", maxLen, 45);
    const category = useInput("--전체--", maxLen, 45);
    const content = useInput("", maxLen, 500);
    const [ cookies ] = useCookies(["USER_ID","USER_NICKNAME"]);
    const location = useLocation();
    
    const sendReport = async() => {
        const reporter = cookies.USER_ID;
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
        <Container >
            <Title>해당 게시물 신고</Title>
            <HeaderWrapper>
                <Label>신고제목</Label>
                <InputBox {...title} placeholder="신고제목(45글자)"/><br/>
                <Label>신고분류</Label>
                <SelectBox {...category}>
                    <option>-전체-</option>
                    <option>부적절한 게시물</option>
                    <option>광고 및 스팸</option>
                    <option>욕설 및 비방</option>
                </SelectBox>
            </HeaderWrapper>
            <BodyWrapper>
                <Label>신고내용 </Label>
                <TextBox {...content} placeholder="500자 이내로 작성해주세요"></TextBox><br/>
            </BodyWrapper>
            <FooterWrapper>
                <LeftAlignBox>
                    <SubmitBtn onClick={sendReport}>제출</SubmitBtn>
                </LeftAlignBox>
                <RightAlignBox>
                    <CloseBtn onClick={closeModal}>닫기</CloseBtn>
                </RightAlignBox>
            </FooterWrapper>
        </Container>
    );
}

export default React.memo(MarketReport);