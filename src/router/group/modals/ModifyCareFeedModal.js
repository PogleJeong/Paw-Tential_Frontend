import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import moment from 'moment/moment';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import TimePicker from "rc-time-picker";
import "rc-time-picker/assets/index.css";
import { Calendar } from 'react-date-range';

export default function ModifyCareFeedModal({show, onHide, grpFeedNo, fn}) {

    // 필요한 state 변수
    const [category, setCategory] = useState('');
    const [startDt, setStartDt] = useState('');
    const [endDt, setEndDt] = useState('');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [check, setCheck] = useState('');
    const [content, setContent] = useState('');
    const [setting, setSetting] = useState('');
    const [saveFileNameArr, setSaveFileNameArr] = useState([""]);
    const [filePath, setFilePath] = useState('');

    // daterange에서 사용될 state변수
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const defaultTime = moment("00:00", "HH:mm");

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

    useEffect(()=>{
      const loadPost = async () => {
        try{
          const res = await axios.get("http://localhost:3000/group/loadCarePost", {params:{"careGrpFeedNo":grpFeedNo}})
          setState([
            {
              startDate: new Date(res.data.careGrpStartDt),
              endDate: new Date(res.data.careGrpEndDt),
              key: "selection" 
            }
          ]);
          setStartDt(res.data.careGrpStartDt);
          setEndDt(res.data.careGrpEndDt);
          setCategory(res.data.careGrpType);
          setStartTime(new Date(res.data.careGrpStartTime));
          setEndTime(new Date(res.data.careGrpEndTime));
          setCheck(res.data.careGrpCheck);
          setContent(res.data.careGrpContent);
          setSetting(res.data.careGrpFeedSetting);
        } catch(err){
            alert(err);
        }
      }
      if(show) {
        loadPost();
      }
    },[show]);

    // 돌봄그룹 피드 수정 처리
    const submitBtn = async (e) => {
      
      e.preventDefault();

      const formData = new FormData();

      formData.append("careGrpFeedNo", grpFeedNo);
      formData.append("careGrpStartDt", startDt);
      formData.append("careGrpEndDt", endDt);
      formData.append("careGrpStartTime", startTime);
      formData.append("careGrpEndTime", endTime);
      formData.append("careGrpCheck", check);
      formData.append("careGrpContent", content);
      formData.append("careGrpFeedSetting", setting);
      
      await axios.post("http://localhost:3000/group/modifyCareFeed", formData)
      .then(function(res){
        alert(res.data);
        onHide();
        fn();
      })
      .catch(function(err){
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

                axios
                .post("http://localhost:3000/group/imageUpload", upload)
                .then((res) => {
                    setFilePath(res.data);
                    console.log(`http://localhost:3000/${res.data}`);
                    //setSaveFileNameArr([...saveFileNameArr, file.name]);

                    // if (!flag) {
                    //   setFlag(true);
                    //   setFlagImage(res.data.filename);
                    // }
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
    }; // end of customUploadAdapter

   function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }; // end of uploadPlugin
    
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
            Modify Care Feed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label style={{"fontWeight":"bolder","fontSize":"20px","color":"black"}}>✔️ 케어 종류</Form.Label>
            <br />
              <Form.Check
                inline
                disabled
                label="산책"
                type="checkbox"
                value="walk"
                checked={category === 'walk'}
              />
              <Form.Check
                inline
                disabled
                label="돌봄"
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
              value={moment(startTime)}
              />
            &nbsp;~&nbsp;
            <TimePicker
            onChange={handleEndTimeChange}
            showSecond={false}
            format="HH:mm"
            value={moment(endTime)}
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
                data={content}
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
          <Button variant="primary" type="submit" onClick={submitBtn}>Submit</Button>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    ) // end of return
}