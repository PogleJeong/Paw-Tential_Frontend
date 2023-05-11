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

    const imgLoad = () => {
        const file = ref.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setDisplayOriginImg("none");
            setDisplayChanged("block");
            setGrpImage(reader.result);
        }
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
            <div className="wrapper">
                <div id="content-page" className="content-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="card position-relative inner-page-bg bg-primary" style={{height: "150px"}}>
                                    <div className="inner-page-title">
                                        <h3 className="text-white">Modify Group</h3>
                                            <p className="text-white">그룹 수정</p>
                                    </div>
                                </div>
                            </div> {/*end of col-sm-12*/}
                            <div className="col-sm-12 col-lg-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">Type Here...</h4>
                                        </div>
                                    </div> {/*end of card-header*/}
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
                                            <div className="form-group">
                                                <label className="form-label custom-file-input">그룹 대표 이미지</label>
                                                {grpImage &&
                                                <div className="my-3">
                                                    {/*원본 대표 이미지 */}
                                                    <img src={`http://localhost:3000/uploads/${grpImage}`}
                                                            alt=""
                                                            className="img-fluid rounded w-30"
                                                            style={{display : displayOriginImg}}
                                                            />
                                                    {/*바뀐 대표 이미지 */}
                                                    <img src={grpImage}
                                                            alt=""
                                                            className="img-fluid rounded w-30"
                                                            style={{display : displayChanged}}
                                                    />
                                                </div>
                                                }
                                                <input type="file"
                                                            className="form-control" 
                                                            name="uploadFile"
                                                            accept='*' 
                                                            ref={ref}
                                                            onChange={imgLoad}
                                                />
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
                                                <button type="submit" className="btn btn-primary">Modify</button>
                                                <button type="button" className="btn bg-danger mx-1" onClick={deleteGroupBtn}>Delete</button>
                                            </div>
                                        </form>
                                    </div> {/*end of card-body*/}
                                </div> {/*end of card*/}
                            </div>
                        </div> {/*end of row*/}
                    </div> {/*end of container*/}
                </div> {/*end of content-page*/}
            </div> {/*end of wrapper*/}
        {/*
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
        */}

        </>
    )

}