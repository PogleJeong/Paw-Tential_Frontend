// 게시물작성
// CKEditor 사용
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useCookies } from "react-cookie";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import KakaoMapWrite from './components/GeoAPI';

import UploadAdapter from '../../utils/UploadAdaptor';
import useGeolocation from '../../utils/GeoPosition';
import { useInput, maxLen } from '../../utils/UseHook';
import { styled, keyframes } from 'styled-components';

import baseImg from '../../image/market_base_image.jpg';

const fadeIn = keyframes`
    0% {
    opacity: 0;
    }
    100% {
    opacity: 1;
    }
`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 0px;
    padding: 100px;
    width: 80%;
    height: 1200px;

    animation: ${fadeIn} 2s;
`;

const Wrappers = styled.div`
    width: 1000px;
    height: 1000px;

    padding: 50px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 2px 3px 5px 0px;
`;
const HeaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ImageBox= styled.div`
    width:450px;
    height: 450px;
`;

const Title = styled.h1`
    font-size: 30px;
    text-align: center;
    padding: 30px;
    margin-bottom: 20px;
    border-radius: 15px;
    background-color: #99FFCC;
`;

const Label = styled.label`
    display: inline-block;
    width: 60px;
    padding-top: 10px;
    padding-bottom: 10px;
    text-align: center;
    font-weight: bold;
`;

const Thumbnail = styled.img`
    width: 400px;
    height: 400px;
    border: 5px solid black;
    border-radius: 40px;
`
const FileBtn = styled.input.attrs({type: "file"})`
    border: none;
    border: radius: 15px;
    background-color: #66FFCC;
`;

const InfoBox = styled.div`
    width: 400px;
    height: 400px;
    margin: 30px;
    padding: 30px; 
`








const stateList = ["--분류--","나눔", "판매"];
const categories = ["--카테고리--", "완구류", "침구류", "간식류", "주식", "음료", "기타"];
const conditionList = ["--제품상태--","최상","상","중","하"];

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
    }
}

const MarketWrite = () => {
    const geoLocation = useGeolocation();
    const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID", "USER_NICKNAME"]);
    const title = useInput("제목", maxLen, 500);
    const [ content, setContent ] = useState("<p>Hello from CKEditor 5!</p>"); // api 에서 유효성검사진행
    const state = useInput(stateList[0], maxLen, 45);
    const price = useInput("0", maxLen, 7);
    const category = useInput(categories[0], maxLen, 45);
    const productName = useInput("", maxLen, 45);
    const productNumber = useInput("1", maxLen, 3); // 0~999개 까지
    const conditions = useInput(conditionList[0], maxLen, 45);
    const [ imgFile, setImgFile ] = useState(baseImg); // 대표이미지 파일
    const [ geoLat, setGeoLat ]= useState(geoLocation.coordinates.lat);
    const [ geoLng, setGeoLng ]= useState(geoLocation.coordinates.lng);
    const navigator = useNavigate();
    const imgRef = useRef();
    const [ triggerPrice, setTriggerPrice ] = useState(false);

    useEffect(()=>{
        // 로그인한 유저인지 확인
        if (!cookies.USER_ID){
            alert("로그인을 해주세요");
            navigator("/");
            return;
        }
    },[])

    // 판매분류가 될 경우 가격 작성가능
    useEffect(()=>{
        state.value === "판매" ? setTriggerPrice(true) : setTriggerPrice(false);
    }, [state.value]);

    const marketUpload = async() => {
   
        if (!title.value){
            alert("제목을 입력해주세요.");
            return;
        }
        if(!content) {
            alert("내용을 입력해주세요.");
            return;
        }
        if (!state.value || state.value === stateList[0]) {
            alert("거래분류를 선택해주세요.");
            return;
        }
        if (!conditions.value || conditions.value === conditionList[0]) {
            alert("제품상태를 선택해주세요.");
            return;
        }
        if (!category.value || category.value === categories[0]) {
            alert("카테고리를 선택해주세요.");
            return;
        }
        if (!productName.value) {
            alert("제품이름을 입력해주세요.");
            return;
        }
        if(!productNumber.value) {
            alert("제품개수를 확인해주세요");
            return;
        }

        if (!imgRef.current.files[0]) {
            alert("대표이미지를 입력해주세요");
            return;
        }

        let marketInfo = { title: title.value,
            content,
            id: cookies.USER_ID,
            state: state.value,
            category: category.value,
            price: price.value,
            productName: productName.value,
            productNumber: productNumber.value,
            conditions: conditions.value,
            geoLat,
            geoLng, };

        let formData = new FormData();
        formData.append("file", imgRef.current.files[0]);
        formData.append("marketInfo", new Blob([JSON.stringify(marketInfo)], {type: "application/json"}));
        await axios.post("http://localhost:3000/market/write", formData, {"Content-Type": `multipart/form-data`})
        .then((response) =>{
            if (response.status === 200) {
                if (response.data === "MARKET_WRITE_NO") {
                    alert("게시물 등록에 실패하였습니다.");
                }
                alert("게시물이 등록되었습니다.");
                navigator("/market");
            }
        })
    }
    const onLoadFile = () => {
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file); // file을 url로 읽고
        reader.onloadend = () => { // 읽기가 끝나면
          setImgFile(reader.result); // reader 결과(이미지)를 img 태그에 설정
        }
    }
    return(
        <Container>
            <Wrappers>
                <Title>Market 작성하기</Title>
                <HeaderWrapper>
                    <ImageBox>
                        <Thumbnail src={imgFile} alt="" /><br/>
                        <FileBtn ref={imgRef} onChange={onLoadFile} />
                    </ImageBox>
                    <InfoBox>
                        <Label>제목 </Label>
                           
                       

                    </InfoBox>
                </HeaderWrapper>
            <label>
                
                <input type="text" {...title} placeholder='제목을 작성해주세요'/>
            </label>
            <p>작성자 {`${cookies.USER_NICKNAME}(${cookies.USER_ID})`}</p>
            <p>작성날짜 {new Date().toLocaleString('ko-KR')}</p>
            <label>거래분류
                <select {...state}>
                    {stateList.map((state, index) =>
                    (<option key={index} >{state}</option>))}
                </select>
            </label><br/>
            {triggerPrice ? (
                <>
                <label>
                가격
                <input type="number" {...price} placeholder='가격' />
                </label><br/>
            </>
            ) : (
                null
            )}
            
            <label>제품분류
                <select {...category}>
                    {categories.map((category, index) =>
                    (<option key={index} >{category}</option>))}
                </select>
            </label><br/>
            <label>제품명
                <input type="text" {...productName} placeholder='제품명' />
            </label><br/>
            <label>개수
                <input type="number" {...productNumber} placeholder='개수'/>
            </label><br/>
            <label>제품상태
                <select {...conditions}>
                    {conditionList.map((condition, index)=>
                    (<option key={index}>{condition}</option>))}
                </select>
            </label><br/>
            


            <CKEditor
                editor={ ClassicEditor }
                data={content} //안에 들어가는 문자열 input.value
                config={{extraPlugins: [MyCustomUploadAdapterPlugin]}}
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setContent(data);
                } }
                onBlur={ ( event, editor ) => {
                    console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    console.log( 'Focus.', editor );
                } }
            />
            <KakaoMapWrite setGeoLat={setGeoLat} setGeoLng={setGeoLng}/>
            <button onClick={marketUpload}>작성하기</button>
            </Wrappers>
        </Container>
    );
}

export default MarketWrite;