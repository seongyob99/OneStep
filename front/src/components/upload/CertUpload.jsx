import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import "@styles/upload/certUpload.scss";
import { useAuth } from '../context/AuthContext';

// ✅ 환경 변수에서 API 서버 URL 가져오기
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CertUpload = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [goalData, setGoalData] = useState([]);
  // AuthContext에서 authState 가져오기
  const { authState } = useAuth();
  // username 가져오기
  const memberId = authState.user?.username;
  const goalid = useParams().goalid;
  const fileInputRef = useRef(null);

  //  // 목표 정보 불러오기: 목표의 startDate와 certCycle
  // useEffect(() => {
  //   axios.get(`${SERVER_URL}/cert/${goalid}`)
  //     .then(response => {
  //       setGoalData(response.data);
  //     })
  //     .catch(error => {
  //       alert("목표 정보를 불러오는데 실패했습니다.");
  //       console.error("목표 정보 로드 실패:", error);
  //     });
  // }, [goalid]);

  // 목표 정보 불러오기: 목표의 startDate와 certCycle
  useEffect(() => {
    axios.get(`${SERVER_URL}/cert/${goalid}`)
      .then(response => {
        console.log("📢 goalData API 응답:", response.data);
        if (Array.isArray(response.data)) {
          setGoalData(response.data); // 배열 그대로 저장
        } else {
          setGoalData([response.data]); // 객체일 경우 배열로 변환
        }
      })
      .catch(error => {
        alert("목표 정보를 불러오는데 실패했습니다.");
        console.error("목표 정보 로드 실패:", error);
      });
  }, [goalid]);

  console.log("🟢 goalData:", goalData);
console.log("🟢 로그인된 사용자 ID:", memberId);
console.log("🟢 현재 사용자가 목표에 참가 여부:", goalData?.some(member => member.memberId === memberId));


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


  const isWithinCertCycle = () => {
    if (!goalData) {
      // 목표 정보가 아직 로드되지 않았으면 기본적으로 업로드를 막거나 허용하지 않을 수 있음
      return false;
    }
    const today = new Date();
    const startDate = new Date(goalData[0].startDate);
    // 오늘이 목표 시작일 이전이면 인증 불가
    if (today < startDate) return false;
    // 시작일로부터 오늘까지의 차이(일수)를 계산
    const diffDays = Math.floor(Number((today - startDate)) / (1000 * 3600 * 24));
    // DB에서 가져온 인증 주기를 숫자로 변환
    const certCycle = Number(goalData[0].certCycle);
    // diffDays가 인증 주기로 나누어 떨어지면 오늘은 인증 가능한 날입니다.
    console.log(diffDays, certCycle, today);

    return diffDays % certCycle === 0;

  };

  // 📌 업로드 핸들러
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("업로드할 파일을 선택해주세요!");
      return;
    }

    // 인증 주기 체크: 인증 주기에 맞지 않으면 업로드 진행하지 않음
    if (!isWithinCertCycle()) {

      alert("현재 날짜는 인증 주기에 맞지 않습니다. 인증 주기에 맞는 날짜에 업로드해 주세요.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("goalId", goalid);
    formData.append("memberId", memberId);
    formData.append("certDate", new Date().toISOString().split("T")[0]);

    try {
      const response = await axios.post(`${SERVER_URL}/cert/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("인증 완료!");
      console.log("업로드 성공:", response.data);
      handleClose();
      window.location.reload();
    } catch (error) {
      alert("업로드 실패: " + error.message);
      console.error("업로드 실패:", error);
    } finally {
      setUploading(false);
    }
  };


  return (
    <div className="upload-container">

      {/* {authState.isAuthenticated && (
        <Button className="upload-btn" onClick={handleShow} >
        인증사진 올리기
      </Button>
      )} */}
{authState.isAuthenticated && 
 goalData?.some(member => member.memberId === memberId) && (
  <Button className="upload-btn" onClick={handleShow}>
    인증사진 올리기
  </Button>
)}

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
