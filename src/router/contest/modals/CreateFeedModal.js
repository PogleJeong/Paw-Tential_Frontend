import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useCookies } from "react-cookie";
import { Modal, Button, Form, Container, Tab, Tabs } from 'react-bootstrap';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CreatePawtensData } from '../../../component/FeedModalTabs';

const CreateFeedModal = ({show, onHide}) => {

  const [cookies, setCookies] = useCookies(["USER_ID","USER_NICKNAME"]);
  const [saveFileNameArr, setSaveFileNameArr] = useState([""]);
  const [filePath, setFilePath] = useState('');

  const [tabKey, setTabKey] = useState('feed');

  useEffect(()=>{

  }, []);

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
    formData.append("id", cookies.USER_ID); // 임시
    formData.append("content",content);
    formData.append("tag", ""); // 임시
    formData.append("location", ""); // 임시

    axios.post("http://localhost:3000/feedWrite", formData)
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
      <Tabs
        id="controlled-tab-example"
        activeKey={tabKey}
        onSelect={(e) => setTabKey(e)}
        className="mt-3 mb-3"
      >
        <Tab eventKey="feed" title="게시글">
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
          <Button variant="primary" type="submit">
              Submit
          </Button>
          </Form>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Tab>
        <Tab eventKey="pawtens" title="포텐스">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Create Pawtens
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CreatePawtensData />
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
        </Tab>
      </Tabs>
    </Container>
    </Modal>
  )
}

export default CreateFeedModal