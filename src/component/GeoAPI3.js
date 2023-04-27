// 게시물 수정시 사용되는 Geo API

import React, { useEffect, useRef, useState } from "react";
const { kakao } = window;

// React.memo 를 통해 rerendering 방지

const KakaoMapUpdate = ({ setUpdateGeoLat, setUpdateGeoLng, prevLat, prevLng }) => {
    const mapContentRef = useRef();
    const addressRef = useRef();

    useEffect(()=>{
        // 위치정보 먼저 불러온 후 실행
   
        const mapOption = {
            center: new kakao.maps.LatLng(prevLat, prevLng), // 지도의 좌표
            level: 3, // 지도의 확대레벨
        }
        const map = new kakao.maps.Map(mapContentRef.current, mapOption);
        
        setUpdateGeoLng(map.getCenter().getLng())

        // 옵션생성 1. 지도/스카이뷰 선택기능
        const mapTypeControl = new kakao.maps.MapTypeControl();
        // 옵션 추가하기
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT)

        // 옵션생성 2. 지도확대기능
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
        
        // 기능추가 1. 주소-좌표 변환
        var geocoder = new kakao.maps.services.Geocoder();

        var marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커입니다
            infowindow = new kakao.maps.InfoWindow({zindex:1}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

        // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);

        // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
        kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
            searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
                if (status === kakao.maps.services.Status.OK) {
                    var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
                    detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                    
                    var content = '<div class="bAddr">' +
                                    '<span class="title">법정동 주소정보</span>' + 
                                    detailAddr + 
                                '</div>';

                    // 마커를 클릭한 위치에 표시합니다 
                    marker.setPosition(mouseEvent.latLng);
                    marker.setMap(map);

                    // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
                    infowindow.setContent(content);
                    infowindow.open(map, marker);
                    
                    // 추가 : 지도에 지정한 위치를 저장하기
                    setUpdateGeoLat(map.getCenter().getLat())
                    setUpdateGeoLng(map.getCenter().getLng())
                    addressRef.current.innerText = result[0].address.address_name;
                }   
            });
        });
        


        // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
        kakao.maps.event.addListener(map, 'idle', function() {
            searchAddrFromCoords(map.getCenter(), displayCenterInfo);
        });

        function searchAddrFromCoords(coords, callback) {
            // 좌표로 행정동 주소 정보를 요청합니다
            geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
        }

        function searchDetailAddrFromCoords(coords, callback) {
            // 좌표로 법정동 상세 주소 정보를 요청합니다
            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
        }

        // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
        function displayCenterInfo(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                var infoDiv = document.getElementById('centerAddr');

                for(var i = 0; i < result.length; i++) {
                    // 행정동의 region_type 값은 'H' 이므로
                    if (result[i].region_type === 'H') {
                        infoDiv.innerHTML = result[i].address_name;
                        break;
                    }
                }
            }    
        }
    });

    // 추가 : 기능 2. 현재 마커로 설정된 위치 좌표를 가져오기
    
    return(
        <div>
            <div ref={mapContentRef} style={{width: "500px", height: "500px"}}></div>
            <div>
                <span id="centerAddr"></span>
            </div>
            <span ref={addressRef}></span>
        </div>
    )
}

// 리랜더링 방지
export default React.memo(KakaoMapUpdate);