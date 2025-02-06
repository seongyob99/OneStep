import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import "../../styles/upload/certUpload.scss";

const CertUpload = () => {
  const handleUpload = () => {
    const today = new Date().toISOString().split("T")[0];
    const file = window.prompt("업로드할 이미지 URL을 입력하세요", "");
    
    if (file) {
      axios.post("/api/certifications", { date: today, image: file })
        .then(() => alert("인증 완료!"))
        .catch((err) => alert("업로드 실패: " + err.message));
    }
  };

  
  return (
    <div className="upload-container">
    <Button className="upload-btn" onClick={handleUpload}>인증사진 올리기</Button>
  </div>
  );
};


export default CertUpload;
