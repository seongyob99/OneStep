import React from "react";
import { useNavigate } from "react-router-dom";

const GoalCard = ({ goal }) => {
    console.log("📌 goal 데이터 확인:", goal);
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    // 목표 상세 페이지 이동 함수
    const handleNavigate = () => {
        navigate(`/${goal.goalId}`); // 목표 ID 기반 상세 페이지 이동
    };

    return (
        <div
            className="card"
            style={{ width: "18rem", cursor: "pointer" }}
            onClick={handleNavigate} // ✅ 카드 전체 클릭 시 이동
        >
            <img
                src={goal.thumbnail ? `${SERVER_URL}/uploads/${goal.thumbnail}` : `${SERVER_URL}/uploads/default.jpg`}
                className="card-img-top"
                alt="Goal Thumbnail"
            />
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0">{goal.title}</h5>
                    <p className="ms-2 mb-0 gray-text">| {goal.categoryName}</p>
                </div>
                <p className="card-text">{goal.startDate} ~ {goal.endDate || "종료 시"}</p>
                <p className="card-text">
                    참가 인원: <strong>{goal.members.length} / {goal.participants}</strong>
                </p>
            </div>
        </div>
    );
};

export default GoalCard;
