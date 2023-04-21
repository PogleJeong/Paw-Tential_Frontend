import axios from 'axios';
import React, { useState } from 'react'
import { Modal, Button, Form, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const CreateFeedModal = ({show, onHide}) => {

  const [saveFileNameArr, setSaveFileNameArr] = useState([""]);
  const [filePath, setFilePath] = useState('');

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
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  // 그룹 번호 받기
  let params = useParams();

  // 글 내용
  const [content, setContent] = useState('');

  // 전체 공개 or 멤버에게만 공개
  const [setting, setSetting] = useState('전체 공개');


  // 서버에 데이터 전송
  const submitBtn = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("grpNo",params.grpNo);
    formData.append("grpFeedContent",content);
    formData.append("grpFeedSetting",setting);
    // 임시
    formData.append("grpFeedId", "test2");

    axios.post("http://localhost:3000/group/createFeed", formData)
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
            console.log(content);
          }}
        />
        {/* <Form.Control
          placeholder="내용을 입력해주세요"
          onChange={(e)=>{setContent(e.target.value)}}
          
          /> */}
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
    <Button variant="primary" type="submit">
        Submit
    </Button>
    </Form>
    </Modal.Body>
    <Modal.Footer>
    </Modal.Footer>
  </Container>
  </Modal>
  )
}

export default CreateFeedModal