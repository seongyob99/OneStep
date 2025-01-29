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
        fetchGoals();
    }, []); // 페이지가 처음 로드될 때 실행

    // 목표 검색 함수
    const fetchGoals = async () => {
        try {
            const response = await axios.get('http://localhost:8080/goals/list', {
                params: {
                    categoryName: selectedCategory || undefined,
                    title: searchTerm || undefined
                }
            });

            console.log("서버 응답 데이터:", response.data); // 응답 확인
            if (Array.isArray(response.data)) {
                setGoals(response.data);
            } else {
                console.error("API 응답이 배열이 아닙니다:", response.data);
                setGoals([]); // 기본값 빈 배열로 설정
            }
        } catch (error) {
            console.error("목표 리스트 불러오는 중 오류 발생:", error);
        }
    };

    // 참가 버튼 클릭 핸들러
    const handleJoin = (goalId) => {
        axios.post(`http://localhost:8080/goals/${goalId}/join`, {
            memberId: 1, // 로그인된 사용자 ID (임시 하드코딩)
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
                <button className="btn btn-primary" onClick={() => navigate("goals/register")}>
                    목표 등록
                </button>
            </div>

            {/* 검색 기능 */}
            <div className="d-flex gap-2 mb-3">
                <input
                    type="text"
                    placeholder="검색어 입력"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-select"
                >
                    <option value="">전체</option>
                    <option value="기타">기타</option>
                    <option value="공부">공부</option>
                    <option value="습관">습관</option>
                    <option value="운동">운동</option>
                </select>
                <button className="btn btn-secondary" onClick={fetchGoals}>
                    검색
                </button>
            </div>

            {/* 목표 카드 리스트 */}
            <div className="row">
                {goals.length > 0 ? (
                    goals.map((goal) => (
                        <div className="col-md-4 mb-4" key={goal.goalId}>
                            <GoalCard
                                goal={goal}
                                onJoin={handleJoin}
                                isJoined={joinedGoals.includes(goal.goalId)}
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-center">검색 결과가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default GoalList;
