// 게시물작성
// CKEditor 사용
import { useLocation } from "react-router-dom";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import session from "react-session-api";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import UploadAdapter from '../../utils/UploadAdaptor';
import axios from 'axios';
import KakaoMapUpdate from '../../component/GeoAPI3';


const stateList = ["--분류--","나눔", "판매"];
const categories = ["--카테고리--", "완구류", "침구류", "간식류", "주식", "음료", "기타"];
const conditionList = ["--제품상태--","최상","상","중","하"];

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new UploadAdapter(loader)
    }
}

const useInput = (initialValue, validator, valid) => {
    const [ value, setValue ] = useState(initialValue);
    const onChange = (event) => {
        const value = event.currentTarget.value;
        let willUpdate = true;
        if (typeof validator === "function") {
            willUpdate = validator(value, valid);
            if( willUpdate) {
                setValue(value);
            }
        }
    }
    return { value, onChange };
}

const maxLen = (value, valid) => ( value.length <= valid );

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
    const imgRef = useRef();
    const [ imgFile, setImgFile ] = useState(`data:image/jpeg;base64,${imgInfo}`);
    const navigator = useNavigate();

    const [ triggerPrice, setTriggerPrice ] = useState(false);
    useEffect(()=>{
        // 로그인한 유저인지 확인
        const userSession = session.get("user") || false;
        if (!userSession){
            alert("로그인을 해주세요");
            navigator("/");
        }
        setUser(userSession);
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
        if (!imgRef.current.files[0]) {
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
        formData.append("file", imgRef.current.files[0])
        formData.append("marketInfo", new Blob([JSON.stringify(updateMarketInfo)], {type: "application/json"}))
        await axios.post("http://localhost:3000/market/update", formData, {"Content-type": "multipart/form-data"})
        .then((response) =>{
            if (response.data === "MARKET_UPDATE_NO") {
                alert("게시물 수정에 실패하였습니다.");
            }
            alert("게시물이 수정되었습니다.");
            navigator("/market");
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
        <div>
            <h2>Market 작성하기</h2>
            <label>
                제목
                <input type="text" {...updateTitle} placeholder='제목을 작성해주세요'/>
            </label>
            <p>작성자 {user}</p>
            <p>작성날짜 {new Date().toLocaleString('ko-KR')}</p>
            <label>거래분류
                <select {...updateState}>
                    {stateList.map((updateState, index) =>
                    (<option key={index} >{updateState}</option>))}
                </select>
            </label><br/>
            {triggerPrice ? (
            <label>
                가격
                <input type="number" {...title} placeholder='가격' />
            </label>
            ) : (
                null
            )}
            <label>제품분류
                <select {...updateCategory}>
                    {categories.map((category, index) =>
                    (<option key={index} >{category}</option>))}
                </select>
            </label><br/>
            <label>제품명
                <input type="text" {...updateProductName} placeholder='제품명' />
            </label><br/>
            <label>개수
                <input type="number" {...updateProductNumber} placeholder='개수'/>
            </label><br/>
            <label>제품상태
                <select {...updateConditions}>
                    {conditionList.map((condition, index)=>
                    (<option key={index}>{condition}</option>))}
                </select>
            </label><br/>
            <label>대표이미지
                <img src={imgFile} style={{width: "200px", aspectRatio: "16/9"}} alt="" /><br/>
                <input ref={imgRef} type="file" onChange={onLoadFile} />
            </label>

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
            <KakaoMapUpdate setUpdateGeoLat={setUpdateGeoLat} setUpdateGeoLng={setUpdateGeoLng} prevLat={geoLat} prevLng={geoLng}/>
            <button onClick={marketUpdate}>수정하기</button>
        </div>
        );
};

export default MarketUpdate;