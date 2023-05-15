import ModifyCareFeedModal from "../router/group/modals/ModifyCareFeedModal";
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Carousel } from "react-bootstrap";
import ReactHtmlParser from "react-html-parser";
import moment from 'moment';

export default function CareGroupFeedItems(props){

    const [modifyCareFeedModal, setModifyCareFeedModal] = useState(false);
    const [selectedGrpFeedId, setSelectedGrpFeedId] = useState('');

    // content 내에서 이미지, 글 분리하기
     const [image, setImage] = useState([]);
     const [noImage, setNoImage] = useState([]);
 
     const getImage = () => {
         const regex = /<img src="([^"]+)"/g;
         const urls = [];
 
         let match;
         while ((match = regex.exec(props.data.careGrpContent)) !== null) {
             urls.push(match[1]);
         }
 
         setImage(urls);
     };
 
     const getNoImage = () => {
         const noImage = props.data.careGrpContent;
 
         const regex = /<img.*?>|<figure.*?>|<\/figure>/gi;
         const result = noImage.replace(regex, '');

         setNoImage(result);
     };

    // Carousel Component
    const CarouselComponent = () => {
        const [idx, setIdx] = useState(0);
        const handleSelect = (selectedIdx) => {
            setIdx(selectedIdx);
        };
        return (
            <>
            {image && image.length !== 0 && (
                <Carousel activeIndex={idx} onSelect={handleSelect}>
                    {image.map((img, idx) => {
                        return (
                            <Carousel.Item key={idx}>
                                <img className="d-block w-100" src={img} alt="img" />
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
            )}
            </>
        )
    }

    // 피드 삭제
    const deleteCareFeed = async (i) => {
        await axios.get("http://localhost:3000/group/deleteCareFeed", {params:{"careGrpFeedNo":i}})
        .then(function(res){
            alert(res.data);
            props.fn();
        })
        .catch(function(err){
            alert(err);
        })
    }

    useEffect(()=>{
        getImage();
        getNoImage();
    },[props.data.careGrpFeedNo])

    return (
        <>
        <ModifyCareFeedModal show={modifyCareFeedModal} onHide={()=>{setModifyCareFeedModal(false)}} grpFeedNo={selectedGrpFeedId} fn={props.fn} />
        <div className="post-item">
            <div className="user-post-data py-3">
                <div className="d-flex justify-content-between">
                    <div className="me-3">
                         {/* TO-DO 유저 프로필 사진 넣어주세요 */}
                        {props.data.profile === "test" && <img className="avatar-60 rounded-circle" src="/feedimages/baseprofile.png" alt="" style={{width:"60px", height:"60px"}} />}
                        {props.data.profile === "baseprofile" && <img className="avatar-60 rounded-circle" src="/feedimages/baseprofile.png" alt="" style={{width:"60px", height:"60px"}} />}
                    </div>
                    <div className="w-100">
                        <div className="d-flex justify-content-between">
                            <div>
                                <h5 className="mb-0 d-inline-block">{props.data.careGrpFeedWriter}</h5>
                                <p className="mb-0">{props.data.careGrpFeedWd.substring(0,10)}ㆍ<i className={`ri-${props.data.careGrpFeedSetting === "전체 공개" ? 'lock-fill pe-1' : 'global-line pe-1' }`} /></p>
                            </div>
                            <div className="card-post-toolbar">
                                <div className="dropdown">
                                    <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                        <i className="ri-more-fill">
                                        </i>
                                    </span>
                                    <div className="dropdown-menu m-0 p-0">
                                        <a className="dropdown-item p-3" href="javascript:void(0);">
                                            <div className="d-flex align-items-top">
                                                <div className="h4">
                                                    <i className="ri-alarm-warning-line" />
                                                </div>
                                                <div className="data ms-2">
                                                    <h6>피드 신고하기</h6>
                                                    <p className="mb-0">해당 피드에 우려되는 부분이 있습니다.</p>
                                                </div>
                                            </div>
                                        </a>
                                        {props.userId === props.data.careGrpFeedWriter && (
                                        <>
                                        <a className="dropdown-item p-3"
                                                href="javascript:void(0);"
                                                onClick={ () => {
                                                    setModifyCareFeedModal(true);
                                                    setSelectedGrpFeedId(props.data.careGrpFeedNo);
                                                }}
                                        >
                                            <div className="d-flex align-items-top">
                                                <div className="h4">
                                                    <i className="ri-edit-line" />
                                                </div>
                                                <div className="data ms-2">
                                                    <h6>피드 수정하기</h6>
                                                    <p className="mb-0">해당 피드를 수정합니다.</p>
                                                </div>
                                            </div>
                                        </a>
                                        <a className="dropdown-item p-3" href="javascript:void(0);" onClick={()=>{deleteCareFeed(props.data.careGrpFeedNo)}}>
                                            <div className="d-flex align-items-top">
                                                <div className="h4">
                                                    <i className="ri-delete-bin-line" />
                                                </div>
                                                <div className="data ms-2">
                                                    <h6>피드 삭제하기</h6>
                                                    <p className="mb-0">해당 피드를 삭제합니다.</p>
                                                </div>
                                            </div>
                                        </a>
                                        </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
            <div className="mt-3 user-post">
                <CarouselComponent />
                <div className="blog-description mt-3">
                    <h5 style={{color:"#3f414d"}}>
                    {props.data.careGrpType === 'care' ? <>🤱 돌봐주실 분을 찾고 있어요!</> : <>🐕‍🦺 산책 시켜주실 분을 찾고 있어요!</>}
                    </h5>
                    <div className="mt-3">
                        <p>{ReactHtmlParser(noImage)}</p>
                    </div>
                    <div className="blog-meta d-flex align-items-center mb-3 position-right-side flex-wrap">
                        <div className="me-4">
                            <i className="ri-calendar-check-fill text-primary pe-2"></i>
                            {moment(props.data.careGrpStartDt).locale("ko").format("YY.MM.DD")}
                            {props.data.careGrpType === 'care' && <> ~ {moment(props.data.careGrpEndDt).locale("ko").format("YY.MM.DD")} </>}
                        </div>
                        {props.data.careGrpType === 'walk' &&
                        <>
                            <div className="me-4">
                                <i className="ri-time-line text-primary pe-2"></i>
                                {moment(props.data.careGrpStartTime).format("HH:mm")} ~ {moment(props.data.careGrpEndTime).format("HH:mm")}
                            </div>
                            <div className="me-4">
                                <i className="ri-chat-check-line text-primary pe-2"></i>
                                {props.data.careGrpCheck}
                            </div>
                        </>
                        }
                            <div className="me-4">
                                <i className="ri-map-pin-line text-primary pe-2"></i>
                                서울특별시 구로구
                            </div>
                    </div>
                    {/* TO-DO 신청하기 클릭 시, 대화방 만들어주세요 */}
                    <div className="mb-3">
                        <a href="javascript:void(0)" tabIndex="-1">돌봄 신청하기<i className="ri-arrow-right-s-line"></i></a>
                    </div>
                </div>
            </div>
        </div> {/* post-item */}
        </>
    )
}