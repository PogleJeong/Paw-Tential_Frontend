// 게시물작성
// CKEditor 사용
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { styled, keyframes } from 'styled-components';

import KakaoMapWrite from './components/GeoAPI';

import UploadAdapter from '../../utils/UploadAdaptor';
import useGeolocation from '../../utils/GeoPosition';
import { useInput, maxLen } from '../../utils/UseHook';
import baseImg from '../../image/market_base_image.jpg';
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
    width: 60%;
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
    justify-content: space-between;
    align-items: center;
    margin: 25px 0px;
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

const MarketWrite = () => {
    const geoLocation = useGeolocation();
    const [ cookies, setCookies, removeCookies ] = useCookies(["USER_ID", "USER_NICKNAME"]);


    const title = useInput("", maxLen, 150);
    const [ content, setContent ] = useState(""); // api 에서 유효성검사진행
    const state = useInput(stateList[0], maxLen, 45);
    const price = useInput("0", maxLen, 7);
    const category = useInput(categories[0], maxLen, 45);
    const productName = useInput("", maxLen, 45);
    const productNumber = useInput("1", maxLen, 3); // 0~999개 까지
    const conditions = useInput(conditionList[0], maxLen, 45);
    const [ imgFile, setImgFile ] = useState(baseImg); // 대표이미지 파일
    const [ geoLat, setGeoLat ]= useState(geoLocation.coordinates.lat);
    const [ geoLng, setGeoLng ]= useState(geoLocation.coordinates.lng);
    const navigate = useNavigate();
    const imgRef = useRef();
    const filenameRef = useRef();
    const [ triggerPrice, setTriggerPrice ] = useState(false);

    useEffect(()=>{
        // 로그인한 유저인지 확인
        if (!cookies.USER_ID){
            alert("로그인을 해주세요");
            navigate("/");
            return;
        }
    },[])

    // 판매분류가 될 경우 가격 작성가능
    useEffect(()=>{
        state.value === "판매" ? setTriggerPrice(true) : setTriggerPrice(false);
    }, [state.value]);

    // 파일업로드시 파일이름으로 변경(input type=file 커스텀)
    useEffect(()=>{
        filenameRef.current.innerText = imgRef.current.value;
    },[imgFile])

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

        if (!geoLat || !geoLng) {
            alert("장소를 지정해주세요");
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
                navigate("/market");
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
                        <SelectBox {...state}>
                            {stateList.map((state, index) => (<option key={index} >{state}</option>))}
                        </SelectBox><br/>

                        {triggerPrice ? (
                        <>
                            <Label>가격</Label>;    
                            <InputBox type="number" {...price} placeholder='가격을 입력해주세요' /><br/>;
                        </>
                        ) : null}

                        <Label>제품명</Label>
                        <InputBox type="text" {...productName} placeholder='제품명을 입력해주세요' /><br/>

                        <Label>제품분류</Label>
                        <SelectBox {...category}>
                            {categories.map((category, index) => (<option key={index} >{category}</option>))}
                        </SelectBox><br/>
                        
                        <Label>제품개수</Label>
                        <InputBox type="number" {...productNumber} placeholder='개수를 입력해주세요'/><br/>
                        
                        <Label>제품상태</Label>
                        <SelectBox {...conditions}>
                            {conditionList.map((condition, index) => (<option key={index}>{condition}</option>))}
                        </SelectBox><br/>

                    </InfoBox>
                </HeaderWrapper>
                <BodyWrapper>
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
                </BodyWrapper>
                <FooterWrapper>
                    <KakaoMapWrite setGeoLat={setGeoLat} setGeoLng={setGeoLng}/>
                </FooterWrapper>
            </Wrappers>
            <FlexBox>
                <WriteBtn onClick={marketUpload}>작성하기</WriteBtn>
            </FlexBox>
        </Container>
    );
}

export default MarketWrite;