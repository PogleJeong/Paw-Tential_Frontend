import { Modal, Button, Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import { useState } from "react";
import moment from 'moment/moment';
import {useCookies} from 'react-cookie';
import { DateRange } from 'react-date-range';
import { addDays } from 'date-fns';

export default function CreateContestModal({ show, onHide, reset }) {

    const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
    // cookie에 저장된 사용자 ID 및 닉네임
    const userId = 'contestAdmin';
    const userNickName = cookies.USER_NICKNAME;

    const [category, setCategory] = useState('콘테스트');
    const [startDt, setStartDt] = useState(moment(new Date()).locale("ko").format("YYYY년 MM월 DD일"));
    const [endDt, setEndDt] = useState(moment(new Date()).locale("ko").format("YYYY년 MM월 DD일"));
    const [content, setContent] = useState('');

    const [saveFileNameArr, setSaveFileNameArr] = useState([""]);
    const [filePath, setFilePath] = useState("");

    // daterange에서 사용될 state변수
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: "selection",
        },
    ])

    const customUploadAdapter = (loader) => {
        return {
          upload() {
              return new Promise((resolve, reject) => {
                const upload = new FormData();
                loader.file.then((file) => {
                    if (file.size > 1024 * 1024 * 1) {
                    alert("1MB 이하의 이미지만 업로드 가능합니다."); //사진 용량 제한
                    return; // 용량 제한으로 업로드가 되지 않는 사진의 처리가 필요한 부분 같습니다.
                    }

                  upload.append("upload", file);

                  axios.post("http://localhost:3000/group/imageUpload", upload)
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
                      setSaveFileNameArr((prev) => [
                      ...prev,
                      `http://localhost:3000/${res.data}`,
                      ]);
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

    // 콘테스트 작성 처리 함수
    const submitHandler = async (e) => {
        if(window.confirm("게시글을 등록하시겠습니까?")) {
            e.preventDefault();
            
            let formData = new FormData();
            formData.append("id", userId);
            formData.append("category", category);
            if(category === "콘테스트") {
              formData.append("startDt", startDt);
              formData.append("endDt", endDt);
            }
            formData.append("content", content);
    
            axios.post("http://localhost:3000/contest/createContest", formData)
            .then(function(res){
                alert("게시글이 등록되었습니다.");
                reset();
                onHide();
            })
            .catch(function(err){
                alert(err);
            })
        }
    }

    return (
        <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter"centered>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Create Contest
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{"fontWeight":"bolder","fontSize":"20px","color":"black"}}>✔️ 타입</Form.Label>
                  <br/>
                <Form.Check inline label="콘테스트" onChange={(e)=>{setCategory(e.target.value);}} type="checkbox" value="콘테스트" checked={category === '콘테스트'} />
                <Form.Check inline label="당첨자 발표" onChange={(e)=>{setCategory(e.target.value);}} type="checkbox" value="당첨자 발표" checked={category === '당첨자 발표'} />
              </Form.Group>
            <Form.Group className="mb-3">
            {category === "콘테스트" && (
            <>
            <Form.Label style={{ fontWeight: "bolder", fontSize: "20px", color: "black" }}>📅 콘테스트 날짜</Form.Label>
            <br />
            <DateRange
                editableDateInputs={false}
                onChange={(item) => {
                  setState([item.selection]);
                  setStartDt(item.selection.startDate);
                  setEndDt(item.selection.endDate);
                }}
                moveRangeOnFirstSelection={false}
                ranges={state}
                minDate={new Date()}
              />
            </>
            )}
            <CKEditor
              config={{ extraPlugins: [uploadPlugin] }}
              editor={ClassicEditor}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
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
