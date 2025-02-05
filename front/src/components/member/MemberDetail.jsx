import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/member/MemberDetail.scss";

const MemberDetail = () => {
  const [member, setMember] = useState({
    memberId: "",
    name: "",
    email: "",
    phone: "",
    birth: "",
    password: "",
    social: false,
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // 사용자 정보를 가져오는 함수
  const fetchMember = async () => {
    try {
      const memberId = "user01"; // 로그인된 사용자 ID를 여기에 사용
      const response = await axios.get(`/api/member/${memberId}`);
      setMember(response.data);
      setLoading(false);
    } catch (error) {
      console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
      setLoading(false);
    }
  };

  // 컴포넌트가 로드되었을 때 사용자 정보 가져오기
  useEffect(() => {
    fetchMember();
  }, []);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 전화번호 유효성 검사
    if (name === "phone") {
      const phonePattern = /^(?:\d{3}-\d{3,4}-\d{4})?$/;
      if (!phonePattern.test(value) && value !== "") {
        setPhoneError("전화번호는 000-0000-0000 또는 000-000-0000 형식으로 입력해주세요.");
      } else {
        setPhoneError(""); // 오류 메시지 초기화
      }
    }

    setMember((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 수정 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneError) {
      alert("전화번호 형식이 올바르지 않습니다. 다시 확인해주세요.");
      return;
    }
    try {
      await axios.put("/api/member/update", member);
      setSuccess(true);
    } catch (error) {
      console.error("회원 정보를 수정하는 데 실패했습니다.", error);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="member-detail">
      <h1>정보 수정</h1>
      {success && <p className="success-message">회원 정보가 수정되었습니다.</p>}
      <form onSubmit={handleSubmit}>
        <label>
          이름
          <input
            type="text"
            name="name"
            value={member.name}
            onChange={handleChange}
            placeholder="이름"
          />
        </label>
        <label>
          이메일
          <input
            type="email"
            name="email"
            value={member.email}
            onChange={handleChange}
            placeholder="example@email.com"
          />
        </label>
        <label>
          전화번호
          <input
            type="text"
            name="phone"
            value={member.phone}
            onChange={handleChange}
            placeholder="010-1234-5678"
          />
          {phoneError && <p className="error-message">{phoneError}</p>} {/* 오류 메시지 표시 */}
        </label>
        <label>
          생년월일
          <input
            type="date"
            name="birth"
            value={member.birth}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]} // 오늘 날짜까지 선택 가능
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            name="password"
            value={member.password}
            onChange={handleChange}
            placeholder="비밀번호"
          />
        </label>
        <button type="submit">수정하기</button>
      </form>
    </div>
  );
};

export default MemberDetail;
