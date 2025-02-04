import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Alert, Accordion } from 'react-bootstrap';
import '../../styles/member/JoinForm.scss';

const JoinForm = () => {
  const [formData, setFormData] = useState({
    memberId: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    birth: '',
    sex: '',
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
      tempErrors.memberId = '회원 ID를 입력하세요.';
      formIsValid = false;
    }
    if (!formData.name) {
      tempErrors.name = '이름을 입력하세요.';
      formIsValid = false;
    }
    if (!formData.email) {
      tempErrors.email = '이메일을 입력하세요.';
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = '유효한 이메일을 입력하세요.';
      formIsValid = false;
    }
    if (!formData.password) {
      tempErrors.password = '비밀번호를 입력하세요.';
      formIsValid = false;
    } else if (formData.password.length < 8) {
      tempErrors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
      formIsValid = false;
    } else if (!/[A-Za-z]/.test(formData.password) || !/\d/.test(formData.password)) {
      tempErrors.password = '비밀번호는 영문자와 숫자가 포함되어야 합니다.';
      formIsValid = false;
    }
    if (!formData.phone) {
      tempErrors.phone = '전화번호를 입력하세요.';
      formIsValid = false;
    } else if (!/^(\d{3})-(\d{4})-(\d{4})$/.test(formData.phone)) {
      tempErrors.phone = '전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678';
      formIsValid = false;
    }
    if (!formData.birth) {
      tempErrors.birth = '생년월일을 입력하세요.';
      formIsValid = false;
    }
    if (!formData.sex) {
      tempErrors.sex = '성별을 선택하세요.';
      formIsValid = false;
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/member/join`, formData);
      

      setIsError(false);
      setResponseMessage(response.data.message);
    } catch (error) {
      setIsError(true);
      setResponseMessage(error.response?.data?.message || '알 수 없는 오류가 발생했습니다.');
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
    <div className="join-form-container">
      <h2>회원가입</h2>
      {responseMessage && (
        <Alert variant={isError ? 'danger' : 'success'}>
          {responseMessage}
        </Alert>
      )}

      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>회원가입 정보</Accordion.Header>
          <Accordion.Body>
            <Form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>회원 ID</label>
                <Form.Control
                  type="text"
                  name="memberId"
                  value={formData.memberId}
                  onChange={handleInputChange}
                  isInvalid={!!errors.memberId}
                  required
                />
                {errors.memberId && <div className="error-text">{errors.memberId}</div>}
              </div>

              <div className="form-group">
                <label>이름</label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  isInvalid={!!errors.name}
                  required
                />
                {errors.name && <div className="error-text">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label>이메일</label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  isInvalid={!!errors.email}
                  required
                />
                {errors.email && <div className="error-text">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label>비밀번호</label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  isInvalid={!!errors.password}
                  required
                />
                {errors.password && <div className="error-text">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label>전화번호</label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  isInvalid={!!errors.phone}
                  required
                />
                {errors.phone && <div className="error-text">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label>생년월일</label>
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

              <div className="form-group">
                <label>성별</label>
                <div>
                  <input
                    type="radio"
                    id="male"
                    name="sex"
                    value="M"
                    checked={formData.sex === 'M'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="male">남성</label>
                  <input
                    type="radio"
                    id="female"
                    name="sex"
                    value="F"
                    checked={formData.sex === 'F'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="female">여성</label>
                </div>
                {errors.sex && <div className="error-text">{errors.sex}</div>}
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="social"
                    checked={formData.social}
                    onChange={(e) => setFormData({ ...formData, social: e.target.checked })}
                  />
                  소셜 회원가입
                </label>
              </div>

              <Button variant="primary" type="submit">
                회원가입
              </Button>
            </Form>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default JoinForm;
