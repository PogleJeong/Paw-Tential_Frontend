import { useState, useEffect } from "react";
import ContestDetailModal from '../router/newContest/modal/ContestDetailModal';
import axios from 'axios';

export default function ContestList(props) {

    const [content, setContent] = useState('');
    const fetchData = async () => {
        await axios.get("http://localhost:3000/contest/fetchData", {params:{"seq":props.data.seq}})
        .then(function(res){
            setContent(res.data.content);
            getImage();
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 콘테스트 상세 모달
    const [contestDetailModal, setContestDetailModal] = useState(false);

     // 콘테스트 내용의 첫 번째 이미지만 가져오기
    const [image, setImage] = useState([]);

    const getImage = () => {
        const regex = /<img src="([^"]+)"/g;
        const urls = [];

        let match;
        while ((match = regex.exec(content)) !== null) {
            urls.push(match[1]);
        }

        setImage(urls[0]);
    };

    useEffect(()=>{
        fetchData();
    },[props.key, content])

    return (
        <>
        <ContestDetailModal show={contestDetailModal} onHide={()=>{setContestDetailModal(false);}} data={props.data} fn={fetchData}/>
        <img className="img-fluid rounded w-100" alt="contest" src={image} onClick={()=>{setContestDetailModal(true)}}/>
        </>
    )
}