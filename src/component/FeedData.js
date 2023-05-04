import React, { useState } from "react";

// content 문자열에서 피드 이미지만 가져오기
export const FeedImage = (data) => {
    function getImgSrc() {
        let str = data.content;
        if(str.includes('<img src="')){
            return str.split('<img src="')[1].split('">')[0];
        } else {
            return "../feedimages/nofeed.png";
        }
    }
    return (
        <div>
            <img src={getImgSrc()} alt="피드사진" />
        </div>
    );
};

// content 문자열에서 피드 내용만 가져오기
export const FeedContent = (data) => {
    function getContent() {
        let str = data.content;

        if(str.includes('<p>')){
            return str.split('<p>')[1].split('</p>')[0];
        } else {
            return "";
        }
    }
    return (
        <div>
            <h2>{getContent()}</h2>
        </div>
    );
};