import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoalCard from "./GoalCard";

const GoalList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [goals, setGoals] = useState([]);
    const [joinedGoals, setJoinedGoals] = useState([]); // 참가한 목표 ID 목록
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

    // 목표 목록 가져오기
    useEffect(() => {
        axios
            .get("http://localhost:8080/goals/list")
            .then((response) => {
                console.log("목표 목록 응답:", response.data); // 서버 응답 확인
                setGoals(response.data);
            })
            .catch((error) => console.error("Error fetching goals:", error));
    }, []);

    // 참가 버튼 클릭 핸들러
    const handleJoin = (goalId) => {
        axios
            .post(`http://localhost:8080/goals/${goalId}/join`, {
                memberId: 1, // 로그인된 사용자 ID (임시 하드코딩)
                // memberId: memberId, // 로그인 연동 후

            })
            .then(() => {
                alert("참가 완료!");
                setJoinedGoals((prev) => [...prev, goalId]); // 참가한 목표 ID 저장
            })
            .catch((error) => {
                console.error("참가 실패:", error);
                alert("참가 중 오류가 발생했습니다.");
            });
    };




    return (
        <div className="container mt-4">
            {/* 상단 제목과 목표 등록 버튼 */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>목표 목록</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("goals/register")}
                >
                    목표 등록
                </button>
            </div>
            <input
                type="text"
                placeholder="검색어 입력"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">전체</option>
                <option value="건강">건강</option>
                <option value="공부">공부</option>
                <option value="습관">습관</option>
            </select>

            {/* 목표 카드 리스트 */}
            <div className="row">
                {goals.map((goal) => (
                    <div className="col-md-4 mb-4" key={goal.goalId}>
                        <GoalCard
                            goal={goal}
                            onJoin={handleJoin}
                            isJoined={joinedGoals.includes(goal.goalId)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalList;
