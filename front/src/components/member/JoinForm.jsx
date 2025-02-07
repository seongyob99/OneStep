import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Form, Alert } from "react-bootstrap";
import "@styles/member/JoinForm.scss";

const JoinForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    memberId: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birth: "",
    sex: "",
    social: false,
  });

  const [responseMessage, setResponseMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState({});

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const validateForm = () => {
    let tempErrors = {};
    let formIsValid = true;

    if (!formData.memberId) {
      tempErrors.memberId = "회원 ID를 입력하세요.";
      formIsValid = false;
    }
    if (!formData.name) {
      tempErrors.name = "이름을 입력하세요.";
      formIsValid = false;
    }
    if (!formData.email) {
      tempErrors.email = "이메일을 입력하세요.";
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "유효한 이메일을 입력하세요.";
      formIsValid = false;
    }

    if (!formData.password) {
      tempErrors.password = "비밀번호를 입력하세요.";
      formIsValid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = "비밀번호는 최소 6자 이상이어야 합니다.";
      formIsValid = false;
    } else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      tempErrors.password = "비밀번호는 영문자와 숫자가 포함되어야 합니다.";
      formIsValid = false;
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "비밀번호 확인을 입력하세요.";
      formIsValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      formIsValid = false;
    }

    if (!formData.phone) {
      tempErrors.phone = "전화번호를 입력하세요.";
      formIsValid = false;
    } else if (!/^(\d{3})-(\d{4})-(\d{4})$/.test(formData.phone)) {
      tempErrors.phone = "전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678";
      formIsValid = false;
    }

    if (!formData.birth) {
      tempErrors.birth = "생년월일을 입력하세요.";
      formIsValid = false;
    }

    if (!formData.sex) {
      tempErrors.sex = "성별을 선택하세요.";
      formIsValid = false;
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleRegisterClick = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/member/join`, formData);

      setIsError(false);
      setResponseMessage("회원가입 성공!");
      navigate("/member/login"); // 회원가입 후 로그인 페이지로 이동
    } catch (error) {
      setIsError(true);
      setResponseMessage(error.response?.data?.message || "회원가입 실패");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container>
      <div className="join-form-container">
        <h3>회원가입</h3>
        {responseMessage && (
          <Alert variant={isError ? "danger" : "success"}>{responseMessage}</Alert>
        )}

        <Form>
          <div className="form-group">
            <label className="form-label">회원 ID</label>
            <Form.Control
              type="text"
              name="memberId"
              value={formData.memberId}
              onChange={handleInputChange}
              isInvalid={!!errors.memberId}
              placeholder="아이디를 입력하세요"
              required
            />
            {errors.memberId && <div className="error-text">{errors.memberId}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">이름</label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              isInvalid={!!errors.name}
              placeholder="이름을 입력하세요"
              required
            />
            {errors.name && <div className="error-text">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">이메일</label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              isInvalid={!!errors.email}
              placeholder="이메일을 입력하세요"
              required
            />
            {errors.email && <div className="error-text">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              isInvalid={!!errors.password}
              placeholder="비밀번호를 입력하세요"
              required
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호 확인</label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              isInvalid={!!errors.confirmPassword}
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">전화번호</label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              isInvalid={!!errors.phone}
              placeholder="010-1234-5678"
              required
            />
            {errors.phone && <div className="error-text">{errors.phone}</div>}
          </div>

          <div className="form-group d-flex justify-content-between">
            <div style={{ flex: 1, marginRight: '40px' }}>
              <label className="form-label">생년월일</label>
              <Form.Control
                type="date"
                name="birth"
                value={formData.birth}
                onChange={handleInputChange}
                isInvalid={!!errors.birth}
                required
              />
              {errors.birth && <div className="error-text">{errors.birth}</div>}
            </div>

            <div style={{ flex: 1 }}>
              <label className="form-label">성별</label>
              <div className="mt-2">
                <input
                  type="radio"
                  id="male"
                  name="sex"
                  value="M"
                  checked={formData.sex === "M"}
                  onChange={handleInputChange}
                />
                <label htmlFor="male">남성</label>

                <input
                  type="radio"
                  id="female"
                  name="sex"
                  value="F"
                  checked={formData.sex === "F"}
                  onChange={handleInputChange}
                  className="ml-4"
                />
                <label htmlFor="female">여성</label>
              </div>
              {errors.sex && <div className="error-text">{errors.sex}</div>}
            </div>
          </div>

          <Button variant="primary" className="mt-3 w-100" onClick={handleRegisterClick}>
            회원가입
          </Button>
        </Form>
      </div>
    </Container>
  );
};


export default JoinForm;
