import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoalRegister = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [participants, setParticipants] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [certCycle, setCertCycle] = useState("");
    const [rule, setRule] = useState("");
    const [categoryId, setCategoryId] = useState(""); // 카테고리 선택 값 추가
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const categories = [
        { id: 1, name: "운동" },
        { id: 2, name: "건강" },
        { id: 3, name: "학습" },
        { id: 4, name: "습관" },
        { id: 5, name: "기타" }
    ];


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !description || !certCycle || !startDate || !rule || !categoryId) {
            alert("🚨 모든 필드를 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("participants", participants);
        formData.append("startDate", startDate);
        formData.append("endDate", endDate);
        formData.append("certCycle", certCycle);
        formData.append("memberId", "user01");
        formData.append("categoryId", Number(categoryId));
        formData.append("rule", rule);

        if (thumbnail) {
            formData.append("file", thumbnail);
        }

        axios.post(`${SERVER_URL}/goals/register`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(() => {
                alert("✅ 목표 등록 완료!");
                navigate("/");
            })
            .catch((error) => {
                console.error("❌ 등록 실패:", error);
                alert(`목표 등록 중 오류가 발생했습니다: ${error.message}`);
            });
    };

    return (
        <div className="container mt-8">
            <h1 className="text-2xl font-bold mb-4">목표 등록</h1>
            <form onSubmit={handleSubmit}>
                {/* ✅ 목표 제목 */}
                <div className="mb-4">
                    <label className="form-label">목표 제목</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* ✅ 목표 설명 */}
                <div className="mb-4">
                    <label className="form-label">목표 설명</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* ✅ 참가 인원 필드 (숫자 증감 버튼 제거) */}
                <div className="mb-4">
                    <label className="form-label">참가 인원</label>
                    <input
                        type="number"
                        min="1"
                        className="form-control no-spin"
                        value={participants}
                        onChange={(e) => {
                            let value = e.target.value.replace(/^0+/, ""); // 0으로 시작하는 값 제거
                            if (!/^\d*$/.test(value)) return; // 숫자가 아니면 입력 방지
                            setParticipants(value);
                        }}
                    />
                </div>

                {/* ✅ 시작일 */}
                <div className="mb-4">
                    <label className="form-label">시작일</label>
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                {/* ✅ 종료일 */}
                <div className="mb-4">
                    <label className="form-label">종료일</label>
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="종료일 (선택 사항)"
                    />
                </div>

                {/* ✅ 인증 주기 필드 (숫자 증감 버튼 제거) */}
                <div className="mb-4">
                    <label className="form-label">인증 주기</label>
                    <input
                        type="number"
                        min="1"
                        className="form-control no-spin"
                        value={certCycle}
                        onChange={(e) => {
                            let value = e.target.value.replace(/^0+/, ""); // 0으로 시작하는 값 제거
                            if (!/^\d*$/.test(value)) return; // 숫자가 아니면 입력 방지
                            setCertCycle(value);
                        }}
                        placeholder="예: 1, 7, 30"
                    />
                </div>

                {/* ✅ 인증 규칙 */}
                <div className="mb-4">
                    <label className="form-label">인증 규칙</label>
                    <input
                        type="text"
                        className="form-control"
                        value={rule}
                        onChange={(e) => setRule(e.target.value)}
                        placeholder="예: 하루 1회 인증 필수"
                    />
                </div>

                {/* ✅ 카테고리 선택 필드 */}
                <div className="mb-4">
                    <label className="form-label">카테고리</label>
                    <select
                        className="form-control"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">카테고리를 선택하세요</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* ✅ 썸네일 사진 */}
                <div className="mb-4">
                    <label className="form-label">썸네일 사진</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    등록
                </button>
            </form>
        </div>
    );
};

export default GoalRegister;
