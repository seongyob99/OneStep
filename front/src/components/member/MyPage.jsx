import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/member/MyPage.scss";

const MyPage = () => {
  const [member, setMember] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMember = async () => {
    try {
      const memberId = "user02"; // 로그인된 사용자 ID
      const response = await axios.get(`http://localhost:8080/api/member/${memberId}`);
      setMember(response.data);
    } catch (err) {
      console.error("사용자 정보를 가져오는 데 실패했습니다.", err);
      setError("사용자 정보를 가져오는 데 실패했습니다.");
    }
  };

  const fetchGoals = async () => {
    try {
      const memberId = "user02"; // 로그인된 사용자 ID
      const response = await axios.get(`/api/member/${memberId}/goals`);
      if (Array.isArray(response.data)) {
        setGoals(response.data);
      } else {
        console.error("응답 데이터가 배열이 아닙니다.", response.data);
        setGoals([]);
      }
    } catch (err) {
      console.error("수행 중인 목표를 가져오는 데 실패했습니다.", err);
      setGoals([]);
    }
  };

  // 회원 탈퇴 요청 함수
  const handleDeleteMember = async () => {
    try {
      const confirmDelete = window.confirm(
        "정말로 회원 탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      );
      if (!confirmDelete) return;

      const memberId = "user01"; // 로그인된 사용자 ID
      await axios.delete(`/api/member/${memberId}`); // 탈퇴 요청

      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/login"); // 탈퇴 후 로그인 페이지로 리다이렉트
    } catch (err) {
      console.error("회원 탈퇴에 실패했습니다.", err);
      alert("회원 탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchMember();
      await fetchGoals();
      setLoading(false);
    };
    fetchData();
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
      <div className="goals">
        <h2>현재 수행 중인 목표</h2>
        {goals && goals.length > 0 ? (
          <ul>
            {goals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        ) : (
          <p>현재 수행 중인 목표가 없습니다.</p>
        )}
      </div>
      <div className="actions">
        <button className="member-button" onClick={() => navigate("/member/edit")}>
          내 정보 수정
        </button>
        <button className="member-button" onClick={handleDeleteMember}>
          회원 탈퇴
        </button>
      </div>
    </div>
  );
};

export default MyPage;
