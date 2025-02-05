import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Alert } from "react-bootstrap";
import "../../styles/member/LoginForm.scss";

const LoginForm = ({ onLoginSuccess }) => {
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
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post(`${SERVER_URL}/member/login`, formData);

            // JWT 토큰 저장
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);

            setIsError(false);
            setResponseMessage("로그인 성공!");
            onLoginSuccess(response.data.accessToken);
        } catch (error) {
            setIsError(true);
            setResponseMessage(error.response?.data?.message || "로그인 실패");
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

    return (
        <div className="login-form-container">
            <h2>로그인</h2>

            {responseMessage && (
                <Alert variant={isError ? "danger" : "success"}>{responseMessage}</Alert>
            )}

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

                <Button variant="primary" type="submit">
                    로그인
                </Button>
            </Form>
        </div>
    );
};

export default LoginForm;
