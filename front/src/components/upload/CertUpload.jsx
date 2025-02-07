import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import "@styles/upload/certUpload.scss";

// ✅ 환경 변수에서 API 서버 URL 가져오기
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CertUpload = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const goalid = useParams().goalid;

  // 📌 모달 열기/닫기
  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setSelectedFile(null); // ✅ 파일 선택 초기화
  };

  // 📌 파일 선택 시 상태 업데이트
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // 📌 업로드 핸들러
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("업로드할 파일을 선택해주세요!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("goalId", goalid); 
    formData.append("memberId", "user01");
    formData.append("certDate", new Date().toISOString().split("T")[0]); 

    try {
      const response = await axios.post(`${SERVER_URL}/cert/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("인증 완료!");
      console.log("업로드 성공:", response.data);
      handleClose(); // ✅ 업로드 후 모달 닫기
          //  onRefresh();
    } catch (error) {
      alert("업로드 실패: " + error.message);
      console.error("업로드 실패:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <Button className="upload-btn" onClick={handleShow} >
        인증사진 올리기
      </Button>

      {/* 📌 모달 */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>인증 사진 업로드</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>업로드할 파일 선택</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
          >
            {uploading ? "업로드 중..." : "업로드"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CertUpload;
