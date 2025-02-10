import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CertDelete = ({
  filePath,
  goalid,
  selectedDate,
  onClose,
  onRefresh,
  adminMemberId,
  certOwnerId,
  isEnded,
}) => {
  const { authState } = useAuth();
  const memberId = authState.user?.username;

  // 한국 시간(KST) 기준 오늘 날짜 가져오기 (yyyy-MM-dd 형식)
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\./g, "").replace(/ /g, "-");

  // 날짜 비교: 오늘 날짜와 `selectedDate`가 같은지 확인 (한국 시간 기준)
  const isToday = selectedDate === today;

  // 삭제 권한 확인: 방장 또는 인증글 작성자이면서 오늘 날짜인 경우만 삭제 가능
  const canDelete = isToday && (memberId === adminMemberId || memberId === certOwnerId);

  // 삭제 버튼을 렌더링하지 않음 (권한 없음 or 과거 날짜)
  if (!canDelete || isEnded) {
    return null;
  }

  const handleDelete = async () => {
    if (!goalid || !filePath || !selectedDate) {
      alert("필요한 데이터가 부족합니다.");
      return;
    }

    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${SERVER_URL}/cert/delete/${filePath}?goalId=${goalid}&memberId=${certOwnerId}&certDate=${selectedDate}&currentMemberId=${memberId}`,
        {
          data: {
            goalId: goalid,
            filePath: filePath,
            certDate: selectedDate,
            currentMemberId: memberId
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("삭제가 완료되었습니다.");
      onClose(); // 모달 닫기
      onRefresh(); // 목록 새로고침
    } catch (error) {
      console.error("🚨 삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <>
      {authState.isAuthenticated && (
        <Button variant="danger" className="ms-2" onClick={handleDelete}>
          삭제
        </Button>
      )}
    </>
  );
};

export default CertDelete;
