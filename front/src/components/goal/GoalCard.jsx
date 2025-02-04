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
            className="card shadow-sm p-3 d-flex flex-column justify-content-between"
            style={{ width: "100%", cursor: "pointer", borderRadius: "10px" }}
            onClick={handleNavigate} // ✅ 카드 전체 클릭 시 이동
        >
            {/* ✅ 이미지 및 구분선 추가 */}
            <div className="text-center">
                <img
                    src={goal.thumbnail ? `${SERVER_URL}/uploads/${goal.thumbnail}` : `${SERVER_URL}/uploads/default.jpg`}
                    className="card-img-top"
                    alt="Goal Thumbnail"
                    style={{
                        height: "180px",
                        objectFit: "cover",
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                    }} // ✅ 이미지 높이 고정 & 비율 유지
                />
                <hr className="my-3" /> {/* ✅ 이미지 아래 줄 */}
            </div>

            {/* ✅ 카드 본문 */}
            <div className="card-body p-2 d-flex flex-column">
                <div className="d-flex align-items-center">
                    <h5
                        className="card-title mb-0 text-truncate"
                        style={{
                            maxWidth: "150px", // ✅ 제목 길이 제한
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "inline-block",
                        }}
                        title={goal.title} // ✅ 마우스 올리면 전체 제목 표시
                    >
                        {goal.title}
                    </h5>
                    <p className="ms-2 mb-0 gray-text">| {goal.categoryName}</p>
                </div>
                <p className="card-text">{goal.startDate} ~ {goal.endDate || "종료 시"}</p>
                <p className="card-text">
                    참가 인원: <strong>{goal.members?.length ?? 0} / {goal.participants}</strong>
                </p>
            </div>
        </div>
    );
};

export default GoalCard;
