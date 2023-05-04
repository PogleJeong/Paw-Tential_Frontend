import { useEffect, useState } from "react";
import { useLocation, Link , useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

import KakaoMapRead from "./components/GeoAPI2";
import MarketReport from "./modals/MarketReport";

const MarketDetail = () => {
    const location = useLocation();
    const [ cookies, setCookies, removeCookies ] = useCookies(["id"]);
    
    const { title, content, wdate, id, category, state, conditions, productName, productNumber, geoLat, geoLng, posting } = location.state.marketInfo;
    const imgInfo  = location.state.imgInfo;
    const [ activeReportModal, setActiveReportModal ] = useState(false);
    const [ updateActive, setUpdateActive ] = useState(false);
    const navigator = useNavigate();

    useEffect(()=>{
        // 자신이 작성한 글일경우, 수정하기 및 삭제하기 기능 활성화
        const loginUser = cookies.id || false;

        if (loginUser === id) {
            setUpdateActive(true);
        }
        // 게시물 조회수 : 이미 본 유저와 아닌 유저를 검사하여 추가
        axios.post("http://localhost:3000/market/view/add", null, {params: {id: loginUser, posting}});
    })

    const marketDelete = async() => {
        const loginUser = cookies.id || false;

        await axios.post("http://localhost:3000/market/delete", null, {params: { id: loginUser, posting }})
        .then((response)=>{
            if (response.status === 200) {
                if (response.data === "MARKET_DELETE_OK") {
                    alert("게시물이 삭제되었습니다.")
                    navigator("/market");
                    return;
                }
                if (response.data === "MARKET_DELETE_NO") {
                    alert("게시물 삭제에 실패하였습니다.");
                }
            }
            if (response.status === 500) {
                alert("서버통신오류.");
                return;
            }
        })
    }

    const clickReportBtn = () => {
        setActiveReportModal(true);
    }
    return(
        <div>  
            <div>
                <h1>{title}</h1>
                <p>작성자: {id}</p>
                <p>작성일자: {wdate}</p>
                <p>카테고리: {category}</p>
                <p>거래분류: {state}</p>
                <p>제품: {productName} {productNumber}개</p>
                <p>제품상태: {conditions}</p>
            </div>
            <img src={`data:image/jpeg;base64,${imgInfo}`} alt="대표이미지" />
            <div dangerouslySetInnerHTML={{__html: `${content}`}}></div>
            <KakaoMapRead geoLat={geoLat} geoLng={geoLng}/>
            {updateActive ?
            (<Link to={`/market/update/${posting}`} state={location.state} >수정하기</Link>)
            :
            null
            }
            {updateActive ?
            <button onClick={marketDelete}>삭제하기</button>
            :
            null
            }
            <button onClick={clickReportBtn}>신고</button>
            {activeReportModal ?
            <MarketReport writer={id} setActiveReportModal={setActiveReportModal}/>
            :
            null
            }
        </div>
    );
}

export default MarketDetail;