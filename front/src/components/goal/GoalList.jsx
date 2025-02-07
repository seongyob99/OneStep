import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AutoSizer, Grid } from "react-virtualized";
import GoalCard from "./GoalCard";
import "@styles/goal/goalList.scss";
import { Container } from "react-bootstrap";

const GoalList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [goals, setGoals] = useState([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${SERVER_URL}/categories`)
            .then(response => setCategories(response.data))
            .catch(() => alert("카테고리를 불러오는 데 실패했습니다."));
    }, []);

    useEffect(() => {
        axios.get(`${SERVER_URL}/goals/list`, {
            params: {
                categoryId: selectedCategory || undefined,
                title: searchKeyword || undefined,
            },
        })
            .then(response => {
                setGoals(response.data);
            })
            .catch(error => console.error("목표 리스트 불러오는 중 오류 발생:", error));
    }, [selectedCategory, searchKeyword]);

    const handleSearch = () => {
        setSearchKeyword(searchTerm);
    };

    // ✅ 한 줄에 표시할 카드 개수
    const columnCount = 4;

    // ✅ 개별 목표 렌더링 함수
    const cellRenderer = ({ columnIndex, rowIndex, key, style }) => {
        const index = rowIndex * columnCount + columnIndex;
        if (index >= goals.length) return null;

        return (
            <div key={key} style={{ ...style }}>
                <GoalCard goal={goals[index]} />
            </div>
        );
    };

    return (
        <Container fluid>
            <div className="container mt-4">
                {/* 제목 + 목표 등록 버튼 */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-3">목표 목록</h3>
                    <button className="btn btn-primary" onClick={() => navigate("/goals/register")}>
                        목표 등록
                    </button>
                </div>

                {/* ✅ 검색 & 카테고리 필터 */}
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

                    <button className="btn btn-primary goal-search-btn" onClick={handleSearch}>
                        검색
                    </button>
                </div>

                {/* ✅ React-Virtualized 적용된 Grid */}
                <div className="goal-list-container">
                    {goals.length > 0 ? (
                        <AutoSizer disableHeight>
                            {({ width }) => {
                                const cardMaxWidth = 200; // ✅ 카드 크기
                                const columnCount = Math.max(1, Math.min(4, Math.floor(width / cardMaxWidth))); // ✅ 최소 1개, 최대 4개 유지
                                const columnWidth = Math.floor(width / columnCount);
                                const rowCount = Math.max(1, Math.ceil(goals.length / columnCount)); // ✅ 최소 1개 이상 유지
                                const rowHeight = 400; // ✅ 카드 높이 일정하게 유지

                                return (
                                    <Grid
                                        key={`${width}-${goals.length}`}  // ✅ key 값 추가하여 리렌더링 시 데이터 유지
                                        width={width}
                                        height={rowCount * rowHeight + 20}
                                        columnWidth={columnWidth}
                                        rowHeight={rowHeight}
                                        rowCount={rowCount}
                                        columnCount={columnCount}
                                        cellRenderer={cellRenderer}
                                        overscanRowCount={3}
                                        style={{ outline: "none" }}
                                    />
                                );
                            }}
                        </AutoSizer>
                    ) : (
                        <p className="text-center">목표 목록이 없습니다.</p>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default GoalList;
