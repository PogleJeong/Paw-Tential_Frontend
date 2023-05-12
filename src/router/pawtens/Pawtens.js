import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import "../../styles/pawtens.css";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Pawtens(){

    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    const [pawtensList, setPawtensList] = useState([]);
    // 슬라이더 설정
    const settings = {
        dots: false, // 개수 표시 점
        infinite: true, // 무한 캐러셀
        autoplay: false, // 자동 캐러셀
        draggable: true, // 드래그      
        arrows: true, // 좌,우 버튼
        vertical: false, // 세로 캐러셀
        centerPadding: '0px' // 중앙 컨텐츠 padding 값
    };

    function getPawtenslist() {
        axios.get("http://localhost:3000/pawtens")
        .then(function(resp){
            setPawtensList(resp.data.list);
        })
        .catch(function(err){
            alert(err);
        });
    }

    // 좋아요 처리
    const likeHandler = async (pawtensNo) => {
        axios.post("http://localhost:3000/pawtens/pawtensLike", null, {params:{"pawtens_seq":pawtensNo, "id":cookies.USER_ID}})
        .then(function(res) {
            console.log(res.data);
            getPawtenslist();
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 결과 목록
    const pawtensListMap = pawtensList.map((pawtens, i) => {
        return(
            <div>
                <div className="pawtensItem">
                    <video controls>
                        <source src={"http://localhost:3000/../upload/pawtens/" + pawtens.filename} type="video/mp4" />
                    </video>
                    <div class="d-flex justify-content-between" style={{margin:"15px auto 0 100px"}}>
                        <div class="me-3"><img class="rounded-circle img-fluid profile" src={"../feedimages/" + pawtens.profile + ".png"} alt="포텐스작성자프로필"/></div>
                        <div class="w-100"><div class="d-flex justify-content-between">
                            <div class="">
                                <h5 class="mb-0 d-inline-block"><a href="#" class="">{pawtens.nickname}</a></h5>
                                <p class="mb-0"><i class="ri-global-line pe-1"></i>{pawtens.date_created !== null && pawtens.date_created.substring(0, 10)}</p>
                                
                            </div>
                            <div onClick={()=>{likeHandler(pawtens.seq)}} class="like-block d-flex align-items-center pawtens-like">
                                <div class="total-like-block ms-2 me-3">
                                    <span><img src="/assets/images/icon/01.png" class="img-fluid" alt=""/></span>
                                    <span class="mx-1">{pawtens.likecount === undefined ? 0 : pawtens.likecount} Likes</span>
                                </div>
                            </div>
                        </div></div>
                    </div>
                </div>
            </div>
        )
    });


    useEffect(function(){
        getPawtenslist();
    }, []);

    return (
        <div>
            <h1>포텐스</h1>
            <div className="pawtens">
                { pawtensList !== ""
                    ?
                    <Slider {...settings}>
                        {pawtensListMap}
                    </Slider> 
                    : 
                    <p>포텐스 항목이 없습니다.</p>
                }
            </div>
        </div>
    );
}

export default Pawtens;