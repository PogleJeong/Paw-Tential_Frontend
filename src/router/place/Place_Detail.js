/**
 * 포텐 플레이스 상세화면
 * @Auth 문경
 */

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { history } from "../../component/history";
import { FeedImage } from "../../component/FeedData";
import axios from 'axios';
import "../../styles/Place.css";
import FeedDetailModal from "../home/modals/FeedDetailModal";

const { kakao } = window;

const Place_detail = () => {

    const [reviewList, setReviewList] = useState([]);

    // 플레이스 정보
    const [placeTitle, setPlaceTitle] = useState('');
    const [placeAddress, setPlaceAddress] = useState('');
    const [placeUrl, setPlaceUrl] = useState('');
    const [placeCategory, setPlaceCategory] = useState('');
    const [placePhone, setPlacePhone] = useState('');

    let navigate = useNavigate();
    let location = useLocation();

    // 파라미터 값 받아오기
    let params = useParams();

    // 해당 장소의 리뷰 목록
    function getReviewlist(address) {
        axios.get("http://localhost:3000/placeReview", { params:{"location": address} })
        .then(function(resp){
            setReviewList(resp.data);
            console.log(JSON.stringify(resp.data));
        })
        .catch(function(err){
            alert(err);
        });
    }

    // 장소 상세 리뷰 모달
    const [feedDetailModal, setFeedDetailModal] = useState(false);
    const [feed, setFeed] = useState([]);

    // 피드 상세 모달로 넘겨줄 데이터(1) - 이미지 데이터
    // props로 받은 데이터 중, 이미지 데이터만 추려서 배열에 담기
    const [photo, setPhoto] = useState([]);

    const getPhoto = (content) => {
        const regex = /<img src="([^"]+)"/g;
        const urls = [];

        let match;
        while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]);
        }

        setPhoto(urls);
    }

    // 피드 상세 모달로 넘겨줄 데이터(2) - 이미지 제외 데이터
    // props로 받은 데이터 중, 이미지 제외한 데이터만 추려서 배열에 담기
    const [noPhoto, setNoPhoto] = useState([]);

    const getNoPhoto = (content) => {

        const regex = /<img.*?>|<figure.*?>|<\/figure>/gi;
        const result = content.replace(regex, '');

        setNoPhoto(result);
    }

    // 상세 페이지로 넘겨줄 댓글 리스트
    const [commentList, setCommentList] = useState([]);

    const getCommentList = async (seq) => {
        try {
        const response = await axios.get("http://localhost:3000/home/getCommentList", { params: { "feedSeq": seq } });
        const data = response.data.commentList;
        setCommentList(data);
        } catch (error) {
        alert(error);
        }
    };

    // 리뷰 클릭 시 handler
    const handleClick = async (seq) => {
        try {
            const response = await axios.get('http://localhost:3000/home/loadPost', { params: { 'seq': seq } });
            setFeed(response.data);
            getPhoto(response.data.content);
            getNoPhoto(response.data.content);
            getCommentList(response.data.seq);
            setFeedDetailModal(true);
            console.log('피드 데이터:', response.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Carousel idx
    const [idx, setIdx] = useState(0);
    
    const handleSelect = (selectedIndex, e) => {
        setIdx(selectedIndex);
    };

    // Carousel Component
    const CarouselComponent = () => {

        return (
            <div>
                {reviewList && reviewList.length !== 0 ? (
                    <Carousel activeIndex={idx} interval={null} onSelect={handleSelect}>
                    {reviewList.map((review, index) => {
                        return (
                            <Carousel.Item key={index} onClick={()=>{handleClick(review.seq)}}>
                                <FeedImage content={review.content}/>
                            </Carousel.Item>
                        )
                    })}
                    </Carousel>
                )
                :(<p>리뷰가 없습니다.</p>)
                }
            </div>
        )
    }

    useEffect(() => {

        // 검색 목록으로 돌아갈 때(뒤로가기) 이전 검색 결과 페이지로 이동
        const unlistenHistoryEvent = history.listen(({ action }) => {
            if (action === "POP") {
                if(params.search !== "_" && params.search !== undefined){
                    navigate("/place/" + params.search + "/_", {state:{"latlng": location.state.latlng, "bounds": location.state.bounds}});
                } else if(params.category !== "_" && params.category !== undefined){
                    navigate("/place/_/" + params.category, {state:{"latlng": location.state.latlng, "bounds": location.state.bounds}});
                }
            }
        });

        return unlistenHistoryEvent;
    }, [navigate, params.category, params.search]);
    

    useEffect(() => {
        // 플레이스 정보 받아오기
        setPlaceTitle(location.state.title);
        setPlaceAddress(location.state.address);
        setPlaceUrl(location.state.url);
        setPlaceCategory(location.state.category);
        setPlacePhone(location.state.phone);

        getReviewlist(location.state.address);

        // 지도
        let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        };

        // 지도 생성
        let map = new kakao.maps.Map(mapContainer, mapOption); 

        // 주소-좌표 변환 객체 생성
        let geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표 검색
        geocoder.addressSearch(location.state.address, function(result, status) {
            // 정상적으로 검색이 완료됐으면 // status === OK
            if (status === kakao.maps.services.Status.OK) {

                let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 카테고리별 마커 이미지 설정
                let imageSrc = 'https://i.imgur.com/sq1Lvy5.png'; // 기본 마커
                if(location.state.categorycode === "FD6"){ // 식당
                    imageSrc = 'https://i.imgur.com/8BSGiMu.png';
                } else if(location.state.categorycode === "CE7") { // 카페
                    imageSrc = 'https://i.imgur.com/lmt1poz.png';
                } else if(location.state.category.includes('반려견놀이터') === true) { // 놀이터
                    imageSrc = 'https://i.imgur.com/bSXM4Te.png';
                } else if(location.state.category.includes('반려동물용품') === true) { // 쇼핑
                    imageSrc = 'https://i.imgur.com/AKEWxnR.png';
                } else if(location.state.categorycode === "AD5") { // 숙박
                    imageSrc = 'https://i.imgur.com/SCvEyM0.png';
                } else if(location.state.categorycode === "HP8") { // 병원
                    imageSrc = 'https://i.imgur.com/A1PIwCw.png';
                }

                // 결과값으로 받은 위치를 마커로 표시
                let imageSize = new kakao.maps.Size(37, 40),  // 마커 이미지의 크기
                    imgOptions =  {
                        offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
                    },
                    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                    marker = new kakao.maps.Marker({
                        map: map,
                        position: coords, // 마커의 위치
                        image: markerImage 
                    });

                // 인포윈도우로 장소에 대한 설명 표시
                let infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">' + location.state.title + '</div>'
                });
                infowindow.open(map, marker);

                // 지도의 중심을 결과값으로 받은 위치로 이동
                map.setCenter(coords);
            } 
        });
    }, [location.state.address, location.state.category, location.state.categorycode, location.state.phone, location.state.title, location.state.url]);

    return (
        <>
            {feedDetailModal && 
                <FeedDetailModal
                show={feedDetailModal}
                onHide={() => {setFeedDetailModal(false);}}
                feedData={feed}
                photo={photo}
                noPhoto={noPhoto}
                getComment={()=>{getCommentList(feed.seq)}}
                />
            }
            <div className="container mt-4">
                <div>
                    <div id="menu_wrap" className="bg_white">
                        <div className="place_detail">
                            <h1>{placeTitle}</h1>
                            <hr/>
                            <h3 className="mt-3">카테고리</h3>
                            <p>{placeCategory}</p>
                            {
                                // 전화번호가 있으면
                                placePhone !== '' &&
                                <div>
                                    <h3>전화번호</h3>
                                    <p>{placePhone}</p>
                                </div>
                            }
                            <h3>주소</h3>
                            <p>{placeAddress}</p>
                            <button className="btn btn-primary"><Link to={placeUrl} target="_blank">정보 상세보기</Link></button>
                            <br/><br/><hr/>
                            <div className="palce_review mt-3">
                                <h2>포텐 리뷰</h2>
                                <div className="mt-2">
                                    <CarouselComponent />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="map" style={{width:"582px", height:"800px", position:"relative", overflow:"hidden"}}></div>
                </div>
            </div>
        </>
    );
};
export default Place_detail;
