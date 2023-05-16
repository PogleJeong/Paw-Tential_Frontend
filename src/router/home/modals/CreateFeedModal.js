import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Container, ButtonGroup } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Session from "react-session-api"
import { Cookies } from 'react-cookie';

const CreateFeedModal = ({show, onHide}) => {

  const [userId, setUserId] = useState('loserya1234');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [saveFileNameArr, setSaveFileNameArr] = useState([""]);
  const [filePath, setFilePath] = useState('');
  const [location, setLocation] = useState('');

  // useEffect(()=>{
  //   let user = Session.get("user");
  //   if(user !== undefined){ // 세션에 저장해둔 문자열이 있을 때
  //       setUserId(user);
  //   }
  // }, []);

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
              .post("http://localhost:3000/feedImageUpload", upload)
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
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }


  // 글 내용
  const [content, setContent] = useState('');

  // 서버에 데이터 전송
  const submitBtn = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("id", userId);
    formData.append("content",content);
    formData.append("location", location); // 임시

    axios.post("http://localhost:3000/home/feedWrite", formData)
    .then(function(res){
      alert(res.data);
      window.location.reload();
    })
    .catch(function(err){
      alert(err);
    })
  }

  return (
    <Modal
    show={show}
    onHide={onHide}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <Container>
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Create Feed
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form name="frm" onSubmit={submitBtn}>
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
        {/* <Form.Control
          placeholder="내용을 입력해주세요"
          onChange={(e)=>{setContent(e.target.value)}}
          
          /> */}
      </Form.Group>
      <ButtonGroup className="mb-3">
        <Button variant="secondary" onClick={() => setShowLocationInput(true)}>장소 추가</Button>
      </ButtonGroup>
      {showLocationInput && (
        <Form.Group className="comment-text d-flex align-items-center mb-3">
          <Form.Control type="text" placeholder="장소를 입력해보세요." value={location} onChange={(e) => setLocation(e.target.value)} />
          <div className="comment-attagement d-flex">
                  <a href="javascript:void(0);">
                    <i className="ri-eraser-line mx-4"
                        onClick={()=>{
                          if(location !== "") {
                            if(window.confirm("입력된 장소를 지우시겠습니까?")) {
                              setShowLocationInput(false);
                              setLocation("");
                            }
                          } else {
                            setShowLocationInput(false);
                            setLocation("");  
                          }
                        }}>
                    </i>
                  </a>
          </div>
        </Form.Group>
      )}
      <br />
      <Button variant="primary" type="submit">작성</Button>
    </Form>
    </Modal.Body>
    <Modal.Footer>
    </Modal.Footer>
  </Container>
  </Modal>
  )
}

export default CreateFeedModal