import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ModifyGroup() {

    let history = useNavigate();
   
    // http://localhost:9001/group/MyGroup?groupId=1
    let params = useParams();

    const grpNo = params.grpNo;
    const [grpName, setGrpName] = useState('');
    const [grpIntro, setGrpIntro] = useState('');
    

    useEffect(()=>{
        getGroupInfo();
    },[])

    // 그룹의 정보를 가져오는 함수
    const getGroupInfo = async () => {
        axios.get("http://localhost:3000/group/getGroupInfo", {params:{"grpNo":params.grpNo}})
        .then(function(res){
            setGrpName(res.data.grpName);
            setGrpIntro(res.data.grpIntro);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 비동기 방식으로, 그룹 수정
    const modifyGroup = async (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("grpNo", grpNo);
        formData.append("grpName", grpName);
        formData.append("uploadFile", document.frm.uploadFile.files[0]);
        formData.append("grpIntro", grpIntro);
        
        axios.post("http://localhost:3000/group/modifyGroup", formData)
        .then(function(res){
            alert(res.data);
            history("/group/MyGroup");
        })
        .catch(function(err){
            alert(err);
        })
    }
    
    const deleteGroupBtn = () => {
        if(window.confirm('그룹을 삭제하시겠습니까?')) {
            deleteGroup();
        };
    }


    // 그룹 삭제 함수
    const deleteGroup = async () => {
        axios.get("http://localhost:3000/group/deleteGroup", {params:{"grpNo":params.grpNo}})
        .then(function(res) {
            alert(res.data);
            history("/group/MyGroup");
        })
        .catch(function(err) {
            alert(err);
        })
    }

    return (
        <>
        <h1>그룹 수정하기</h1>
        <form name="frm" onSubmit={modifyGroup} encType="multipart/form-data">
            <div id="grpName">
                <label htmlFor='grpName'>그룹명 :</label>
                <br />
                <input type="text" name="grpName" value={grpName} onChange={(e)=>setGrpName(e.target.value)} />
            </div>
            <div id="grpImage">
                <label htmlFor='grpImage'>그룹 대표 이미지 :</label>
                <br />
                <input type="file" name="uploadFile" accept='*'/>
            </div>
            <div id="grpIntro">
                <label htmlFor='grpName'>그룹 소개 :</label>
                <br />
                <input type="text" name="grpIntro" value={grpIntro} onChange={(e)=>setGrpIntro(e.target.value)}/>
            </div>
            <br />
            <button type="submit">그룹 수정</button>
            &nbsp;
            <button type="button" onClick={deleteGroupBtn}>그룹 삭제</button>
        </form>
        <br />
        </>
    )

}