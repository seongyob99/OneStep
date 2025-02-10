import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";
import "@styles/upload/certUpload.scss";
import { useAuth } from "../context/AuthContext";

// ✅ 환경 변수에서 API 서버 URL 가져오기
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CertUpload = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [goalData, setGoalData] = useState(null);
  const [isParticipant, setIsParticipant] = useState(false); // 참가 여부 상태

  // AuthContext에서 authState 가져오기
  const { authState } = useAuth();
  const memberId = authState.user?.username;
  const goalid = useParams().goalid;

  // 목표 정보 불러오기: 목표 데이터는 배열 형식으로 받아온다고 가정
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/cert/${goalid}`)
      .then((response) => {
        // 응답이 배열이면 그대로 사용, 아니면 배열로 변환
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setGoalData(data);

        // 참가자 여부 확인: 각 목표(멤버) 객체의 memberId 비교 (구조에 따라)
        const participantCheck = data.some(
          (member) => member.memberId === memberId
        );
        setIsParticipant(participantCheck);
      })
      .catch((error) => {
        alert("목표 정보를 불러오는데 실패했습니다.");
        console.error("목표 정보 로드 실패:", error);
      });
  }, [goalid, memberId]);


  //  모달 열기/닫기
  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setSelectedFile(null);
  };

  // 파일 선택 시 상태 업데이트
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // 인증 주기 체크 함수
  const isWithinCertCycle = () => {
    if (!goalData || goalData.length === 0) {
      return false; // 목표 정보가 없으면 인증 불가
    }
    const today = new Date();
    const startDate = new Date(goalData[0]?.startDate);
    // 목표 시작일 이전이면 인증 불가
    if (today < startDate) return false;
    // 시작일로부터 오늘까지의 차이(일수) 계산
    const diffDays = Math.floor((today - startDate) / (1000 * 3600 * 24));
    const certCycle = Number(goalData[0]?.certCycle || 1);
    return diffDays % certCycle === 0;
  };

  // 업로드 핸들러
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("업로드할 파일을 선택해주세요!");
      return;
    }

    // 인증 주기 체크: 인증 주기에 맞지 않으면 업로드 진행하지 않음
    if (!isWithinCertCycle()) {
      alert(
        "인증 주기에 맞지 않습니다.\n" +
        "정해진 인증 주기에 맞는 날짜에 업로드해 주세요."
      );
      handleClose(); // 실패시 모달 즉시 닫기
      setUploading(false);
      return;
    }

    setUploading(true);

    // KST(한국 표준시) 기준 현재 날짜 변환
    const today = new Date();
    // 오늘의 로컬(한국) 날짜를 ISO 문자열로 변환하여 "YYYY-MM-DD" 형식으로 추출합니다.
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];


    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("goalId", goalid);
    formData.append("memberId", memberId);
    formData.append("certDate", localDate);

    try {
      const response = await axios.post(`${SERVER_URL}/cert/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("인증 완료!");
      handleClose();
      window.location.reload();
      setUploading(false);
    } catch (error) {
      console.error("🚨 업로드 실패:", error);
      let errorMessage = "업로드 중 알 수 없는 오류가 발생했습니다.";
      let errorType = "";
      if (error.response && error.response.data) {
        errorMessage = error.response.data.message || errorMessage;
        errorType = error.response.data.errorType || "";
      }
      if (errorType === "CERT_CYCLE_ERROR") {
        alert(
          "인증 주기에 맞지 않습니다.\n" +
          "정해진 인증 주기에 맞는 날짜에 업로드해 주세요."
        );
      } else if (errorType === "DUPLICATE_CERTIFICATION") {
        alert(
          "이미 인증이 존재합니다.\n" +
          "삭제 후 다시 업로드해 주세요."
        );
      } else {
        alert("업로드 실패: " + errorMessage);
      }
      handleClose(); // 실패 시 모달 즉시 닫기
      setUploading(false);
    }
  };

  // 날짜 포맷 (mm.dd)
  const formatday = (date) => {
    return `${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일`;
  };


  return (
    <div className="upload-container">
      {/* 참가자만 버튼 보이게: 로그인되어 있고, 목표 데이터에 현재 사용자가 포함되어 있으면 */}
      {authState.isAuthenticated && goalData?.some((member) => member.memberId === memberId) && (
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
            <Form.Label>{`오늘(${formatday(new Date)}) 인증 사진만 업로드 가능합니다.`}</Form.Label>
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
