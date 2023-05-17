import "https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js";
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import kakao from "../../../image/kakao_login_icon.png";
import naver from "../../../image/btnG_naver.png";


const Container = styled.div`
    margin-top: 30px;
`;

const Subscribe = styled.p`
    font-size : 15px;
    opacity: 0.5;
`
const Banner = styled.img.attrs({type: "button"})`
    border-none: none;
    width: 200px;
    height: 50px;
    background-size: cover;
    padding: 10px;
    border-radius: 15px;
`

const NaverBanner = styled(Banner)`
    background: url(${naver});
`;

const KakaoBanner = styled(Banner)`
    background: url(${kakao});
`;

const SimpleSNSLogin = () => {
    const navigate = useNavigate();
    // 카카오 로그인
    // AUTH_URL 으로 이동하면 KAKAO 로그인창이 뜨고, 로그인창에서 ID, PASSWORD 를 입력하고 로그인하면 AUTH(인가)를 얻는다.
    // 로그인후 REDIRECT_URI 로 이동됨.
    const simpleLoginKakao = () => {
        const REST_API_KEY = "83e8bb6f53c1f3fcc8901a9678d3eaa3";
        const REDIRECT_URI = "http://localhost:3000/kakaoAuth";
        const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        navigate(KAKAO_AUTH_URL);
    };

    const simpleLoginNaver = () => {
        const CLIENT_ID = "UP1Ll7qeXuqAoC6oqcxk";
        const STATE_STRING = "1234ABCD";
        const CALLBACK_URL = "http://localhost:3000/naverAuth";
        const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&state=${STATE_STRING}&redirect_uri=${CALLBACK_URL}`
        window.location.href = NAVER_AUTH_URL;
    };
    return(
        <Container>
            <Subscribe>SNS 간편로그인</Subscribe>
            {/*<input type="button" onClick={simpleLoginKakao} style={{border: "none", width: "200px", height: "50px", background: `url(${kakao}) no-repeat`, backgroundSize: "cover", padding: "10px", borderRadius: "15px"}}/> */}
            <input type="button" onClick={simpleLoginNaver} style={{border: "none", width: "200px", height: "50px", background: `url(${naver}) no-repeat`, backgroundSize: "cover", padding: "10px", borderRadius: "15px"}}/>
        </Container>
    );
};

//style={{border: "none", width: "200px", height: "50px", background: `url(${naver}) no-repeat`, backgroundSize: "cover", padding: "10px", borderRadius: "15px"}}


export default SimpleSNSLogin;