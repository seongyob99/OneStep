import React from "react";
import { useNavigate } from "react-router-dom";
import '@styles/goal/goalCard.scss';

const GoalCard = ({ goal }) => {
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    // ✅ 제목이 길면 앞부분 유지하고 뒤쪽만 ... 처리
    const truncateTitle = (title, maxLength = 10) => {
        if (title.length > maxLength) {
            return title.slice(0, 18) + "...";
        }
        return title;
    };

    // 목표 상세 페이지 이동 함수
    const handleNavigate = () => {
        navigate(`/${goal.goalId}`);
    };

    return (
        <div className="goal-card card shadow-sm p-3 d-flex flex-column justify-content-between" onClick={handleNavigate}>
            {/* ✅ 이미지 및 구분선 */}
            <div>
                <img
                    src={goal.thumbnail ? `${SERVER_URL}/uploads/${goal.thumbnail}` : `${SERVER_URL}/uploads/default.jpg`}
                    className="goal-card-img card-img-top"
                    alt="Goal Thumbnail"
                />
                <hr className="goal-card-hr" />
            </div>

            {/* ✅ 카드 본문 */}
            <div className="goal-card-body card-body">
                <p className="goal-card-category">{goal.categoryName}</p>
                <div className="d-flex align-items-center">
                    <h5 className="goal-card-title flex-grow-1 card-title" title={goal.title}>
                        {truncateTitle(goal.title, 15)} {/* ✅ 제목 길이 제한 적용 */}
                    </h5>
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
