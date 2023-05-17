import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal, Button, Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import moment from 'moment/moment';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { Calendar } from 'react-date-range';
import {useCookies} from 'react-cookie';


export default function CareFeedModal ({show, onHide}) {
    let params = useParams();

    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    // cookie에 저장된 사용자 ID 및 닉네임
    const userId = 'test2';
    const userNickName = cookies.USER_NICKNAME;
    
    // category === care 일 때 사용할 state변수
    const [category, setCategory] = useState('walk');
    const [startDt, setStartDt] = useState(moment(new Date()).locale("ko").format("YYYY년 MM월 DD일"));
    const [endDt, setEndDt] = useState(moment(new Date()).locale("ko").format("YYYY년 MM월 DD일"));
    const [startTime, setStartTime] = useState(moment("00:00", "HH:mm"));
    const [endTime, setEndTime] = useState(moment("23:59", "HH:mm"));
    const [check, setCheck] = useState('시간을 지켜주세요');
    const [content, setContent] = useState('');
    const [setting, setSetting] = useState('전체 공개');

    const [saveFileNameArr, setSaveFileNameArr] = useState([""]);
    const [filePath, setFilePath] = useState('');


    const defaultTime = moment("00:00", "HH:mm");

    // daterange에서 사용될 state변수
    const [state, setState] = useState([
      {
        startDate: new Date(),
        endDate: addDays(new Date(), 1),
        key: "selection",
      },
    ])

    // 산책 시간 유효성 검사 함수
    const handleStartTimeChange = (time) => {
      if (!time) {
        // clear 버튼을 클릭하여 null 값을 반환하는 경우
        setStartTime(moment("00:00", "HH:mm"));
      } else if (time.isBefore(endTime)) {
        setStartTime(time);
      } else {
        alert("시작 시간이 종료 시간보다 늦을 수 없습니다.");
        setStartTime(moment("00:00", "HH:mm"));
      }
    };

    const handleEndTimeChange = (time) => {
      if (!time) {
        // clear 버튼을 클릭하여 null 값을 반환하는 경우
        setEndTime(moment("23:59", "HH:mm"));
      } else if (time.isAfter(startTime)) {
        setEndTime(time);
      } else {
        alert("종료 시간이 시작 시간보다 일찍일 수 없습니다.");
        setEndTime(moment("23:59", "HH:mm"));
      }
    };

    // 서버에 데이터 보내기
    const submitHandler = (e) => {

      e.preventDefault();

      let formData = new FormData();

      formData.append("grpNo", params.grpNo);
      formData.append("careGrpType", category);
      formData.append("careGrpStartDt", startDt);
      formData.append("careGrpEndDt", endDt);
      formData.append("careGrpStartTime", startTime);
      formData.append("careGrpEndTime", endTime);
      formData.append("careGrpCheck", check);
      formData.append("careGrpContent", content);
      formData.append("careGrpFeedSetting", setting);
      formData.append("careGrpFeedWriter", userId);

      axios.post("http://localhost:3000/group/createCareFeed", formData)
      .then(function(res) {
        alert(res.data);
        window.location.reload();
      })
      .catch(function(err) {
        alert(err);
      })
    }

    const customUploadAdapter = (loader) => {
        return {
          upload() {
            return new Promise((resolve, reject) => {
              const upload = new FormData();
              loader.file.then((file) => {
                if (file.size > 1024 * 1024 * 1) {
                  alert("1MB 이하의 이미지만 업로드 가능합니다.");          //사진 용량 제한
                  return;                                                  // 용량 제한으로 업로드가 되지 않는 사진의 처리가 필요한 부분 같습니다.
                }
    
                upload.append("upload", file);
    
                axios.post("http://localhost:3000/group/imageUpload", upload)
                .then((res) => {
                    setFilePath(res.data);
                    console.log(`http://localhost:3000/${res.data}`);
                    resolve({
                      default: `http://localhost:3000/${res.data}`,
                    });
                    setSaveFileNameArr((prev) => [...prev, `http://localhost:3000/${res.data}`]);
                  })
                  .catch((err) => {
                    console.log("사진 업로드 실패");
                    reject(err);
                  });
              });
            });
          },
        };
      };

    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return customUploadAdapter(loader);
        };
    }


    return (
        <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Create Care Feed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label style={{"fontWeight":"bolder","fontSize":"20px","color":"black"}}>✔️ 케어 종류</Form.Label>
            <br />
              <Form.Check
                inline
                label="산책"
                onChange={(e)=>{
                  setCategory(e.target.value);
                  setEndDt("");
                  setCheck("시간을 지켜주세요")
                }}
                type="checkbox"
                value="walk"
                checked={category === 'walk'}
              />
              <Form.Check
                inline
                label="돌봄"
                onChange={(e)=>{
                  setCategory(e.target.value);
                  setCheck("");
                }}
                type="checkbox"
                value="care"
                checked={category === 'care'}
              />
          </Form.Group>
          {category === "care"
          ?
            <Form.Group className="mb-3">
              <Form.Label style={{"fontWeight":"bolder","fontSize":"20px","color":"black"}}>📅 돌봄 날짜</Form.Label>
                <br />
                <DateRange
                  editableDateInputs={false}
                  onChange={(item) => {
                    setState([item.selection]);
                    setStartDt(item.selection.startDate);
                    setEndDt(item.selection.endDate);
                    setStartTime(moment("00:00", "HH:mm"));
                    setEndTime(moment("23:59", "HH:mm"));
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={state}
                  minDate={new Date()}
                />
            </Form.Group>
            :
            <Form.Group className="mb-3">
                <Form.Label
                  style={{"fontWeight":"bolder","fontSize":"20px","color":"black"}}>📅 산책 날짜 및 시간</Form.Label>
                <br />
              <Calendar 
                selected={startDt}
                minDate={new Date()}
                onChange={(date)=>{
                  const mDate = moment(date).locale("ko").format("YYYY년 MM월 DD일"); 
                  if(window.confirm(`선택한 날짜는 ${mDate} 입니다.`)) {
                    setStartDt(date);
                    setEndDt(date);
                  }}}
              />
              <br />
              <TimePicker
              onChange={handleStartTimeChange}
              showSecond={false}
              format="HH:mm"
              defaultValue={defaultTime}
              value={startTime}
              />
            &nbsp;~&nbsp;
            <TimePicker
            onChange={handleEndTimeChange}
            showSecond={false}
            format="HH:mm"
            defaultValue={moment("23:59", "HH:mm")}
            value={endTime}
            />
            <br />
            <br />
             <Form.Check
        inline
        label="🙅‍♀️시간을 지켜주세요."
        onChange={(e)=>setCheck(e.target.value)}
        type="radio"
        value="시간을 지켜주세요"
        checked={check === '시간을 지켜주세요'}
      />
      <Form.Check
        inline
        label="🙆‍♀️조율 가능해요."
        onChange={(e)=>setCheck(e.target.value)}
        type="radio"
        value="조율 가능해요"
        checked={check === '조율 가능해요'}
      />
          </Form.Group>
          }
           
            <Form.Group className="mb-3">
                <CKEditor
                config={{
                    extraPlugins: [uploadPlugin],
                }}
                editor={ClassicEditor}
                onChange={ (event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                }}
                />
            </Form.Group>
            <Form.Group className="mb-3">
      <Form.Check
            inline
            label="전체 공개"
            value="전체 공개"
            type="radio"
            checked={setting === '전체 공개'}
            onChange={(e)=>{setSetting(e.target.value)}}
          />
          <Form.Check
            inline
            label="멤버 공개"
            value="멤버 공개"
            type="radio"
            checked={setting === '멤버 공개'}
            onChange={(e)=>{setSetting(e.target.value)}}
          />
      </Form.Group>
        </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" onClick={submitHandler}>Submit</Button>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    ) // end of return

}