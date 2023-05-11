import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

export default function JoinRequestComponent(props) {

    const [joinRequestList, setJoinRequestList] = useState([]);

    // 특정 그룹에 가입 요청한 인원 불러오기
    const getGroupJoinRequest = async () => {
        axios.get("http://localhost:3000/group/getGroupJoinRequest", {params:{"grpNo":props.grpNo}})
        .then(function(res) {
            setJoinRequestList(res.data.joinRequestList);
        })
        .catch(function(err) {
            alert(err);
        })
    }

     // 특정 인원의 그룹 가입 요청 승인 함수
     const acceptJoinRequest = async (memberId) => {
         if(window.confirm(`${memberId}님의 그룹 가입 요청을 승인 하시겠습니까?`)) {
            axios.post("http://localhost:3000/group/acceptJoinRequest", null, {params:{"groupId":props.grpNo, "memberId": memberId}})
            .then(function(res) {
                alert(res.data);
                getGroupJoinRequest();
            })
            .catch(function(err){
                alert(err);
            })
        }
    }

    useEffect(()=>{
        getGroupJoinRequest();
    },[props.grpNo])

    return (
        <>
        <div className="card-body">
            <ul className="media-story list-inline m-0 p-0">
            {joinRequestList && joinRequestList.length !== 0 ? (
                joinRequestList.map((req, idx) => {
                    console.log(req);
                    return (
                        <>
                        <li className="d-flex align-items-center" key={idx}>
                        {req.profile === "test" && <img className="avatar-35 rounded-circle img-fluid" src="/feedimages/baseprofile.png" alt="" />}
                        {req.profile === "baseprofile" && <img className="avatar-35 rounded-circle img-fluid" src="/feedimages/baseprofile.png" alt="" />}
                            <div className="stories-data ms-2">
                                <h5>{req.memberId}</h5>
                                <a href="javascript:void(0)"
                                    className="btn btn-soft-primary"
                                    style={{width:"80px", height:"30px", lineHeight:"15px"}}
                                    onClick={()=>{acceptJoinRequest(req.memberId)}}
                                >
                                가입 승인
                                </a>
                            </div>
                        </li>
                        </>
                    )
                })
                ) : (
                    <li className="d-flex align-items-center">
                        <img src="/feedimages/empty.png" />
                        <div className="stories-data ms-2">
                            <span>가입 요청한 인원이 없습니다.</span>
                        </div>
                    </li>
            )}
            </ul>
        </div>
        </>    
    )

}