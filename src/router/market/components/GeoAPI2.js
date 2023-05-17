import React, { useRef, useEffect } from "react";
import { styled } from "styled-components";


const MapContainer = styled.div`
    width: 500px;
    height: 350px;
    margin: 25px;
    box-shadow: 2px 3px 5px 0px;
`

const { kakao } = window;

const KakaoMapRead = ({addrRef,geoLat, geoLng}) => {
    const mapContentRef = useRef();
    useEffect(()=>{

        const mapOption = {
            center: new kakao.maps.LatLng(geoLat, geoLng), // 지도의 중심좌표
            level: 3 // 지도의 확대 레벨
        }
        // 지도를 생성합니다    
        const map = new kakao.maps.Map(mapContentRef.current, mapOption); // argu1 : 지도를 넣을 html element, argu2 : map option
        const coords = new kakao.maps.LatLng(geoLat, geoLng);

        // 결과값으로 받은 위치를 마커로 표시합니다
        new kakao.maps.Marker({
            map: map,
            position: coords
        });

         // 기능추가 1. 주소-좌표 변환
        let geocoder = new kakao.maps.services.Geocoder();

        function searchAddrFromCoords(lng, lat,callback) {
            // 좌표로 법정동 상세 주소 정보를 요청합니다
            console.log(lng, lat)
            geocoder.coord2RegionCode(lng, lat, callback);
        }

        // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
        function displayCenterInfo(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                
                for(let i = 0; i < result.length; i++) {
                    // 행정동의 region_type 값은 'H' 이므로
                    if (result[i].region_type === 'H') {
                        console.log(result[0].address_name);
                        addrRef.current.innerText = result[0].address_name;
                        break;
                    }
                }
            }    
        }

        searchAddrFromCoords(geoLng, geoLat, displayCenterInfo);

    });  
    return(
        <MapContainer ref={mapContentRef}>

        </MapContainer>
    );
}

export default React.memo(KakaoMapRead);