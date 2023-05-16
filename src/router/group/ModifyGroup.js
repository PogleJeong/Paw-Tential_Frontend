import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function ModifyGroup() {

    let history = useNavigate();
   
    let params = useParams();

    const grpNo = params.grpNo;
    const [grpName, setGrpName] = useState('');
    const [grpIntro, setGrpIntro] = useState('');
    const [grpImage, setGrpImage] = useState('');

    const [displayOriginImg, setDisplayOriginImg] = useState("block");
    const [displayChanged, setDisplayChanged] = useState("none");

    // 이미지 미리보기 관련 state 변수 및 함수
    const ref = useRef();
    const handleFileUpload = () => {
        const file = ref.current.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setGrpImage(e.target.result);
            };
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setDisplayOriginImg("none");
                setDisplayChanged("block");
            }
        }
    };

    const handleUploadButtonClick = () => {
        document.querySelector('.file-upload').click();
    }

    useEffect(()=>{
        getGroupInfo();
    },[])

    // 그룹의 정보를 가져오는 함수
    const getGroupInfo = async () => {
        axios.get("http://localhost:3000/group/getGroupInfo", {params:{"grpNo":params.grpNo}})
        .then(function(res){
            setGrpName(res.data.grpName);
            setGrpIntro(res.data.grpIntro);
            setGrpImage(res.data.grpImage);
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

        const file = document.frm.uploadFile.files[0];
        if (file !== undefined) {
            // 이미지를 수정한 경우에만 파일을 추가하여 formData에 전송
            formData.append("uploadFile", file);
        }

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
                <div id="content-page" className="content-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card position-relative inner-page-bg bg-primary" style={{height: "150px"}}>
                                    <div className="inner-page-title">
                                        <h3 className="text-white">그룹 수정</h3>
                                            <p className="text-white">개설한 그룹의 상태를 수정할 수 있습니다.</p>
                                    </div>
                                </div>
                            </div> {/*end of col-sm-12*/}
                            <div className="col-sm-12 col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        <form name="frm" onSubmit={modifyGroup} encType="multipart/form-data">
                                            <div className="form-group">
                                                <label className="form-label">그룹명</label>
                                                <input type="text"
                                                            className="form-control"
                                                            name="grpName"
                                                            disabled
                                                            readOnly
                                                            value={grpName}
                                                />
                                            </div>
                                            <label className="form-label custom-file-input">그룹 대표 이미지</label>
                                            <div className="form-group row align-items-center">
                                                <div className="col-md-12">
                                                    <div className="profile-img-edit">
                                                        {/*원본 이미지*/}
                                                        <img src={`http://localhost:3000/uploads/${grpImage}`}
                                                            alt=""
                                                            className="profile-pic w-100 h-100"
                                                            style={{display : displayOriginImg}}
                                                        />
                                                         {/*바뀐 대표 이미지 */}
                                                        <img src={grpImage}
                                                            alt=""
                                                            className="profile-pic"
                                                            style={{display : displayChanged}}
                                                        />
                                                        <div className="p-image">
                                                            <i className="ri-pencil-line upload-button text-white" onClick={handleUploadButtonClick}></i>
                                                            <input type="file"
                                                                        className="file-upload"
                                                                        name="uploadFile"
                                                                        accept="*"
                                                                        ref={ref}
                                                                        onChange={handleFileUpload}/>
                                                        </div>
                                                    </div>
                                                </div>
                                           </div>
                                            <div className="form-group">
                                                <label className="form-label">그룹 소개</label>
                                                <textarea className="form-control"
                                                                rows="5"
                                                                name="grpIntro"
                                                                value={grpIntro}
                                                                onChange={(e)=>setGrpIntro(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div style={{align:"center"}}>
                                                <button type="submit" className="btn btn-primary">수정 완료</button>
                                                <button type="button" className="btn bg-soft-danger mx-1" onClick={deleteGroupBtn}>그룹 삭제</button>
                                            </div>
                                        </form>
                                    </div> {/*end of card-body*/}
                                </div> {/*end of card*/}
                            </div>
                        </div> {/*end of row*/}
                    </div> {/*end of container*/}
                </div> {/*end of content-page*/}
        </>
    )

}