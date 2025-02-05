import React from "react";
import { useNavigate } from "react-router-dom";
import '@styles/goal/goalCard.scss';


const GoalCard = ({ goal }) => {
    console.log("📌 goal 데이터 확인:", goal);
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    // 목표 상세 페이지 이동 함수
    const handleNavigate = () => {
        navigate(`/${goal.goalId}`);
    };

    return (
        <div className="goal-card card shadow-sm p-3 d-flex flex-column justify-content-between" onClick={handleNavigate}>
            {/* ✅ 이미지 및 구분선 */}
            <div className="text-center">
                <img
                    src={goal.thumbnail ? `${SERVER_URL}/uploads/${goal.thumbnail}` : `${SERVER_URL}/uploads/default.jpg`}
                    className="goal-card-img card-img-top"
                    alt="Goal Thumbnail"
                />
                <hr className="goal-card-hr" />
            </div>

            {/* ✅ 카드 본문 */}
            <div className="goal-card-body card-body">
                <div className="d-flex align-items-center">
                    <h5 className="goal-card-title card-title" title={goal.title}>
                        {goal.title}
                    </h5>
                    <p className="goal-card-category mb-0">| {goal.categoryName}</p>
                </div>
                <p className="goal-card-text">{goal.startDate} ~ {goal.endDate || "종료 시"}</p>
                <p className="goal-card-text">
                    참가 인원: <strong>{(goal.members ?? []).length} / {goal.participants}</strong>
                </p>
            </div>
        </div>
    );
};

export default GoalCard;