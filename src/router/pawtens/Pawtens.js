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
        arrows: false, // 좌,우 버튼
        vertical: false, // 세로 캐러셀
        centerPadding: '0px' // 중앙 컨텐츠 padding 값
    };
    // 데이터를 모두 읽을 때까지 rendering 조절하는 변수
    const [loading, setLoading] = useState(false);

    // 포텐스 목록 불러오기
    function getPawtenslist() {
        axios.get("http://localhost:3000/pawtens")
        .then(function(resp){
            setPawtensList(resp.data.list);
            setLoading(true);   // 데이터를 다 읽어들임 -> rendering true
        })
        .catch(function(err){
            alert(err);
        });
    }

    // 각 포텐스 내용 출력 + 좋아요 처리 component
    const PawtensItem = ((props)=>{

        const [likeCount, setLikeCount] =useState(props.pawtens.likecount);
        if(likeCount === undefined){
            setLikeCount(0);
        }

        // 좋아요 처리
        const likeHandler = async (pawtensNo) => {
            axios.post("http://localhost:3000/pawtens/pawtensLike", null, {params:{"pawtens_seq":pawtensNo, "id":cookies.USER_ID}})
            .then(function(res) {
                console.log(res.data);
                if(res.data === "좋아요 반영"){
                    setLikeCount(likeCount +1);
                } else {
                    setLikeCount(likeCount -1);
                }
            })
            .catch(function(err){
                alert(err);
            })
        }

        return(
            <>
                <div className="pawtensItem">
                    <video controls>
                        <source src={"http://localhost:3000/../upload/pawtens/" + props.pawtens.filename} type="video/mp4" />
                    </video>
                    <p style={{margin:"15px auto 0 30px"}}>{props.pawtens.content}</p>
                    <div class="d-flex justify-content-between" style={{margin:"15px auto 0 30px"}}>
                        <div class="me-3"><img class="rounded-circle img-fluid profile" src={"../feedimages/" + props.pawtens.profile + ".png"} alt="포텐스작성자프로필"/></div>
                        <div class="w-100"><div class="d-flex justify-content-between">
                            <div class="">
                                <h5 class="mb-0 d-inline-block"><a href="#" class="">{props.pawtens.nickname}</a></h5>
                                <p class="mb-0"><i class="ri-global-line pe-1"></i>{props.pawtens.date_created !== null && props.pawtens.date_created.substring(0, 10)}</p>
                            </div>
                            <div onClick={()=>{likeHandler(props.pawtens.seq)}} class="like-block d-flex align-items-center pawtens-like">
                                <div class="total-like-block ms-2 me-3">
                                    <span><img src="/assets/images/icon/01.png" class="img-fluid" alt=""/></span>
                                    <span class="mx-1">{likeCount} Likes</span>
                                </div>
                            </div>
                        </div></div>
                    </div>
                </div>
            </>
        )
    });

    useEffect(function(){
        getPawtenslist();
    }, []);

    if(!loading){
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="container mt-3">
                <h1>Pawtens</h1>
                <div className="pawtens mt-3">
                    { pawtensList.length !== 0
                        ?
                        <Slider {...settings}>
                            {pawtensList.map((pawtens, i) => (
                                <PawtensItem key={i} pawtens={pawtens} />
                            ))}
                        </Slider> 
                        : 
                        <p>포텐스 항목이 없습니다.</p>
                    }
                </div>
            </div>
        </>
    );
}

export default Pawtens;