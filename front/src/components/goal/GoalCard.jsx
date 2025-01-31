import React from "react";

const GoalCard = ({ goal, onJoin, isJoined }) => {
    return (
        <div className="card" style={{ width: "18rem" }}>
            <img
                src={`http://localhost:8080/uploads/${goal.thumbnail || "default.jpg"}`} // 기본 이미지 처리
                className="card-img-top"
                alt="Goal Thumbnail"
            />
            <div className="card-body">
                <h5 className="card-title">{goal.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">카테고리: {goal.category}</h6>
                <p className="card-text">{goal.description}</p>
                <p className="card-text">
                    시작일: {goal.startDate} ~ 종료일: {goal.endDate}
                </p>
                <p className="card-text">참가인원: {goal.participants}</p>
                <a href={`/goals/${goal.goalId}`} className="btn btn-primary">
                    상세 보기
                </a>
                <button
                    className="btn btn-success ms-2"
                    onClick={() => onJoin(goal.goalId)}
                    disabled={isJoined} // 이미 참가했으면 버튼 비활성화
                >
                    {isJoined ? "참가 완료" : "참가"}
                </button>
            </div>
        </div>
    );
};

export default GoalCard;
