import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function InitPage() {
    const cookies = useCookies(["USER_ID"]);
    const navigate = useNavigate();
    useEffect(()=>{
        // 쿠키가 없으면
        if(!cookies) {
            navigate("/login");
            return
        }
        navigate("/home/home");
        return;
    })
    return(
        <>
        </>
    );
}

export default InitPage;