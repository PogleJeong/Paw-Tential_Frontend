import { useState, useEffect } from "react";
import { Modal, Carousel } from "react-bootstrap";
import ReactHtmlParser from "react-html-parser";
import { useCookies } from "react-cookie";
import ContestComment from "../../../component/ContestComment";
import axios from 'axios';
import ContestModifyModal from "./ContestModifyModal";
import moment from 'moment/moment';

export default function ContestDetailModal(props) {

    // 모달 클릭 시, 상세
    const [category, setCategory] = useState('');
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [startDt, setStartDt] = useState('');
    const [endDt, setEndDt] = useState('');
    const [writeDt, setWriteDt] = useState('');
    const [content, setContent] = useState('');

    const fetchData = async () => {
        axios.get("http://localhost:3000/contest/fetchData", {params:{"seq":props.data.seq}})
        .then(function(res){
            setCategory(res.data.category);
            setId(res.data.id);
            setName(res.data.name);
            setStartDt(res.data.startDt);
            setEndDt(res.data.endDt);
            setWriteDt(res.data.writeDt);
            setContent(res.data.content);
            getImage();
            getNoImage();
        })
    }

    const [contestModifyModal, setContestModifyModal] = useState(false);

    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    // const userId = cookies.USER_ID;
    const userId = 'contestAdmin';

    // content 내에서 이미지, 글 분리하기
    const [image, setImage] = useState([]);
    const [noImage, setNoImage] = useState([]);

    const getImage = () => {
        const regex = /<img src="([^"]+)"/g;
        const urls = [];

        let match;
        while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]);
        }

        setImage(urls);
    };

    const getNoImage = () => {
        const noImage = content;

        const regex = /<img.*?>|<figure.*?>|<\/figure>/gi;
        const result = noImage.replace(regex, "");

        setNoImage(result);
    };

    // CarouselComponent
    const CarouselComponent = () => {

        const [idx, setIdx] = useState(0);
    
        const handleSelect = (selectedIndex, e) => {
            setIdx(selectedIndex);
        };

        return (
            <div className="w-50">
            {image && image.length !== 0 && (
                <Carousel activeIndex={idx} onSelect={handleSelect}>
                {image.map((img, i) => {
                    return (
                        <Carousel.Item key={i}>
                            <img className="d-block w-100" src={img} alt="피드사진" />
                        </Carousel.Item>
                    )
                })}
                </Carousel>
            )}
            </div>
        )
    }

    // 콘테스트 삭제 처리
    const contestDelete = async(seq) => {
        if(window.confirm(`${category}를 삭제 하시겠습니까?`)) {
            axios.get("http://localhost:3000/contest/contestDelete", {params:{"seq":seq}})
            .then(function(res){
                alert(`${category}가 삭제 되었습니다.`);
                window.location.reload();
            })
            .catch(function(err){
                alert(err);
            })
        }
    }

    useEffect(()=>{
        if(props.show) {
            fetchData();
        }
    },[props.show, content])

  return (
    <>
    <ContestModifyModal show={contestModifyModal} onHide={()=>{setContestModifyModal(false)}} seq={props.data.seq} fn={fetchData} fn2={props.fn} />
    <Modal size="xl" show={props.show} onHide={props.onHide} centered>
        <Modal.Header closeButton />
        <Modal.Body>
            <div className="d-flex">
            <CarouselComponent />
                <div className="user-post-data w-50 ms-3">
                    <div className="d-flex justify-content-between">
                        <div className="me-3">
                            <img className="rounded-circle img-fluid" src="/feedimages/logo.png" alt="" style={{width:"60px", height:"55px"}} />
                        </div>
                        <div className="w-100">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h5 className="mb-0 d-inline-block">{id}</h5>
                                    <span className="mb-0 d-inline-block">ㆍ{category}</span>
                                    <p className="mb-0 text-primary">{writeDt.substring(0,10)}</p>
                                </div>
                                {userId === 'contestAdmin' && (
                                <div className="card-post-toolbar">
                                    <div className="dropdown">
                                        <span className="dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="button">
                                            <i className="ri-more-fill" />
                                        </span>
                                        <div className="dropdown-menu m-0 p-0">
                                            <a className="dropdown-item p-3" href="javascript:void(0);" onClick={()=>{setContestModifyModal(true)}}>
                                                <div className="d-flex align-items-top">
                                                    <div className="h4">
                                                        <i className="ri-edit-line" />
                                                    </div>
                                                    <div className="data ms-2">
                                                        <h6>{category} 수정</h6>
                                                        <p className="mb-0">{category}를 수정합니다.</p>
                                                        </div>
                                                </div>
                                            </a>
                                            <a className="dropdown-item p-3" href="javascript:void(0);" onClick={()=>{contestDelete(props.data.seq)}}>
                                                <div className="d-flex align-items-top">
                                                    <div className="h4">
                                                        <i className="ri-delete-bin-line" />
                                                    </div>
                                                    <div className="data ms-2">
                                                        <h6>{category} 삭제</h6>
                                                        <p className="mb-0">{category}를 삭제합니다.</p>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                    {props.data.category === "당첨자 발표" && (
                        <h5>🎉당첨자를 발표합니다!</h5>
                    )}
                        <p className="mt-3">{ReactHtmlParser(noImage)}</p>
                        {props.data.category === "콘테스트" && (
                        <h5>📅 기간 : {moment(startDt).locale("ko").format("YY.MM.DD")} 부터 {moment(endDt).locale("ko").format("YY.MM.DD")} 까지</h5>
                        )}
                    </div>
                    <hr />
                    <ContestComment seq={props.data.seq} userId={userId}/>
                </div>
            </div> {/* end of d-flex */}
        </Modal.Body>
    </Modal>
    </>
  );
}
