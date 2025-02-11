import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const MemberDetail = () => {
  // AuthContext에서 authState 가져오기
  const { authState } = useAuth();
  // username 가져오기
  const memberId = authState.user?.username;
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const [member, setMember] = useState({
    memberId: "",
    name: "",
    password: "",
    email: "",
    phone: "",
    birth: "",
    social: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [newPassword, setNewPassword] = useState(""); // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(""); // 새 비밀번호 확인
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false); // 비밀번호 변경 활성화 여부

  const navigate = useNavigate();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setMinutes(yesterday.getMinutes() - yesterday.getTimezoneOffset());
  const formattedDate = yesterday.toISOString().split("T")[0];

  useEffect(() => {
    if (authState === undefined || authState === null) {
      return;
    }
    setIsAuthLoaded(true);
    setLoading(false);
  }, [authState]);

  useEffect(() => {
    if (isAuthLoaded && !authState.isAuthenticated) {
      navigate("/member/login", { replace: true });
    }
  }, [isAuthLoaded, authState.isAuthenticated, navigate]);

  // 사용자 정보 가져오기
  const fetchMember = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/member/${memberId}`);
      setMember(response.data);
    } catch (error) {
      console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
      setError("사용자 정보를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!memberId) {
      return;
    }

    fetchMember();
  }, [memberId]);

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
    if (isPasswordChangeEnabled) {
      if (!newPassword) {
        return "새 비밀번호를 입력해주세요.";
      }
      if (newPassword.length < 6 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
        return "비밀번호는 영문자와 숫자가 포함된 6자 이상이어야 합니다.";
      }
      if (newPassword !== confirmPassword) {
        return "변경할 비밀번호와 비밀번호 확인이 일치하지 않습니다.";
      }
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

    // 업데이트할 데이터 구성
    const updatedMemberData = {
      ...member,
    };

    // 비밀번호 변경이 활성화된 경우에만 비밀번호 추가
    if (isPasswordChangeEnabled) {
      updatedMemberData.password = newPassword;
    }

    setValidationError(null); // 이전 에러 초기화
    try {
      await axios.put(`${SERVER_URL}/member/update`, updatedMemberData);
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
        {validationError && <Alert variant="danger" className="fs-5">{validationError}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <h5>회원 ID</h5>
            <Form.Control type="text" value={member.memberId} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <h5>이름</h5>
            <Form.Control
              type="text"
              name="name"
              value={member.name}
              onChange={(e) => setMember({ ...member, name: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <h5>이메일</h5>
            <Form.Control
              type="email"
              name="email"
              value={member.email}
              onChange={(e) => setMember({ ...member, email: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <h5>전화번호</h5>
            <Form.Control
              type="text"
              name="phone"
              value={member.phone}
              onChange={(e) => setMember({ ...member, phone: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <h5>생년월일</h5>
            <Form.Control
              type="date"
              name="birth"
              value={member.birth || ""}
              onChange={(e) => setMember({ ...member, birth: e.target.value })}
              max={formattedDate}
            />
          </Form.Group>

          {/* 비밀번호 변경 체크박스 */}
          <Form.Group className="mb-3 d-flex align-items-center">
            <h5 className="me-2">비밀번호 변경</h5>
            <Form.Check
              type="switch" // 스위치 스타일 적용
              id="passwordChangeSwitch"
              placeholder="비밀번호는 6자 이상, 영문자와 숫자를 포함해주세요"
              checked={isPasswordChangeEnabled}
              onChange={(e) => {
                setValidationError(null);
                setNewPassword("");
                setConfirmPassword("");
                setIsPasswordChangeEnabled(e.target.checked)
              }
              }
              style={{ marginBottom: "10px" }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Row>
              {/* 새 비밀번호 입력 */}
              <Col md={6}>
                <h5>새 비밀번호</h5>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setValidationError(null);
                    setNewPassword(e.target.value)
                  }
                  }
                  disabled={!isPasswordChangeEnabled}
                />
              </Col>

              {/* 비밀번호 확인 입력 */}
              <Col md={6}>
                <h5>비밀번호 확인</h5>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={!isPasswordChangeEnabled}
                />
              </Col>
            </Row>
          </Form.Group>

          <Button variant="primary" onClick={handleUpdate}>
            저장하기
          </Button>
        </Form>
      </h3>
    </Container >
  );
};

export default MemberDetail;
