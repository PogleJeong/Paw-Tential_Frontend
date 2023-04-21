import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import session from "react-session-api";

// 쿼리스트링 : url 에서 ? 뒤부분에 속한느 부분 : 접근하기 위해서 useSearchParams 를 사용할 수 있다.
// useParams 는 url 에서 사용되는 params 을 가져오고, useSearchParams 은 url 에서 쿼리스트링을 쓴다.
const KakaoAuth = () => {
    const [ params, setParams ] = useSearchParams();
    const navigator = useNavigate();
    useEffect(()=>{
        session.set("user", params); // 세션에 저장하고
        navigator("/"); // 메인피드로 이동
    },[])
}
export default KakaoAuth;