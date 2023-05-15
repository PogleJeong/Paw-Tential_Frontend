import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function GroupListComponent (props) {

    // 특정 그룹에 가입한 인원의 프로필 사진 가져오기
    const [memberProfile, setMemberProfile] = useState([]);
    const getGroupMemberImage = async () => {
        axios.get("http://localhost:3000/group/getGroupMemberImage", {params:{"groupId":props.data.grpNo}})
        .then(function(res){
            setMemberProfile(res.data.profileList);
        })
        .catch(function(err){
            alert(err);
        })
    }

     // 그룹 가입 요청 버튼
     const [status, setStatus] = useState(props.data.grpStatus);

    const groupJoinRequest = async (groupId, groupName) => {
        axios.post("http://localhost:3000/group/groupJoinRequest", null, {params:{"memberId":props.id, "groupId":groupId, "groupName":groupName}})
        .then(function(res){
            alert(res.data);
            setStatus(2);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 그룹 가입 요청 취소 버튼
    const groupJoinCancel = async(groupId) => {
        axios.post("http://localhost:3000/group/groupJoinCancel", null, {params:{"memberId":props.id, "groupId":groupId}})
        .then(function(res){
            alert(res.data);
            setStatus(0);
        })
        .catch(function(err){
            alert(err);
        })
    }

    useEffect(()=>{
        getGroupMemberImage();
    },[props])

    return (
        <>
        <div className="card mb-0">
            <div className="top-bg-image">
                <img src="/assets/images/page-img/profile-bg1.jpg" className="img-fluid w-100" alt="group-bg" />
            </div>
            <div className="card-body text-center">
                <div className="group-icon">
                    <img src={`http://localhost:3000/${props.data.grpImage}`} alt="profile-img" className="rounded-circle img-fluid avatar-120" />
                </div>
                <div className="group-info pt-3 pb-3">
                    <h4><Link to={`/group/GroupFeed/${props.data.grpNo}/${props.data.grpName}`}>{props.data.grpName}</Link></h4>
                    <p>{props.data.grpIntro}</p>
                </div>
                <div className="group-details d-inline-block pb-3">
                    <ul className="d-flex align-items-center justify-content-between list-inline m-0 p-0">
                        <li className="pe-3 ps-3">
                            <p className="mb-0">Post</p>
                                <h6>{props.data.grpPost}</h6>
                        </li>
                        <li className="pe-3 ps-3">
                            <p className="mb-0">Member</p>
                                <h6>{props.data.grpMember}</h6>
                        </li>
                        <li className="pe-3 ps-3">
                            <p className="mb-0">Visit</p>
                            <h6>{props.data.grpVisit}</h6>
                        </li>
                        </ul>
                </div>
                <div className="group-member mb-3">
                    <div className="iq-media-group">
                        {memberProfile && memberProfile.length !== 0 && (
                            memberProfile.map((profile, i) => {
                                return (
                                    <a href="javascript:void(0);" className="iq-media" key={i}>
                                    {profile.profile === "test" && <img className="img-fluid avatar-40 rounded-circle" src="/feedimages/baseprofile.png" alt="" />}
                                    {profile.profile === "baseprofile" && <img className="img-fluid avatar-40 rounded-circle" src="/feedimages/baseprofile.png" alt="" />}
                                    </a>
                                )   
                            })
                        )}
                    </div>
                </div>
                {status === 0 && <button type="button" className="btn btn-primary d-block w-100" onClick={()=>{groupJoinRequest(props.data.grpNo, props.data.grpName)}}>가입 하기</button>} 
                {status === 1 && <button className="btn btn-primary d-block w-100">가입된 그룹입니다.</button>} 
                {status === 2 && <button type="button" className="btn btn-primary d-block w-100" onClick={()=>{groupJoinCancel(props.data.grpNo)}}>가입 대기중</button>} 
            </div>
        </div>
        </>
    )
}