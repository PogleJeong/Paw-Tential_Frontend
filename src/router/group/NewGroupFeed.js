import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateFeedModal from "./modals/CreateFeedModal";
import ModifyCmtModal from "./modals/ModifyCmtModal";
import CareFeedModal from "./modals/CareFeedModal";
import ModifyCareFeedModal from "./modals/ModifyCareFeedModal";
import GroupFeedItems from "../../component/GroupFeedItems";
import CareGroupFeedItems from "../../component/CareGroupFeedItems";
import JoinRequestComponent from "../../component/JoinRequest";


export default function NewGroupFeed() {

    // parameter 값 조사
    let params = useParams();
    let grpName = params.grpName;

    // cookie에 저장된 사용자 ID
    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    {/*const userId = cookies.USER_ID;*/}
    const userId = 'test2';

    // 로그인 한 유저의 프로필 사진
    const [profile, setProfile] = useState('');

    // 특정 그룹의 정보
    const [groupInfo, setGroupInfo] = useState([]);

    // 특정 그룹에 가입한 인원 프로필
    const [memberProfile, setMemberProfile] = useState([]);

    // 특정 그룹에 가입된 멤버인지 확인
    const [hasJoinedMember, setHasJoinedMember] = useState(false);
    
    // 특정 그룹의 피드(일반 그룹)
    const [grpFeed, setGrpFeed] = useState([]);
    // 특정 그룹의 피드(돌봄 그룹)
    const [careGrpFeed, setCareGrpFeed] = useState([]);
    
    // 모달 모음 및 모달로 넘겨줄 Feed Sequence
    const [createFeedModal, setCreateFeedModal] = useState(false);
    const [modifyCmtModal, setModifyCmtModal] = useState(false);
    const [careFeedModal, setCareFeedModal] = useState(false);
    const [modifyCareFeedModal, setModifyCareFeedModal] = useState(false);
    const [modifyMainFeedModal, setModifyMainFeedModal] = useState(false);

    // 로그인 한 유저의 프로필 사진 가져오기
    const getProfileImage = async () => {
        axios.get("http://localhost:3000/group/getProfileImage", {params:{"id":userId}})
        .then(function(res){
            setProfile(res.data);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 특정 그룹의 정보 가져오기
    const getGroupInfo = async () => {
        axios.get("http://localhost:3000/group/getGroupInfo", {params:{"grpNo":params.grpNo}})
        .then(function(res){
            setGroupInfo(res.data);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 특정 그룹에 가입한 인원 프로필 가져오기
    const getGroupMemberImage = async () => {
        axios.get("http://localhost:3000/group/getGroupMemberImage", {params:{"groupId":params.grpNo}})
        .then(function(res){
            setMemberProfile(res.data.profileList);
            console.log(res.data.profileList);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 해당 그룹 가입 여부에 따른 피드 출력 방식(전체 공개 / 멤버 공개)
    const isMember = async () => {
        axios.post("http://localhost:3000/group/isMember", null, {params:{"groupId":params.grpNo, "memberId":userId}})
        .then(function(res) {
            if(res.data.count !== 0) {
                setHasJoinedMember(true);
                setGrpFeed(res.data.groupAllFeed);
            } else {
                setHasJoinedMember(false);
                setGrpFeed(res.data.groupFeed);
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

     // 돌봄 그룹 피드 출력
     const getCareGroupAllFeed = async () => {
        axios.get("http://localhost:3000/group/getCareGroupAllFeed", {params:{"grpNo":params.grpNo}})
        .then(function(res){
            setCareGrpFeed(res.data.careGroupFeedList);
            console.log(res.data.careGroupFeedList);
        })
        .catch(function(err){
            alert(err);
        })
    }

    useEffect(()=>{
        getProfileImage();
        isMember();
        getGroupInfo();
        getGroupMemberImage();
        if(grpName === "돌봄") {
            getCareGroupAllFeed();
        }
    },[grpName])

    return (
        <>
            <CreateFeedModal show={createFeedModal} onHide={()=>{setCreateFeedModal(false)}} userId={userId} />
            
            <ModifyCmtModal show={modifyCmtModal} onHide={()=>{setModifyCmtModal(false)}}  />
            <CareFeedModal show={careFeedModal} onHide={()=>{setCareFeedModal(false)}} />
            {/* <ModifyCareFeedModal show={modifyCareFeedModal} onHide={()=>{setModifyCareFeedModal(false)}} grpFeedNo={selectedGrpFeedId} /> */}

                <div className="header-for-bg">
                    <div className="background-header position-relative">
                        {/* TO-DO 그룹 커버 이미지 넣어주세요 */}
                        <img src="/assets/images/page-img/profile-bg7.jpg" className="img-fluid w-100" alt="header-bg" />
                        <div className="title-on-header">
                            <div className="data-block">
                                <h1>Groups</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="content-page" className="content-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap">
                                    <div className="group-info d-flex align-items-center">
                                        <div className="me-3">
                                            <img className="rounded-circle img-fluid avatar-100" src={`http://localhost:3000/${groupInfo.grpImage}`} alt="" />
                                        </div>
                                        <div className="info">
                                            <h4>{groupInfo.grpName}</h4>
                                            <p className="mb-0">{groupInfo.grpMember} members</p>
                                        </div>
                                    </div>
                                    <div className="group-member d-flex align-items-center mt-md-0 mt-2">
                                        <div className="iq-media-group me-3">
                                        {memberProfile && memberProfile.length !== 0 && (
                                            <>
                                            {memberProfile.map((profile, i) => {
                                                return (
                                                <a href="javascript:void(0);" className="iq-media">
                                                {profile.profile === "test" && <img className="rounded-circle img-fluid" src="/feedimages/baseprofile.png" alt="" style={{width:"60px", height:"60px"}} />}
                                                {profile.profile === "baseprofile" && <img className="rounded-circle img-fluid" src="/feedimages/baseprofile.png" alt="" style={{width:"60px", height:"60px"}} />}
                                                </a>
                                                )
                                            })}
                                            </>
                                        )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-8">
                            {hasJoinedMember === true && (
                            <>
                                <div id="post-modal-data" className="card">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center">
                                            <div className="user-img">
                                                {/* TO-DO 유저 프로필 사진 넣어주세요 */}
                                                {profile === "test" && <img className="avatar-60 rounded-circle" src="/feedimages/baseprofile.png" alt="" style={{width:"60px", height:"60px"}} />}
                                                {profile === "baseprofile" && <img className="avatar-60 rounded-circle" src="/feedimages/baseprofile.png" alt="" style={{width:"60px", height:"60px"}} />}
                                            </div>
                                            <div className="post-text ms-3 w-100">
                                                <input
                                                    readOnly
                                                    style={{border:'none'}}
                                                    type="text"
                                                    size="50"
                                                    onClick={()=>{grpName === '돌봄' ? setCareFeedModal(true) : setCreateFeedModal(true)}}
                                                    placeholder={grpName === '돌봄' ? `${userId}님, 돌봄이 필요하세요?` : `${userId}님, 무슨 생각을 하고 계신가요?`}
                                                />
                                            </div>
                                        </div>
                                    </div> {/* end of card-body */}
                                </div> {/*end of post-modal-data */}
                            </>
                            )}
                            <div className="card">
                                <div className="card-body">
                                    {grpName !== '돌봄' ? 
                                    <>
                                        {grpFeed && grpFeed.length !== 0
                                        ?
                                        <>
                                        {grpFeed.map((feed, i) => (
                                            <GroupFeedItems key={i}
                                                                            data={feed}
                                                                            userId={userId}
                                                                            isMember={isMember}
                                                                            />
                                        ))}
                                        </>
                                        :
                                        <p style={{textAlign:"center", verticalAlign:"center"}}>해당 그룹에 작성된 피드가 없습니다.</p>
                                    }
                                    </>
                                    :
                                    <>
                                        {careGrpFeed && careGrpFeed.length !== 0
                                        ?
                                        <>
                                        {careGrpFeed.map((feed, i) => (
                                            <CareGroupFeedItems key={i}
                                                                                    data={feed}
                                                                                    userId={userId}
                                                                                    fn={getCareGroupAllFeed} />
                                        ))}
                                        </>
                                        :
                                        <p style={{textAlign:"center", verticalAlign:"center"}}>해당 그룹에 작성된 피드가 없습니다.</p>
                                        }
                                    </>
                                    }
                                </div>
                            </div>
                        </div>
                            <div className="col-lg-4">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between">
                                        <div className="header-title">
                                            <h4 className="card-title">가입 요청한 인원</h4>
                                        </div>
                                    </div>
                                    <JoinRequestComponent grpNo={params.grpNo} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}