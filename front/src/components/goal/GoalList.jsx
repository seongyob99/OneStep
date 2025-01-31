import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoalCard from "./GoalCard";

const GoalList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [goals, setGoals] = useState([]);
    const [joinedGoals, setJoinedGoals] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const [isFetching, setIsFetching] = useState(false); // 데이터 가져오는 중인지 여부
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
    const observer = useRef(null); // Intersection Observer 관리

    const navigate = useNavigate();

    // 목표 목록 가져오기 (페이지네이션 적용)
    const fetchGoals = async (page = 0, reset = false) => {
        if (!hasMore && !reset) return; // 더 불러올 데이터가 없으면 중단
        setIsFetching(true);

        try {
            const response = await axios.get("http://localhost:8080/goals/list", {
                params: {
                    categoryName: selectedCategory || undefined,
                    title: searchTerm || undefined,
                    page: page,
                    size: 6, // 한 번에 6개씩 불러오기
                },
            });

            console.log("📌 서버 응답 데이터:", response.data);

            if (response.data.content.length === 0) {
                setHasMore(false); // 추가 데이터 없음
            } else {
                setHasMore(true);
                setGoals(prevGoals => (reset ? response.data.content : [...prevGoals, ...response.data.content]));
            }
        } catch (error) {
            console.error("목표 리스트 불러오는 중 오류 발생:", error);
        } finally {
            setIsFetching(false);
        }
    };

    // 검색 버튼 클릭 시 새로운 검색 적용
    const handleSearch = () => {
        setCurrentPage(0);
        setHasMore(true);
        setGoals([]);
        fetchGoals(0, true); // 첫 페이지부터 새로 불러오기
    };

    // 참가 버튼 클릭 핸들러
    const handleJoin = (goalId) => {
        axios.post(`http://localhost:8080/goals/${goalId}/join`, { memberId: 1 })
            .then(() => {
                alert("참가 완료!");
                setJoinedGoals((prev) => [...prev, goalId]);
            })
            .catch((error) => {
                console.error("참가 실패:", error);
                alert("참가 중 오류가 발생했습니다.");
            });
    };

    // 무한 스크롤 감지
    useEffect(() => {
        if (isFetching) return;
        if (!observer.current) return;

        const observerCallback = (entries) => {
            if (entries[0].isIntersecting) {
                setCurrentPage(prevPage => {
                    const nextPage = prevPage + 1;
                    fetchGoals(nextPage);
                    return nextPage;
                });
            }
        };

        const observerOptions = {
            root: null,
            rootMargin: "100px",
            threshold: 1.0,
        };

        const newObserver = new IntersectionObserver(observerCallback, observerOptions);
        newObserver.observe(observer.current);
        return () => newObserver.disconnect();
    }, [isFetching, hasMore]);

    // 처음 로딩 시 데이터 가져오기
    useEffect(() => {
        fetchGoals();
    }, []);

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
                <button className="btn btn-secondary" onClick={handleSearch}>
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

            {/* 무한 스크롤 트리거 (마지막 요소) */}
            <div ref={observer} style={{ height: "10px", margin: "20px 0" }} />

            {/* 로딩 표시 */}
            {isFetching && <p className="text-center">⏳ 로딩 중...</p>}
        </div>
    );
};

export default GoalList;
