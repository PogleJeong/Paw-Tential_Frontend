// 게시물작성
// CKEditor 사용
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import session from "react-session-api";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import UploadAdapter from '../../utils/UploadAdaptor';
import axios from 'axios';
import KakaoMapWrite from '../../component/GeoAPI';
import { FaRegFile } from 'react-icons/fa';

const stateList = ["나눔", "판매"];
const categories = ["완구류", "침구류", "간식류", "주식", "음료", "기타"];
const conditionList = ["최상","상","중","하"];

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

const MarketWrite = () => {
    const [ user, setUser ] = useState(session.get("user"));
    const title = useInput("제목", maxLen, 500);
    const [ content, setContent ] = useState("<p>Hello from CKEditor 5!</p>"); // api 에서 유효성검사진행
    const state = useInput(stateList[0], maxLen, 45);
    const category = useInput(categories[0], maxLen, 45);
    const productName = useInput("", maxLen, 45);
    const productNumber = useInput("1", maxLen, 3); // 0~999개 까지
    const conditions = useInput(conditionList[0], maxLen, 45);
    const [ imgFile, setImgFile ] = useState("market_base_image"); // 대표이미지 파일
    const [ geoLat, setGeoLat ]= useState(0);
    const [ geoLng, setGeoLng ]= useState(0);
    const navigator = useNavigate();

    const imgRef = useRef();
    useEffect(()=>{
        // 로그인한 유저인지 확인
        const userSession = session.get("user") || false;
        if (!userSession){
            alert("로그인을 해주세요");
            navigator("/");
        }
        setUser(userSession);
    },[])

    const marketUpload = async() => {
        if (!title){
            alert("제목을 입력해주세요.");
            return;
        }
        if(!content) {
            alert("내용을 입력해주세요.");
            return;
        }
        if (!state) {
            alert("거래분류를 입력해주세요.");
            return;
        }
        if (!conditions) {
            alert("제품상태를 입력해주세요.");
            return;
        }
        if (!category) {
            alert("카테고리를 입력해주세요.");
            return;
        }
        if (!productName) {
            alert("제품이름을 입력해주세요.");
            return;
        }
        if(!productNumber) {
            alert("제품개수를 확인해주세요");
            return;
        }

        let marketInfo = { title: title.value,
            content,
            id: user,
            state: state.value,
            category: category.value,
            productName: productName.value,
            productNumber: productNumber.value,
            conditions: conditions.value,
            geoLat,
            geoLng, };

        let formData = new FormData();
        formData.append("file", imgRef.current.files[0] || null);
        formData.append("marketInfo", new Blob([JSON.stringify(marketInfo)], {type: "application/json"}))

        await axios.post("http://localhost:3000/market/write", null, formData)
        .then((response) =>{
            if (response.data === "MARKET_WRITE_NO") {
                alert("게시물 등록에 실패하였습니다.");
            }
            alert("게시물이 등록되었습니다.");
            navigator("/market");
        })
    }
    const onLoadFile = () => {

    }
    return(
        <div>
            <h2>Using CKEditor 5 build in React</h2>
            <label>
                제목
                <input type="text" {...title} placeholder='제목을 작성해주세요'/>
            </label>
            <p>작성자 {user}</p>
            <p>작성날짜 {new Date().toLocaleString('ko-KR')}</p>
            <label>거래분류
                <select {...state}>
                    {stateList.map((state, index) =>
                    (<option key={index} >{state}</option>))}
                </select>
            </label><br/>
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
            <label>대표이미지
                <img src={imgFile} style={{width: "200px", aspectRatio: "16/9"}} alt="" /><br/>
                <input ref={imgRef} type="file" onChange={onLoadFile} />
            </label>


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
                    console.log(content);
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
        </div>
    );
}

export default MarketWrite;