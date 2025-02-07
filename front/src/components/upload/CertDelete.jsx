import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CertDelete = ({ filePath, goalid, selectedDate, onClose, onRefresh }) => {
  const handleDelete = async () => {
    if (!goalid || !filePath || !selectedDate) {
      alert("필요한 데이터가 부족합니다.");
      return;
    }

    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      console.log("🗑️ 삭제 요청 데이터:", { goalid, filePath, selectedDate });

      const response = await axios.delete
      (`${SERVER_URL}/cert/delete/${filePath}?goalId=${goalid}&memberId=user01&certDate=${selectedDate}&currentMemberId=user01`, {
        data: {
          goalId: goalid,
          filePath: filePath,
          certDate: selectedDate,
          currentMemberId: "user01" // ✅ 현재 로그인한 사용자 ID (임시 하드코딩)
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ 삭제 성공:", response.data);
      alert("삭제가 완료되었습니다.");

      onClose(); // 모달 닫기
      onRefresh(); // 목록 새로고침
    } catch (error) {
      console.error("🚨 삭제 실패:", error);
      alert("삭제에 실패했습니다.");
      console.log("파일네임?",filePath);
    }
  };

  return (
    <Button variant="danger" onClick={handleDelete}>삭제</Button>
  );
};

export default CertDelete;
