// 게시물작성
// CKEditor 사용
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { styled, keyframes } from "styled-components";

import { useInput, maxLen } from '../../utils/UseHook';
import dataURLtoFile from '../../utils/DataURL2File';
import UploadAdapter from '../../utils/UploadAdaptor';
import KakaoMapUpdate from './components/GeoAPI3';
import './style/style.css';

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
    flex-wrap: wrap;
    margin: 50px 10%;
    padding: 100px;
    width: 80%;
    height: 1900px;

    animation: ${fadeIn} 2s;
`;

const FlexBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 450px;
    min-height: 60px;
    border: none;
    border-radius: 15px;
    box-shadow: 2px 3px 5px 0px;

`

const Wrappers = styled.div`
    width: 1000px;
    height: 1500px;
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
    width: 450px;
    height: 430px;
    text-align: center;
`;

const Title = styled.h1`
    font-size: 30px;
    text-align: center;
    margin-bottom: 10px;
    padding: 20px;
    border-bottom: 3px solid black;
    
    color: black;
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
    width: 450px;
    height: 400px;
    border: 5px solid whitesmoke;
`;

const FileName = styled.span`
    display: inline-block;
    height: 40px;
    margin-top: 5px;
    padding: 10px 10px;
    vertical-align: middle;
    border: 1px solid #dddddd;
    width: 280px;
    color: #999999;
`

const FileBtn = styled.input.attrs({type: "file"})`
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
`;

const FileLabel = styled.label`
    display: inline-block;
    margin-top: 5px;
    padding: 10px;
    color: #fff;
    vertical-align: middle;
    background-color: #999999;
    cursor: pointer;
    height: 40px;
    margin-left: 5px;
`

const InfoBox = styled.div`
    width: 450px;
    height: 450px;
    padding-left: 30px;
    padding-right: 30px;
`

const InputBox = styled.input.attrs({required: true})`
    width: 300px;
    height: 40px;
    padding: 5px;
    margin: 5px;
    border: none;
    border-bottom: 2px solid black;
    font-size: 15px;

    &:focus {
        background-color: rgba(255, 207, 159, 0.4);
    }
`

const MsgBox = styled.span`
    display: inline-block;
    width: 100%;
    height: 40px;
    font-size: 15px;
    font-weight: bold;
    color: black;
`

const SelectBox = styled.select`
    width: 100px;
    height: 40px;
    margin: 5px;
    border: none;
    border-bottom: 2px solid black;
    text-align: center;

    &:focus {
        background-color: rgba(255, 207, 159, 0.4);
    }
`

const BodyWrapper = styled.div`
    margin-top: 30px;
    width: 100%;
    height: 450px;
`;

const FooterWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`

const WriteBtn = styled.button`
    width: 100px;
    margin: 0px 60px;
    height: 40px;
    border: none;
    border-radius: 10px;
    background-color: saddlebrown;

    transition: scale 1s;
    &:hover {
        scale: 0.9;
        box-shadow: 2px 3px 5px 0px;
    }
`;

const stateList = ["-분류-","나눔", "판매"];
const categories = ["-카테고리-", "완구류", "침구류", "간식류", "주식", "음료", "기타"];
const conditionList = ["-제품상태-","최상","상","중","하"];

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
    }
}

const MarketUpdate = () => {
    // Link state 로 데이터를 보내고 useLocation 을 통해 받음.
    const location = useLocation();
    const { title, content, id, category, state, price, conditions, productName, productNumber, geoLat, geoLng, posting } = location.state.marketInfo;
    const imgInfo = location.state.imgInfo;

    const [ user, setUser ] = useState(id);
    const updateTitle = useInput(title, maxLen, 500);
    const [ updateContent, setUpdateContent ] = useState(content); // api 에서 유효성검사진행
    const updateState = useInput(state, maxLen, 45);
    const updatePrice = useInput(price, maxLen, 7);
    const updateCategory = useInput(category, maxLen, 45);
    const updateProductName = useInput(productName, maxLen, 45);
    const updateProductNumber = useInput(productNumber, maxLen, 3); // 0~999개 까지
    const updateConditions = useInput(conditions, maxLen, 45);
    const [ updateGeoLat, setUpdateGeoLat ]= useState(geoLat);
    const [ updateGeoLng, setUpdateGeoLng ]= useState(geoLng);
    const [ imgFile, setImgFile ] = useState(`data:image/jpeg;base64,${imgInfo}`);
    const imgRef = useRef();
    const filenameRef = useRef();
    const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID","USER_NICKNAME"]);
    const navigate = useNavigate();

    const [ triggerPrice, setTriggerPrice ] = useState(false);
    useEffect(()=>{
        if (!cookies.USER_ID) {
            alert("로그인 후 이용해주세요.");
            navigate("/");
            return;
        }
        if (cookies.USER_ID !== user) {
            alert("해당 게시물을 수정할 권한이 없습니다.");
            return;
        }
    },[])

    useEffect(()=>{
        state.value === "판매" ? setTriggerPrice(true) : setTriggerPrice(false);
    }, [state.value]);

    const marketUpdate = async() => {
        if (!updateTitle){
            alert("제목을 입력해주세요.");
            return;
        }
        if(!updateContent) {
            alert("내용을 입력해주세요.");
            return;
        }
        if (!updateState || updateState === stateList[0]) {
            alert("거래분류를 선택해주세요.");
            return;
        }
        if (!updateConditions || updateConditions === conditionList[0]) {
            alert("제품상태를 입력해주세요.");
            return;
        }
        if (!updateCategory || updateCategory === categories[0]) {
            alert("카테고리를 입력해주세요.");
            return;
        }
        if (!updateProductName) {
            alert("제품이름을 입력해주세요.");
            return;
        }
        if(!updateProductNumber) {
            alert("제품개수를 확인해주세요");
            return;
        }
        if (!imgFile) {
            alert("대표이미지를 선택해주세요");
            return;
        }
        const updateMarketInfo = {
            title: updateTitle.value,
            content: updateContent,
            id,
            state: updateState.value,
            price: updatePrice.value,
            category: updateCategory.value,
            productName: updateProductName.value,
            productNumber: updateProductNumber.value,
            conditions: updateConditions.value,
            geoLat: updateGeoLat,
            geoLng: updateGeoLng,
            posting
        }

        const formData = new FormData();
    
        formData.append("marketInfo", new Blob([JSON.stringify(updateMarketInfo)], {type: "application/json"}))
        let file = dataURLtoFile(imgFile,"image.jpeg")
        formData.append("file", file)
        
        
        await axios.post("http://localhost:3000/market/update", formData, {"Content-type": "multipart/form-data"})
        .then((response) =>{
            if (response.data === "MARKET_UPDATE_NO") {
                alert("게시물 수정에 실패하였습니다.");
            }
            alert("게시물이 수정되었습니다.");
            navigate("/market");
        })
    };

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
                <Title>Market 수정하기</Title>
                <HeaderWrapper>
                <ImageBox>
                        <Thumbnail  src={imgFile} alt="" /><br/>
                        <FileName ref={filenameRef}>첨부파일</FileName>
                        <FileLabel>파일찾기
                            <FileBtn ref={imgRef} onChange={onLoadFile} />
                        </FileLabel>
                    </ImageBox>
                    <InfoBox>
                        <MsgBox>작성자  | &#9;{`${cookies.USER_NICKNAME}(${cookies.USER_ID})`}</MsgBox>
                        <MsgBox>작성날짜  | &#9; {new Date().toLocaleString('ko-KR')}</MsgBox>

                        <Label>제목</Label>
                        <InputBox {...title} placeholder='제목을 작성해주세요'/><br/>

                        <Label>거래분류</Label>
                        <SelectBox {...updateState}>
                            {stateList.map((state, index) => (<option key={index} >{state}</option>))}
                        </SelectBox><br/>

                        {triggerPrice ? (
                        <>
                            <Label>가격</Label>;    
                            <InputBox type="number" {...updatePrice} placeholder='가격을 입력해주세요' /><br/>;
                        </>
                        ) : null}

                        <Label>제품분류</Label>
                        <SelectBox {...updateCategory}>
                            {categories.map((category, index) => (<option key={index} >{category}</option>))}
                        </SelectBox><br/>

                        <Label>제품명</Label>
                        <InputBox type="text" {...updateProductName} placeholder='제품명을 입력해주세요' /><br/>
                        
                        <Label>제품개수</Label>
                        <InputBox type="number" {...updateProductNumber} placeholder='개수를 입력해주세요'/><br/>
                        
                        <Label>제품상태</Label>
                        <SelectBox {...updateConditions}>
                            {conditionList.map((condition, index) => (<option key={index}>{condition}</option>))}
                        </SelectBox><br/>

                    </InfoBox>
                </HeaderWrapper>
                <BodyWrapper>
                    <CKEditor
                        editor={ ClassicEditor }
                        data={`${content}`} // 이전 글
                        config={{extraPlugins: [MyCustomUploadAdapterPlugin]}}
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            console.log( 'Editor is ready to use!', editor );
                        } }
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setUpdateContent(data);
                        } }
                        onBlur={ ( event, editor ) => {
                            console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                            console.log( 'Focus.', editor );
                        } }
                    />
                </BodyWrapper>
                <FooterWrapper>
                    <KakaoMapUpdate setUpdateGeoLat={setUpdateGeoLat} setUpdateGeoLng={setUpdateGeoLng} prevLat={geoLat} prevLng={geoLng}/>
                </FooterWrapper>
            </Wrappers>
            <FlexBox>
                <WriteBtn onClick={marketUpdate}>수정하기</WriteBtn>
            </FlexBox>
        </Container>
    );
};

export default MarketUpdate;