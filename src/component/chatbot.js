import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import ChatBot from "react-simple-chatbot";
import { Link } from "react-router-dom";

const ThemedExample = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatbotPosition, setChatbotPosition] = useState({
        x: 0,
        y: 0,
    });

    const [isDragging, setIsDragging] = useState(false);
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

    const handleChatbotClick = () => {
        setShowChatbot(true);
    };

    const handleChatbotClose = () => {
        setShowChatbot(false);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setMouseOffset({
            x: e.clientX - chatbotPosition.x,
            y: e.clientY - chatbotPosition.y,
        });
    };

    const handleMouseUp = (e) => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setChatbotPosition({
                x: e.clientX - mouseOffset.x,
                y: e.clientY - mouseOffset.y,
            });
        }
    };

    const chatbotStyle = {
        position: "fixed",
        top: chatbotPosition.y,
        left: chatbotPosition.x,
    };

    const theme = {
        background: "#e3eaf1",
        fontFamily: "Helvetica Neue",
        headerBgColor: "#b0e0bd",
        headerFontColor: "#faf5f5",
        headerFontSize: "15px",
        botBubbleColor: "#a5e0c5",
        botFontColor: "#fff",
        userBubbleColor: "#fff",
        userFontColor: "#4a4a4a",
    };
    const steps = [
        {
            id: "1",
            message: "포텐셜에 오신것을 환영합니다 ʚ🧸ྀིɞ",
            trigger: "2",
        },
        {
            id: "2",
            user: true,
            trigger: "3",
        },
        {
            id: "3",
            options: [
                { value: 1, label: "입마개 착용 기준", trigger: "입마개 착용 기준" },
                { value: 2, label: "반려 동물의 종류", trigger: "반려 동물의 종류" },
                {
                    value: 3,
                    label: "반려동물 등록 번호 조회 방법",
                    trigger: "반려동물 등록 번호 조회 방법",
                },
                {
                    value: 4,
                    label: "반려동물을 위한 재난 대처법",
                    trigger: "반려동물을 위한 재난 대처법",
                },
                { value: 5, label: "포텐셜이란?", trigger: "포텐셜이란?" },
                { value: 6, label: "포텐셜 사용방법", trigger: "포텐셜 사용방법" },
            ],
        },

        {
            id: "입마개 착용 기준",
            message:
                "현행 동물보호법상 맹견으로 규정돼 외출 시 입마개를 필수적으로 채워야 할 의무가 있는 견종은 도사견·아메리칸 핏불테리어·아메리칸 스태퍼드셔 테리어·스태퍼드셔 불 테리어·로트와일러 등 5개종이다. 이 5개 종과 다른 견종과의 잡종도 입마개 착용 대상이다.",
            trigger: "3",
        },
        {
            id: "반려 동물의 종류",
            message:
                "사람과 더불어 살아가는 동물이라면 개, 고양이, 토끼, 기니피그, 돼지, 닭, 오리, 앵무새, 도마뱀, 이구아나, 사슴벌레, 금붕어 등 그 종류를 불문하고 모두 반려동물이라고 할 수 있습니다.",
            trigger: "3",
        },
        {
            id: "반려동물 등록 번호 조회 방법",
            asMessage: true,
            component: (
                <Link to="https://www.animal.go.kr/front/index.do">
                    반려동물 등록 번호 조회 방법(저를 눌러주세요)
                </Link>
            ),
            trigger: "3",
        },
        {
            id: "반려동물을 위한 재난 대처법",
            asMessage: true,
            component: (
                <Link to="http://www.safekorea.go.kr/idsiSFK/neo/sfk/cs/contents/prevent/SDIJKM5306.html?menuSeq=136">
                    반려동물을 위한 재난 대처법(저를 눌러주세요)
                </Link>
            ),
            trigger: "3",
        },
        {
            id: "4",
            options: [
                { value: 1, label: "포텐플레이스", trigger: "포텐플레이스" },
                { value: 2, label: "마켓", trigger: "마켓" },
                { value: 3, label: "포텐스", trigger: "포텐스" },
                { value: 4, label: "그룹", trigger: "그룹" },
                { value: 5, label: "관리자 페이지", trigger: "관리자 페이지" },
                { value: 6, label: "돌아가기", trigger: "돌아가기" },
            ],
        },

        {
            id: "포텐플레이스",
            //message:
            //    "반려동물 카페정보와 24시 병원 등 반려동물 관련한 장소들을 쉽고 편하게 검색 가능한 곳입니다",
            asMessage: true,
            component: (
                <Link to="/place">
                    반려동물 카페 정보와 24시 병원 등 반려동물 관련한 장소들을 쉽고 편하게
                    검색할 수 있어요 ☘︎⛑☘︎⛑
                </Link>
            ),
            trigger: "4",
        },
        {
            id: "마켓",
            //message: "반려동물의 물건을 대여 및 사고 팔수있는 공간입니다",
            asMessage: true,
            component: (
                <Link to="/market">
                    반려동물의 물건을 대여 및 사고팔 수 있는 공간이에요♡⃞⃛୭
                </Link>
            ),
            trigger: "4",
        },
        {
            id: "포텐스",
            // message: "",
            asMessage: true,
            component: (
                <Link to="/pawtens">
                    귀엽고 사랑스러운 반려동물의 영상들을 즐길 수 있어요 🐾
                </Link>
            ),
            trigger: "4",
        },
        {
            id: "그룹",
            // message: "",
            asMessage: true,
            component: (
                <Link to="/group/NewsFeed">
                    소수의 사람들과 실시간으로 의견을 나눠요 ˗ˋˏ♡ˎˊ˗
                </Link>
            ),
            trigger: "4",
        },
        {
            id: "관리자 페이지",
            // message: "",
            asMessage: true,
            component: (
                <Link to="admin/admin">관리자만 들어갈 수 있는 페이지입니다 ⚙️</Link>
            ),
            trigger: "4",
        },
        {
            id: "돌아가기",
            message: "돌아가기",
            trigger: "3",
        },
        {
            id: "포텐셜이란?",
            message:
                "♡ྉ 반려동물을 위한 sns 성 커뮤니티며, 반려동물 사진과 영상 및 물품들을 대여하고 사고팔 수 있으며,모임을 만들 수 있어요 ♡ྉ",
            trigger: "3",
        },
        {
            id: "포텐셜 사용방법",
            message: "포텐셜 사용방법",
            trigger: "4",
        },
    ];

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
                cursor: isDragging ? "grabbing" : "default",
                position: "fixed",
                bottom: "0",
                right: "0",
                margin: "20px",
            }}
        >
            {!showChatbot && (
                <button
                    onClick={handleChatbotClick}
                    style={{
                        background: "none",
                        border: "none",
                        padding: "0",
                        margin: "0",
                        cursor: "pointer",
                    }}
                >
                    <img
                        src="feedimages/logo.png"
                        alt="열기 아이콘"
                        style={{ width: "100px", height: "100px" }}
                    />
                </button>
            )}
            {showChatbot && (
                <div
                    style={{
                        position: "fixed",
                        top: "30%",
                        left: "60%",
                        cursor: isDragging ? "grabbing" : "default",
                    }}
                >
                    <button
                        onClick={handleChatbotClose}
                        style={{
                            position: "absolute",
                            top: "-20px",
                            right: "-20px",
                            background: "none",
                            border: "none",
                            padding: "0",
                            margin: "0",
                            cursor: "pointer",
                        }}
                    >
                        <img
                            src="feedimages/icon2.png"
                            alt="닫기 아이콘"
                            style={{
                                width: "100px",
                                height: "100px",
                                position: "fixed",
                                bottom: "0",
                                right: "0",
                                margin: "20px",
                            }}
                        />
                    </button>
                    <ThemeProvider theme={theme}>
                        <ChatBot
                            speechSynthesis={{ enable: true, lang: "ko" }}
                            steps={steps}
                            headerTitle="PetTalk♡"
                            botAvatar="feedimages/logo.png"
                            userAvatar="feedimages/cat.jpg"
                        />
                    </ThemeProvider>
                </div>
            )}
        </div>
    );
};

export default ThemedExample;
