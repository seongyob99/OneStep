import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Button, Form, Alert } from "react-bootstrap";
import "@styles/member/LoginForm.scss";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        memberId: "",
        password: "",
    });

    const [responseMessage, setResponseMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState({});

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    // 유효성 검사
    const validateForm = () => {
        let tempErrors = {};
        let formIsValid = true;

        if (!formData.memberId) {
            tempErrors.memberId = "회원 ID를 입력하세요.";
            formIsValid = false;
        }
        if (!formData.password) {
            tempErrors.password = "비밀번호를 입력하세요.";
            formIsValid = false;
        }

        setErrors(tempErrors);
        return formIsValid;
    };

    // 로그인 요청
    const handleLoginClick = async () => {
        if (!validateForm()) return;

        try {
            const response = await axios.post(`${SERVER_URL}/member/login`, formData, {
                headers: { "Content-Type": "application/json" }
            });

            const { accessToken, refreshToken, user } = response.data;

            login(accessToken, refreshToken, user);

            navigate("/");
        } catch (error) {
            console.error("❌ 로그인 실패:", error.response?.data || error.message);
            setIsError(true);
            setResponseMessage("ID 또는 비밀번호를 다시 확인해주세요.");
        }
    };

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 회원가입 버튼 클릭 시 `/member/join` 페이지로 이동
    const handleRegisterClick = () => {
        navigate("/member/join");
    };

    return (
        <Container className="h-100 d-flex align-items-center">
            <div className="login-form-container">
                <h3>로그인</h3>

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

                    <Button variant="primary" className="mt-3 w-100" onClick={handleLoginClick}>
                        로그인
                    </Button>

                    <Button
                        variant="secondary"
                        className="mt-2 w-100"
                        onClick={handleRegisterClick}
                    >
                        회원가입
                    </Button>
                </Form>
            </div>
        </Container>
    );
};


export default LoginForm;
