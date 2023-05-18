/**
 * 그룹 생성 화면
 * @Auth 해운
 */

import React, {useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from "react-cookie";

export default function CreateGroup() {

    let history = useNavigate();

    const navigate = useNavigate();
    useEffect(()=> {
        if (!cookies.USER_ID) {
            alert("로그인 후 이용해주세요.");
            navigate("/login");
            return;
        }
    },[]);

    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    // cookie에 저장된 사용자 ID 및 닉네임
    const userNickName = cookies.USER_NICKNAME;

    // 그룹 생성 시, 입력할 사항
    const [grpName, setGrpName] = useState('');
    const [grpLeader, setGrpLeader] = useState('');
    const [grpImage, setGrpImage] = useState('');
    const [grpIntro, setGrpIntro] = useState('');

    // 그룹 대표 이미지 미리보기 변수 및 함수
    const ref = useRef();
    const imgLoad = () => {
        const file = ref.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setGrpImage(reader.result);
        }
    }


    useEffect(()=>{
        setGrpLeader(cookies.USER_ID);
    },[]);

    // 그룹명 중복 확인
    const checkExistingGroup = async () => {
        axios.get("http://localhost:3000/group/checkExistingGroup", {params:{"grpName":grpName}})
        .then(function(res) {
            if(res.data === "NO") {
                alert("이미 존재하는 그룹명입니다.");
                setGrpName('');
            } else {
                alert("사용할 수 있는 그룹명입니다.");
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    const submitBtn = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("grpName", grpName);
        formData.append("grpLeader", grpLeader);
        formData.append("uploadFile", document.frm.uploadFile.files[0]);
        formData.append("grpIntro", grpIntro);

        axios.post("http://localhost:3000/group/createGroup", formData)
        .then(function(res) {
            if(res.data === "NO") {

            }
            alert('그룹 생성 성공');
            history("/group/NewsFeed");
        })
        .catch(function(err) {
            alert("에러");
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
                                        <h3 className="text-white">Create Group</h3>
                                            <p className="text-white">그룹 생성</p>
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
                                        <form name="frm" onSubmit={submitBtn} encType="multipart/form-data">
                                            <div className="form-group">
                                                <label className="form-label">그룹명</label>
                                                <input type="text"
                                                            className="form-control"
                                                            name="grpName"
                                                            value={grpName}
                                                            onChange={(e)=>setGrpName(e.target.value)}
                                                />
                                                <button type="button"
                                                            className="btn btn-primary my-1"
                                                            onClick={checkExistingGroup}>중복 확인</button>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label custom-file-input">그룹 대표 이미지</label>
                                                <div className="my-3"><img src={grpImage} /></div>
                                                <input type="file"
                                                            className="form-control" 
                                                            name="uploadFile"
                                                            onChange={(e)=> {
                                                                setGrpImage(e.target.value);
                                                                imgLoad();
                                                            }}
                                                            accept='*'
                                                            ref={ref} 
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">그룹 소개</label>
                                                <textarea className="form-control"
                                                                rows="5"
                                                                name="grpIntro"
                                                                onChange={(e)=>setGrpIntro(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <div style={{align:"center"}}>
                                                <button type="submit" className="btn btn-primary">그룹 생성하기</button>
                                                <button type="button" className="btn bg-danger mx-1" onClick={()=>{window.history.back()}}>취소</button>
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