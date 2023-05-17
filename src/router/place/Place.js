/**
 * 포텐 플레이스
 * @Auth 문경
 */

import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Geolocation from '@react-native-community/geolocation';
import "../../styles/Place.css";

const { kakao } = window;

const Place = () => {

    // 파라미터 값 받아오기
    let params = useParams();

    let navigate = useNavigate();
    let location = useLocation();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [palceLength, setPlaceLength] = useState(0);

    const onchangeSearch = (e) => setSearch(e.target.value);
    const onchangeCategory = (e) => setCategory(e.target.value);

    useEffect(() => {

        let markers = []; // 마커 담을 배열

        let bounds; // 지도의 현재 영역
        let latlng = new kakao.maps.LatLng(37.566826, 126.9786567); // 지도의 현재 중심좌표

        let options = { size: 5 }; // 페이지에 보여질 목록 개수
        let submit_category = ""; // 선택된 카테고리 저장

        let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
            mapOption = {
                center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
                level: 5 // 지도의 확대 레벨
            };

        // 지도 생성  
        let map = new kakao.maps.Map(mapContainer, mapOption);

        // 일반 지도와 스카이뷰 지도 타입 컨트롤 생성
        let mapTypeControl = new kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 지도 확대 축소를 제어할 수 있는  줌 컨트롤 생성
        let zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 지도 이동, 확대, 축소로 인해 중심좌표가 변경되면 호출되는 이벤트 함수, 현재 지도 정보 저장
        kakao.maps.event.addListener(map, 'center_changed', function() {
            bounds = map.getBounds() // 지도의 현재 영역 얻기
            latlng = map.getCenter(); // 지도의 현재 중심좌표 얻기
        });

        // Geolocation를 이용하여 현재 위치 표시
        if(navigator.geolocation) {
            Geolocation.getCurrentPosition(
                position => {
                    // 현재 위치(위도, 경도) 가져오기
                    const latitude = JSON.stringify(position.coords.latitude);
                    const longitude = JSON.stringify(position.coords.longitude);

                    // 지도 이동
                    let currentPos = new window.kakao.maps.LatLng(latitude, longitude);
                    map.panTo(currentPos);

                    // 마커 표시
                    displayCurrentMarker(currentPos);

                    options = {
                        location: currentPos, // 중심 좌표
                        radius: 20000, // 중심 좌표로부터의 거리(반경/m)
                        bounds: bounds,  // 지도의 영역
                        sort: kakao.maps.services.SortBy.DISTANCE, // 거리순 정렬
                        size: 5 // 페이지에 보여질 목록 개수
                    };

                    // 첫 페이지를 식당 카테고리로 설정
                    if(params.search === undefined && params.category === undefined){
                        let first_category = "애견동반식당";
                        setCategory(first_category);
                        submit_category = first_category;
                        searchPlaces("", first_category);

                        navigate("/place/_/" + first_category);
                    }

                    // 상세보기 페이지에서 다시 목록으로 돌아올 때 지도 영역과 좌표 설정
                    if(location.state !== null){
                        latlng = new kakao.maps.LatLng(location.state.latlng.Ma, location.state.latlng.La);

                        var sw = new kakao.maps.LatLng(location.state.bounds.qa, location.state.bounds.ha),
                            ne = new kakao.maps.LatLng(location.state.bounds.pa, location.state.bounds.oa);

                        bounds = new kakao.maps.LatLngBounds(sw, ne);
                    }

                    // 주소의 검색어/카테고리(parameter)값이 있을 때
                    // 검색어
                    if(params.search !== "_" && params.search !== undefined){
                        // 카테고리 초기화
                        setCategory("");
                        submit_category = "";

                        // 검색 옵션 재설정
                        options = { size: 5 };

                        setSearch(params.search);
                        searchPlaces(params.search, "");

                        navigate("/place/" + params.search + "/_");
                    }
                    // 카테고리
                    else if(params.category !== "_" && params.category !== undefined){
                        // 검색어 초기화
                        setSearch("");

                        // 선택된 카테고리 저장
                        setCategory(params.category);
                        submit_category = params.category;

                        // 검색 옵션 재설정
                        options = {
                            location: latlng, // 중심 좌표
                            radius: 20000, // 중심 좌표로부터의 거리(반경/m)
                            bounds: bounds,  // 지도의 영역
                            sort: kakao.maps.services.SortBy.DISTANCE, // 거리순 정렬
                            size: 5 // 페이지에 보여질 목록 개수
                        };

                        searchPlaces("", params.category);
                        navigate("/place/_/" + params.category);
                    }
                },
                error => { console.log(error.code, error.message); },
                {enableHighAccuracy:true, timeout: 15000, maximumAge: 10000 },
            )
        }

        // 지도에 현재 위치 마커 표시 함수
        function displayCurrentMarker(locPosition) {
            // 마커 생성
            let imageSize = new kakao.maps.Size(27, 27),  // 마커 이미지의 크기
                markerImage = new kakao.maps.MarkerImage("https://i.imgur.com/41Rw8zs.png", imageSize),
                marker = new kakao.maps.Marker({
                    position: locPosition, // 마커의 위치
                    image: markerImage 
                });
            // 지도 위에 마커 표출
            marker.setMap(map); 
        }

        // 장소 검색 객체 생성
        let ps = new kakao.maps.services.Places();  

        // 검색 결과 목록이나 마커를 클릭했을 때 인포윈도우 생성
        let infowindow = new kakao.maps.InfoWindow({zIndex:1});

        // 키워드로 장소를 검색
        const searchForm = document.getElementById("submit_search");
            searchForm.addEventListener("click", function (e) {
            e.preventDefault();

            // 카테고리 초기화
            setCategory("");
            submit_category = "";

            // 검색 옵션 재설정
            options = { size: 5 };

            let keyword = document.getElementById('keyword').value;
            searchPlaces(keyword, "");

            navigate("/place/" + keyword + "/_");
        });
        // 키워드로 장소를 검색(엔터키)
        const searchFormEnter = document.getElementById("keyword");
            searchFormEnter.addEventListener("keypress", function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();

                // 카테고리 초기화
                setCategory("");
                submit_category = "";

                // 검색 옵션 재설정
                options = { size: 5 };

                let keyword = document.getElementById('keyword').value;
                searchPlaces(keyword, "");

                navigate("/place/" + keyword + "/_");
            }
        });

        // 카테고리로 장소를 검색
        const categoryForm = document.getElementById("submit_category");
            categoryForm.addEventListener("click", function (e) {
            if(e.target.value !== undefined){

                // 검색어 초기화
                setSearch("");

                // 선택된 카테고리 저장
                submit_category = e.target.value;

                // 검색 옵션 재설정
                options = {
                    location: latlng, // 중심 좌표
                    radius: 20000, // 중심 좌표로부터의 거리(반경/m)
                    bounds: bounds,  // 지도의 영역
                    sort: kakao.maps.services.SortBy.DISTANCE, // 거리순 정렬
                    size: 5 // 페이지에 보여질 목록 개수
                };

                searchPlaces("", e.target.value);

                navigate("/place/_/" + e.target.value);
            }
        });

        // 이 지역 재검색
        const researchForm = document.getElementById("submit_research");
            researchForm.addEventListener("click", function (e) {
            e.preventDefault();

            // 검색 옵션 재설정
            options = {
                location: latlng, // 중심 좌표
                radius: 20000, // 중심 좌표로부터의 거리(반경/m)
                bounds: bounds,  // 지도의 영역
                sort: kakao.maps.services.SortBy.DISTANCE, // 거리순 정렬
                size: 5 // 페이지에 보여질 목록 개수
            };

            let keyword = document.getElementById('keyword').value;
            searchPlaces(keyword, submit_category);
        });

        // 키워드 검색
        function searchPlaces(search, category) {
            // 선택한 카테고리가 있으면 키워드를 카테고리로 바꾸기
            if(category !== ""){
                search = category;
            }

            if (!search.replace(/^\s+|\s+$/g, '')) {
                alert('키워드를 입력해주세요!');
                return false;
            }

            // 장소검색 객체를 통해 키워드로 장소검색을 요청
            ps.keywordSearch(search, placesSearchCB, options);
        }

        // 장소검색이 완료됐을 때
        function placesSearchCB(data, status, pagination) {
            if (status === kakao.maps.services.Status.OK) {

                if(submit_category !== "") { 
                    setCategory(submit_category);
                }

                // 검색 결과 개수 출력(최대 45개까지만 제공)
                setPlaceLength(pagination.totalCount);

                // 정상적으로 검색이 완료됐으면 검색 목록과 마커 표출
                displayPlaces(data);

                // 페이지 번호 표출
                displayPagination(pagination);

            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

                alert('검색 결과가 존재하지 않습니다.');
                return;

            } else if (status === kakao.maps.services.Status.ERROR) {

                alert('검색 결과 중 오류가 발생했습니다.');
                return;

            }
        }

        // 검색 결과 목록과 마커 표출
        function displayPlaces(places) {

            let listEl = document.getElementById('placesList'), 
            menuEl = document.getElementById('menu_wrap'),
            fragment = document.createDocumentFragment(), 
            bounds = new kakao.maps.LatLngBounds();
            
            // 검색 결과 목록에 추가된 항목들 제거
            removeAllChildNods(listEl);
            // 지도에 표시되고 있는 마커 제거
            removeMarker();

            // 상세보기 페이지에 보낼 지도 영역과 좌표
            let send_latlng = latlng;
            let send_bounds = bounds;

            for ( let i=0; i<places.length; i++ ) {

                // 마커를 생성하고 지도에 표시
                let placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
                    marker = addMarker(placePosition, i, places[i].category_name, places[i].category_group_code), 
                    itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element 생성

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표 추가
                bounds.extend(placePosition);

                // 마커와 검색결과 항목 event
                (function(marker, title, url, address, category_name, category_group_code, phone, x, y) {
                    // 마커에 mouseover 했을 때 해당 장소 인포윈도우 표시
                    kakao.maps.event.addListener(marker, 'mouseover', function() {
                        displayInfowindow(marker, title);
                    });
                    // 마커에 mouseout 했을 때 인포윈도우 닫기
                    kakao.maps.event.addListener(marker, 'mouseout', function() {
                        infowindow.close();
                    });
                    // 마커를 클릭 했을 때
                    kakao.maps.event.addListener(marker, 'click', function() {
                        map.setLevel(1);
                        displayInfowindow(marker, title);
                        placePosition = new kakao.maps.LatLng(y, x);
                        map.panTo(placePosition);
                    });

                    // list 항목에 mouseover 했을 때 해당 장소 인포윈도우 표시
                    itemEl.onmouseover =  function () {
                        // 인포윈도우 생성
                        displayInfowindow(marker, title);

                        // 항목 위치로 맵 이동
                        placePosition = new kakao.maps.LatLng(y, x);
                        map.panTo(placePosition);
                    };
                    // list 항목에 mouseout 했을 때 인포윈도우 닫기
                    itemEl.onmouseout =  function () {
                        infowindow.close();
                    };

                    // list 항목을 클릭 했을 때 상세 페이지로 이동
                    itemEl.onmouseup = function () {
                        let keyword = document.getElementById('keyword').value;
                        if(keyword === ""){
                            keyword = "_";
                        }
                        let category = submit_category;
                        if(category === ""){
                            category = "_";
                        }

                        // 장소명, 상세페이지 url, 장소 지번 주소, 카테고리, 카테고리 코드, 전화번호, 검색된 지도의 영역과 좌표
                        navigate(`/place/detail/${keyword}/${category}`, {state:{"title":title, "url":url, "address":address, "category": category_name, "categorycode": category_group_code, "phone": phone, "latlng": send_latlng, "bounds": send_bounds}});
                    };

                })(marker, places[i].place_name, places[i].place_url, places[i].address_name, places[i].category_name, places[i].category_group_code, places[i].phone, places[i].x, places[i].y);

                fragment.appendChild(itemEl);
            }

            // 검색결과 항목들을 검색결과 목록 Element에 추가
            listEl.appendChild(fragment);
            menuEl.scrollTop = 0;

            // 검색된 장소 위치를 기준으로 지도 범위 재설정
            map.setBounds(bounds);
        }

        // 검색결과 항목을 Element로 반환
        function getListItem(index, places) {

            // 카테고리별 마커 이미지 설정
            let category_icon = "";
            if(places.category_group_code === "FD6"){ // 식당
                category_icon = "marker_food";
            } else if(places.category_group_code === "CE7") { // 카페
                category_icon = "marker_cafe";
            } else if(places.category_name.includes('반려견놀이터') === true) { // 놀이터
                category_icon = "marker_play";
            } else if(places.category_name.includes('반려동물용품') === true) { // 쇼핑
                category_icon = "marker_shop";
            } else if(places.category_group_code === "AD5") { // 숙박
                category_icon = "marker_pension";
            } else if(places.category_group_code === "HP8") { // 병원
                category_icon = "marker_hospital";
            }

            let el = document.createElement('li'),
            itemStr = '<span class="markerbg ' + category_icon + '"></span>' +
                        '<div class="info">' +
                        '   <h3>' + places.place_name + '</h3>';

            if (places.road_address_name) {
                itemStr += '    <span>' + places.road_address_name + '</span>' +
                            '   <span class="jibun gray">' +  places.address_name  + '</span>';
            } else {
                itemStr += '    <span>' +  places.address_name  + '</span>'; 
            }
                        
            itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                        '</div>';           

            el.innerHTML = itemStr;
            el.className = 'item';

            return el;
        }

        // 마커를 생성하고 지도 위에 마커를 표시
        function addMarker(position, idx, category_name, category_code) {

            // 카테고리별 마커 이미지 설정
            let imageSrc = 'https://i.imgur.com/sq1Lvy5.png'; // 기본 마커
            if(category_code === "FD6"){ // 식당
                imageSrc = 'https://i.imgur.com/8BSGiMu.png';
            } else if(category_code === "CE7") { // 카페
                imageSrc = 'https://i.imgur.com/lmt1poz.png';
            } else if(category_name.includes('반려견놀이터') === true) { // 놀이터
                imageSrc = 'https://i.imgur.com/bSXM4Te.png';
            } else if(category_name.includes('반려동물용품') === true) { // 쇼핑
                imageSrc = 'https://i.imgur.com/AKEWxnR.png';
            } else if(category_code === "AD5") { // 숙박
                imageSrc = 'https://i.imgur.com/SCvEyM0.png';
            } else if(category_code === "HP8") { // 병원
                imageSrc = 'https://i.imgur.com/A1PIwCw.png';
            }

            let imageSize = new kakao.maps.Size(37, 40),  // 마커 이미지의 크기
                imgOptions =  {
                    offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
                },
                markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                marker = new kakao.maps.Marker({
                    position: position, // 마커의 위치
                    image: markerImage 
                });

            marker.setMap(map); // 지도 위에 마커 표출
            markers.push(marker);  // 배열에 생성된 마커 추가

            return marker;
        }

        // 지도 위에 표시되고 있는 마커 모두 제거
        function removeMarker() {
            for ( let i = 0; i < markers.length; i++ ) {
                markers[i].setMap(null);
            }   
            markers = [];
        }

        // 검색결과 목록 하단에 페이지번호 표시
        function displayPagination(pagination) {
            let paginationEl = document.getElementById('pagination'),
                fragment = document.createDocumentFragment(),
                i; 

            // 기존에 추가된 페이지번호 삭제
            while (paginationEl.hasChildNodes()) {
                paginationEl.removeChild (paginationEl.lastChild);
            }
            for (i=1; i<=pagination.last; i++) {
                let el = document.createElement('a');
                el.href = "#";
                el.innerHTML = i;

                if (i===pagination.current) {
                    el.className = 'on';
                } else {
                    el.onclick = (function(i) {
                        return function() {
                            pagination.gotoPage(i);
                        }
                    })(i);
                }

                fragment.appendChild(el);
            }
            paginationEl.appendChild(fragment);
        }

        // 검색결과 목록 또는 마커를 클릭했을 때
        // 인포윈도우에 장소명 표시
        function displayInfowindow(marker, title) {
            let content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

            infowindow.setContent(content);
            infowindow.open(map, marker);
        }

        // 검색결과 목록의 자식 Element 제거
        function removeAllChildNods(el) {   
            while (el.hasChildNodes()) {
                el.removeChild (el.lastChild);
            }
        }
    }, []);

    return (
        <div className="container mt-4">
            <div>
                <div className="map_wrap">
                    <div className="option">
                        <div className="search">
                            <div class="iq-search-bar device-search">
                                <div action="#" class="searchbox w-100">
                                    <a id="submit_search" class="search-link" href="#"><i class="ri-search-line"></i></a>
                                    <input class="text search-input"  value={search} id="keyword" onChange={onchangeSearch} placeholder="찾고 싶은 장소를 입력하세요!" autocomplete='off' />
                                </div>
                            </div>
                        </div >
                        <div class="btn-group mt-3 w-100 checkboxradio" role="group" aria-label="Basic radio toggle button group"  id="submit_category">
                            <input type={'radio'} class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" value="애견동반식당" onChange={onchangeCategory} checked={category === "애견동반식당"} />
                            <label class="btn btn-outline-primary" style={{padding: "5px 27px"}} for="btnradio1">식당</label>
                            <input type={'radio'} class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" value="애견동반카페" onChange={onchangeCategory} checked={category === "애견동반카페"} />
                            <label class="btn btn-outline-primary" style={{padding: "5px 27px"}} for="btnradio2">카페</label>
                            {/* <input type={'radio'} class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" value="반려견놀이터" onChange={onchangeCategory} checked={category === "반려견놀이터"} />
                            <label class="btn btn-outline-primary" style={{padding: "5px 27px"}} for="btnradio3">놀이터</label> */}
                            <input type={'radio'} class="btn-check" name="btnradio" id="btnradio4" autocomplete="off" value="반려동물용품" onChange={onchangeCategory} checked={category === "반려동물용품"} />
                            <label class="btn btn-outline-primary" style={{padding: "5px 27px"}} for="btnradio4">쇼핑</label>
                            <input type={'radio'} class="btn-check" name="btnradio" id="btnradio5" autocomplete="off" value="애견동반숙소" onChange={onchangeCategory} checked={category === "애견동반숙소"} />
                            <label class="btn btn-outline-primary" style={{padding: "5px 27px"}} for="btnradio5">숙박</label>
                            <input type={'radio'} class="btn-check" name="btnradio" id="btnradio6" autocomplete="off" value="동물병원" onChange={onchangeCategory} checked={category === "동물병원"} />
                            <label class="btn btn-outline-primary" style={{padding: "5px 27px"}} for="btnradio6">병원</label>
                        </div>
                        <div className="mt-3 mb-2">
                            <span>전체 검색 결과 {palceLength}개</span>
                            <button className="btn btn-secondary rounded-pill" id="submit_research" type="submit">이 지역 재검색</button>
                        </div>
                    </div>
                    <div id="menu_wrap">
                        <ul id="placesList"></ul>
                        <div id="pagination"></div>
                    </div>
                    <div id="map" style={{width:"582px", height:"800px", position:"relative", overflow:"hidden"}}></div>            
                </div>
            </div>
        </div>
    );
};
export default Place;
