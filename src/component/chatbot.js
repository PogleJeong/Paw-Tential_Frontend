import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const theme = {
  background: '#e3eaf1',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#b0e0bd',
  headerFontColor: '#faf5f5',
  headerFontSize: '15px',
  botBubbleColor: '#a5e0c5',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

const steps = [

  {
    id: '1',
    message: "포텐셜에 오신것을 환영합니다 ʚ🧸ྀིɞ",
    trigger: "2",
  },
  {
    id: '2',
    user: true,
    trigger: "3",
  },
  {
    id: '3',
    options: [
      { value: 1, label: '입마개 착용 기준', trigger: '입마개 착용 기준' },
      { value: 2, label: '반려 동물의 종류', trigger: '반려 동물의 종류' },
      { value: 3, label: '반려동물 등록 번호 조회 방법', trigger: '반려동물 등록 번호 조회 방법' }
    ],
  },
  {
    id: '입마개 착용 기준',
    message: "현행 동물보호법상 맹견으로 규정돼 외출 시 입마개를 필수적으로 채워야 할 의무가 있는 견종은 도사견·아메리칸 핏불테리어·아메리칸 스태퍼드셔 테리어·스태퍼드셔 불 테리어·로트와일러 등 5개종이다. 이 5개 종과 다른 견종과의 잡종도 입마개 착용 대상이다.",
    end: true,
  },
  {
    id: '반려 동물의 종류',
    message: "사람과 더불어 살아가는 동물이라면 개, 고양이, 토끼, 기니피그, 돼지, 닭, 오리, 앵무새, 도마뱀, 이구아나, 사슴벌레, 금붕어 등 그 종류를 불문하고 모두 반려동물이라고 할 수 있습니다.",
    end: true,
  },
  {
    id: '반려동물 등록 번호 조회 방법',
    message:"반려동물 등록 번호 조회 방법은 다음 사이트를 참조하시면 됩니다.... https://ddnews.co.kr/pet-number/ ",
    end: true,
  },
];

const ThemedExample = () => (
  <div style={{
    position: "fixed",
    top: "100%",
    left: "100%",
  }}>
  <ThemeProvider theme={theme}>
    <ChatBot speechSynthesis={{ enable: true, lang: 'ko' } } steps={steps}

             headerTitle="PetTalk♡"
     botAvatar="feedimages/logo.png"
             userAvatar="feedimages/cat.jpg"
    />;
  </ThemeProvider>
  </div>
);

export default ThemedExample;