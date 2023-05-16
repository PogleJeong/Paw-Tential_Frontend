import axios from "axios"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Modal, Button, Form } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DateRange } from 'react-date-range';

export default function ContestModifyModal ({show, onHide, seq, fn, fn2}) {
    
    const [category, setCategory] = useState('');
    const [startDt, setStartDt] = useState('');
    const [endDt, setEndDt] = useState('');
    const [content, setContent] = useState('');
    
    const [saveFileNameArr, setSaveFileNameArr] = useState([""]);
    const [filePath, setFilePath] = useState("");
    
    // daterange에서 사용될 state변수
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    // 콘테스트 및 당첨자 발표 수정 처리
    const submitBtn = async (e) => {
        if(window.confirm(`${category}를 수정하시겠습니까?`)){
            e.preventDefault();
    
            const formData = new FormData();
    
            formData.append("category", category);
            formData.append("seq", seq);
            if(startDt !== null && endDt !== null) {
                formData.append("startDt", startDt);
                formData.append("endDt", endDt);
            }
            formData.append("content",content);
    
            axios.post("http://localhost:3000/contest/modifyContest", formData)
            .then(function(res){
                onHide();
                fn();
                fn2();
            })
        } 
        
        
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
    
    useEffect(()=>{
         // 원본 데이터 가져오기
        const fetchData = async () => {
            axios.get("http://localhost:3000/contest/fetchData", {params:{"seq":seq}})
            .then(function(res) {
                if(res.data.startDt !== null && res.data.endDt !== null) {
                    setState([
                        {
                            startDate: new Date(res.data.startDt),
                            endDate: new Date(res.data.endDt),
                            key: "selection" 
                        }
                        ]);
                    setStartDt(res.data.startDt);
                    setEndDt(res.data.endDt);
                }
                setCategory(res.data.category);
                setContent(res.data.content);
            })
            .catch(function(err){
                alert(err);
            })
        }

        if(show){
            fetchData();
        }

    },[show])
    
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
                    Modify Contest
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label style={{"fontWeight":"bolder","fontSize":"20px","color":"black"}}>✔️ 타입</Form.Label>
                        <br />
                        <Form.Check
                            inline
                            disabled
                            label="콘테스트"
                            type="checkbox"
                            value="콘테스트"
                            checked={category === '콘테스트'}
                        />
                        <Form.Check
                            inline
                            disabled
                            label="당첨자 발표"
                            type="checkbox"
                            value="당첨자 발표"
                            checked={category === '당첨자 발표'}
                        />
                    </Form.Group>
                    {category === "콘테스트" && (
                    <Form.Group className="mb-3">
                        <Form.Label style={{"fontWeight":"bolder","fontSize":"20px","color":"black"}}>📅 콘테스트 날짜</Form.Label>
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
                    </Form.Group>
                    )}
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" type="submit" onClick={submitBtn}>Submit</Button>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
      </Modal>
    )
}