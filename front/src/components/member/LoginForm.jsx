import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Alert } from "react-bootstrap";
import "@styles/member/LoginForm.scss";

const LoginForm = () => {
    const navigate = useNavigate();

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
            console.log("📤 로그인 요청 데이터:", JSON.stringify(formData));  // JSON 확인
            const response = await axios.post(`${SERVER_URL}/member/login`, formData, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("✅ 응답 데이터:", response.data);

            // 로그인 성공 후 액세스 토큰을 로컬 스토리지에 저장
            localStorage.setItem("accessToken", response.data.accessToken);

            // 로그인 성공 후 추가 작업
            onLoginSuccess(response.data.accessToken);

        } catch (error) {
            console.error("❌ 로그인 실패:", error.response?.data || error.message);
            setIsError(true);
            setResponseMessage(error.response?.data?.message || "로그인 실패");
        }
    };

    // 로그인 성공 후 처리
    const onLoginSuccess = (accessToken) => {
        // 예: 로그인 성공 후 액세스 토큰을 저장하고, 리다이렉트
        console.log("로그인 성공! 액세스 토큰:", accessToken);
        navigate("/");  // 예시: 로그인 후 대시보드로 리다이렉트
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
        <div className="login-form-container">
            <h2>로그인</h2>

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
    );
};

export default LoginForm;
