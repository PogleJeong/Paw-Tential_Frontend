import React, { useState, useEffect, useRef } from "react";
import { Button } from 'react-bootstrap';
import session from "react-session-api";
import axios from 'axios';

// 피드 작성
export const CreateFeedData = (data) => {

    return (
        <div>
            
        </div>
    );
};

// 포텐스 작성
export const CreatePawtensData = () => {

    const [ user, setUser ] = useState("");
    const [ content, setContent ] = useState("");
    const [file, setFile] = useState({});
    const videoRef = useRef();

    useEffect(()=>{
        // 로그인 확인
        const userSession = session.get("user") || false;
        if (!userSession){
            alert("로그인을 해주세요");
            navigator("/");
        }
        setUser(userSession);
    },[])

    const pawtensWrite = async() => {
        if(!videoRef.current.files[0]) {
            alert("영상을 업로드해주세요!");
            return;
        }
        
        let formData = new FormData();
        formData.append("file", videoRef.current.files[0]);
        formData.append("id", user);
        formData.append("content", content);
        await axios.post("http://localhost:3000/pawtens/write", formData, {"Content-Type": `multipart/form-data`})
        .then((response) =>{
            alert(response.data);
            window.location.reload();
        })
    }

    const fileUpload = (e) => {
        if(e.target.files[0]){
            const videoType = e.target.files[0].type.includes('video');
            // 파일 크기가 10mb이상이면 return
            if(e.target.files[0].size > 10000000){
                alert("10MB이하의 파일만 올려주세요!");
                videoRef.current.value = "";
                return;
            }
            if(videoType === true) {
                setFile({
                    url: URL.createObjectURL(e.target.files[0]),
                    video: videoType
                    });
            }else{
                alert("비디오 파일만 올려주세요!");
                videoRef.current.value = "";
            }
        } else {
            // 파일을 찾을 수 없을 때 미리보기 초기화
            setFile({});
        }
    };

    return (
        <div className="createPawtens">
            <div><input type="file" onChange={fileUpload} ref={videoRef} /></div>
            <div className="filePreview">{file.video && <video src={file.url} controls width="700px" />}</div>
            <textarea cols="90" rows="5" value={content} onChange={(e)=>setContent(e.target.value)} placeholder="포텐스 설명"></textarea>
            <Button onClick={pawtensWrite}>Submit</Button>
        </div>
    );
};