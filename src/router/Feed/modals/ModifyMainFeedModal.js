import { useEffect, useState } from "react";
import axios from 'axios';
import { Button, Container, Form, Modal } from "react-bootstrap";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function ModifyMainFeedModal({show, onHide, seq}) {
    
    useEffect(()=>{
        if(show) {
            loadPost();
        }
    },[show])

    const [content, setContent] = useState('');
    const [saveFileNameArr, setSaveFileNameArr] = useState([""]);
    const [filePath, setFilePath] = useState('');

    // 원본 데이터 가져오기
    const loadPost = async () => {
        axios.get("http://localhost:3000/home/loadPost", {params:{"seq":seq}})
        .then(function(res){
            setContent(res.data.content);
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 피드 수정 처리
    const modifyFeed = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("seq", seq);
        formData.append("content", content);

        axios.post("http://localhost:3000/home/feedModify", formData)
        .then(function(res){
            alert(res.data);
            window.location.reload();
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
        <Container>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modify Feed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form name="frm" onSubmit={modifyFeed}>
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
        <Button variant="primary" type="submit">
            Modify
        </Button>
        </Form>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Container>
      </Modal>
      )
}