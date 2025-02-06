import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const MemberDetail = () => {
  const [member, setMember] = useState({
    memberId: "",
    name: "",
    email: "",
    phone: "",
    birth: "",
    social: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(""); // 현재 비밀번호
  const [newPassword, setNewPassword] = useState(""); // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 새 비밀번호 확인
  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // 오늘 날짜 계산
  const today = new Date().toISOString().split("T")[0];

  // 사용자 정보 가져오기
  const fetchMember = async () => {
    try {
      const memberId = "user03"; // 로그인된 사용자 ID
      const response = await axios.get(`${SERVER_URL}/api/member/${memberId}`);
      setMember(response.data);
    } catch (error) {
      console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
      setError("사용자 정보를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, []);

  // 유효성 검사 함수
  const validateForm = () => {
    if (!member.name.trim()) {
      return "이름을 입력해주세요.";
    }
    if (!member.email.trim() || !/\S+@\S+\.\S+/.test(member.email)) {
      return "올바른 이메일 형식을 입력해주세요.";
    }
    if (!member.phone.trim() || !/^\d{3}-\d{3,4}-\d{4}$/.test(member.phone)) {
      return "전화번호는 000-0000-0000 형식으로 입력해주세요.";
    }
    if (member.birth && new Date(member.birth) > new Date()) 
    if (newPassword && newPassword.length < 8) {
      return "새 비밀번호는 최소 8자 이상이어야 합니다.";
    }
    if (newPassword !== confirmPassword) {
      return "변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.";
    }
    return null; // 유효성 검사를 통과한 경우
  };

  // 정보 수정 요청
  const handleUpdate = async () => {
    const validationMessage = validateForm();
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }

    setValidationError(null); // 이전 에러 초기화
    try {
      await axios.put(`${SERVER_URL}/api/member/update`, {
        ...member,
        currentPassword, // 기존 비밀번호
        newPassword, // 새 비밀번호
      });
      alert("회원 정보가 성공적으로 수정되었습니다.");
      navigate("/mypage"); // 수정 성공 시 마이페이지로 이동
    } catch (error) {
      console.error("회원 정보 수정에 실패했습니다.", error);
      alert("회원 정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <div>로딩 중...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h3 className="my-4">
      {validationError && <Alert variant="danger">{validationError}</Alert>}
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>회원 ID</Form.Label>
          <Form.Control type="text" value={member.memberId} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={member.name}
            onChange={(e) => setMember({ ...member, name: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={member.email}
            onChange={(e) => setMember({ ...member, email: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>전화번호</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={member.phone}
            onChange={(e) => setMember({ ...member, phone: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>생년월일</Form.Label>
          <Form.Control
            type="date"
            name="birth"
            value={member.birth || ""}
            onChange={(e) => setMember({ ...member, birth: e.target.value })}
            max={today} // 오늘 날짜를 초과하지 못하도록 설정
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>비밀번호 변경</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleUpdate}>
          저장하기
        </Button>
      </Form>
      </h3>
    </Container>
  );
};

export default MemberDetail;
