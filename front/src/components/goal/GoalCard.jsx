import { useNavigate } from "react-router-dom";

const GoalCard = ({ goal }) => {
    const navigate = useNavigate();

    return (
        <div className="card" style={{ width: "18rem" }}>
            <img
                src={goal.thumbnailUrl ? goal.thumbnailUrl : "http://localhost:8080/uploads/default.jpg"}
                className="card-img-top"
                alt="Goal Thumbnail"
            />
            <div className="card-body">
                <h5 className="card-title">{goal.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">카테고리: {goal.categoryName}</h6>
                <p className="card-text">{goal.description}</p>
                <p className="card-text">시작일: {goal.startDate} ~ 종료일: {goal.endDate}</p>
                <p className="card-text">참가인원: {goal.participants}</p>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/${goal.goalId}`)}
                >
                    상세 보기
                </button>
            </div>
        </div>
    );
};

export default GoalCard;
