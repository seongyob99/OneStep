import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate import
import axios from "axios";
import "../../styles/member/MyPage.scss";

const MyPage = () => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // ✅ 라우팅 처리

  // 사용자 정보를 가져오는 함수
  const fetchMember = async () => {
    try {
      const memberId = "user123"; // TODO: 로그인된 사용자 ID를 동적으로 가져오세요
      const response = await axios.get(`/api/member/${memberId}`);
      setMember(response.data);
      setLoading(false);
    } catch (err) {
      console.error("사용자 정보를 가져오는 데 실패했습니다.", err);
      setError("사용자 정보를 가져오는 데 실패했습니다.");
      setLoading(false);
    }
  };

  // 컴포넌트가 로드될 때 사용자 정보 가져오기
  useEffect(() => {
    fetchMember();
  }, []);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-page">
      <h1>마이페이지</h1>
      <div className="info-card">
        <p><strong>회원 ID:</strong> {member.memberId}</p>
        <p><strong>이름:</strong> {member.name}</p>
        <p><strong>이메일:</strong> {member.email}</p>
        <p><strong>전화번호:</strong> {member.phone}</p>
        <p><strong>생년월일:</strong> {member.birth || "등록되지 않음"}</p>
        <p><strong>성별:</strong> {member.sex === "M" ? "남성" : "여성"}</p>
        <p><strong>소셜 로그인 여부:</strong> {member.social ? "예" : "아니오"}</p>
      </div>
      {/* "내 정보 수정" 버튼 */}
      <button className="edit-button" onClick={() => navigate("/member/edit")}>
        내 정보 수정
      </button>
    </div>
  );
};

export default MyPage;