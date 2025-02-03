import React from "react";
import { useNavigate } from "react-router-dom";

const GoalCard = ({ goal }) => {
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
                <h5 className="card-title">{goal.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">카테고리: {goal.categoryName}</h6>
                <p className="card-text">{goal.description}</p>
                <p className="card-text">시작일: {goal.startDate} ~ 종료일: {goal.endDate || "미정"}</p>
                <p className="card-text">참가인원: {goal.participants}</p>
            </div>
        </div>
    );
};

export default GoalCard;
