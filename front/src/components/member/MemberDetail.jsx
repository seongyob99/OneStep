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
      sex: "",
      password: "",
      social: false,
    });
  
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
  
    // 사용자 정보를 가져오는 함수
    const fetchMember = async () => {
      try {
        const memberId = "user123"; // 로그인된 사용자 ID를 여기에 사용
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
      setMember((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
  
    // 수정 폼 제출 핸들러
    const handleSubmit = async (e) => {
      e.preventDefault();
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
        <h1>내 정보</h1>
        {success && <p className="success-message">회원 정보가 수정되었습니다.</p>}
        <form onSubmit={handleSubmit}>
          <label>
            이름:
            <input
              type="text"
              name="name"
              value={member.name}
              onChange={handleChange}
            />
          </label>
          <label>
            이메일:
            <input
              type="email"
              name="email"
              value={member.email}
              onChange={handleChange}
            />
          </label>
          <label>
            전화번호:
            <input
              type="text"
              name="phone"
              value={member.phone}
              onChange={handleChange}
            />
          </label>
          <label>
            생년월일:
            <input
              type="date"
              name="birth"
              value={member.birth}
              onChange={handleChange}
            />
          </label>
          <label>
            성별:
            <select name="sex" value={member.sex} onChange={handleChange}>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </label>
          <label>
            비밀번호:
            <input
              type="password"
              name="password"
              value={member.password}
              onChange={handleChange}
            />
          </label>
          <label>
            소셜 로그인 여부:
            <input
              type="checkbox"
              name="social"
              checked={member.social}
              onChange={handleChange}
            />
          </label>
          <button type="submit">수정하기</button>
        </form>
      </div>
    );
  };
  
  export default MemberDetail;