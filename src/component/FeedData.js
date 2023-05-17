import React, { useState } from "react";
import FeedDetailModal from "../router/home/modals/FeedDetailModal";


// content 문자열에서 피드 이미지만 가져오기
export const FeedImage = (props) => {

  const [feedDetailModal, setFeedDetailModal] = useState(false);

    // 피드 자세히 보기 함수
    const handleClick = () => {
        setFeedDetailModal(true);
    }
    
    function getImgSrc() {
        let str = props.content;
        if(str.includes('<img src="')){
            return str.split('<img src="')[1].split('">')[0];
        } else {
            return "/feedimages/nofeed.png";
        }
    }
    return (
      <>
      <FeedDetailModal show={feedDetailModal}
                                        onHide={()=>{setFeedDetailModal(false)}}
                                        feedData={props.feedData}
                                        photo={props.photo}
                                        noPhoto={props.noPhoto}
                                        getComment={props.getComment} />
        <div>
            <img src={getImgSrc()} alt="피드사진" className="img-fluid rounded w-100" />
        </div>
      </>
    );
};

// 미리보기용 feedImage
export const PreFeedImage = (props) => {
  function getImgSrc() {
      let str = props.content;
      if(str.includes('<img src="')){
          return str.split('<img src="')[1].split('">')[0];
      } else {
          return "/feedimages/nofeed.png";
      }
  }
  return (
      <div>
          <img src={getImgSrc()} alt="피드사진" className="img-fluid rounded" />
      </div>
  );
};

// content 문자열에서 피드 내용만 가져오기
export const FeedContent = (props) => {

  const [feedDetailModal, setFeedDetailModal] = useState(false);

    // 피드 자세히 보기 함수
    const handleClick = () => {
        setFeedDetailModal(true);
    }

    function getContent() {
        let str = props.content;
        let content = "";
      
        while (str.includes("<p>") && str.includes("</p>")) {
          content = str.split("<p>")[1].split("</p>")[0].trim();
          if (content !== "&nbsp;") {
            break;
          }
          str = str.substring(str.indexOf("</p>") + 4);
        }
      
        if (content.startsWith("&nbsp;")) {
          content = content.replace("&nbsp;", "");
        }
      
        if (content.length >= 20) {
          content = content.substring(0, 20) + "...";
          content = <p>{content} <a href='javascript:void(0);' onClick={handleClick}>더보기</a></p>;
        } else {
          content = <p>{content}</p>;
        }
      
        return content;
    }

    return (
      <>
        <FeedDetailModal show={feedDetailModal}
                                          onHide={()=>{setFeedDetailModal(false)}}
                                          feedData={props.feedData}
                                          photo={props.photo}
                                          noPhoto={props.noPhoto}
                                          getComment={props.getComment} />
        <p>{getContent()}</p>
      </>
    );
};