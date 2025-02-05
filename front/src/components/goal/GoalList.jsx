import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import GoalCard from "./GoalCard";
import "@styles/goal/goalList.scss";

const GoalList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [goals, setGoals] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef(null);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${SERVER_URL}/categories`)
            .then(response => setCategories(response.data))
            .catch(() => alert("카테고리를 불러오는 데 실패했습니다."));
    }, []);

    const fetchGoals = useCallback(async (page = 0, reset = false) => {
        if (!hasMore && !reset) return;
        setIsFetching(true);

        try {
            const response = await axios.get(`${SERVER_URL}/goals/list`, {
                params: {
                    categoryId: selectedCategory || undefined,
                    title: searchTerm || undefined,
                    page: page,
                    size: 8,
                },
            });

            console.log("📌 서버 응답 데이터:", response.data);

            if (!response.data || response.data.length === 0) {
                setHasMore(false);
            } else {
                setHasMore(true);

                setGoals(prevGoals => {
                    const newGoals = response.data.filter(
                        newGoal => !prevGoals.some(existingGoal => existingGoal.goalId === newGoal.goalId)
                    );
                    return reset ? response.data : [...prevGoals, ...newGoals];
                });
            }
        } catch (error) {
            console.error("목표 리스트 불러오는 중 오류 발생:", error);
        } finally {
            setIsFetching(false);
        }
    }, [hasMore, selectedCategory, searchTerm]);

    useEffect(() => {
        setCurrentPage(0);
        setGoals([]);
        setHasMore(true);
        fetchGoals(0, true);
    }, [selectedCategory, fetchGoals]);

    const handleSearch = () => {
        setCurrentPage(0);
        setGoals([]);
        setHasMore(true);
        fetchGoals(0, true);
    };

    useEffect(() => {
        if (isFetching || !hasMore) return;
        if (!observer.current) return;

        const observerCallback = (entries) => {
            if (entries[0].isIntersecting && !isFetching) {
                setCurrentPage(prevPage => {
                    fetchGoals(prevPage + 1);
                    return prevPage + 1;
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
    }, [isFetching, hasMore, fetchGoals]);

    useEffect(() => {
        fetchGoals();
    }, []);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-3">목표 목록</h3>
                <button className="btn btn-primary" onClick={() => navigate("/goals/register")}>
                    목표 등록
                </button>
            </div>

            <div className="goal-search-container mb-4">
                <select
                    className="form-control goal-search-category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">전체</option>
                    {categories.map(category => (
                        <option key={category.categoryId} value={category.categoryId}>
                            {category.cateName}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    className="form-control goal-search-input"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <button className="btn btn-info goal-search-btn" onClick={handleSearch}>
                    검색
                </button>
            </div>

            <div className="row g-4 justify-content-start">
                {goals.length > 0 ? (
                    goals.map((goal, index) => (
                        <div className="col-md-3 d-flex" key={`${goal.goalId}-${index}`}>
                            <GoalCard goal={goal} />
                        </div>
                    ))
                ) : (
                    <p className="text-center">검색 결과가 없습니다.</p>
                )}
            </div>

            <div ref={observer} style={{ height: "10px", margin: "20px 0" }} />

            {isFetching && <p className="text-center">⏳ 로딩 중...</p>}
        </div>
    );
};

export default GoalList;
