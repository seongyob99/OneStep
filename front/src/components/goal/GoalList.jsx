import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AutoSizer, Grid } from "react-virtualized";
import GoalCard from "./GoalCard";
import "@styles/goal/goalList.scss";
import { Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const GoalList = () => {
    // AuthContext에서 authState 가져오기
    const { authState } = useAuth();

    const [searchTerm, setSearchTerm] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [goals, setGoals] = useState([]);
    const [columnCount, setColumnCount] = useState(4); // ✅ columnCount 상태 저장
    const gridRef = useRef(null); // ✅ Grid 리렌더링 강제 업데이트용 ref
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
            .then(response => setGoals(response.data))
            .catch(error => console.error("목표 리스트 불러오는 중 오류 발생:", error));
    }, [selectedCategory, searchKeyword]);

    const handleSearch = () => {
        setSearchKeyword(searchTerm);
    };

    // ✅ 화면 크기 변경될 때 `columnCount` 유지하도록 설정
    const updateColumnCount = useCallback((width) => {
        const cardMaxWidth = 200;
        const newColumnCount = Math.max(1, Math.min(4, Math.floor(width / cardMaxWidth)));

        if (newColumnCount !== columnCount) {
            setColumnCount(newColumnCount);
            if (gridRef.current) {
                gridRef.current.forceUpdateGrid(); // ✅ 강제 리렌더링
            }
        }
    }, [columnCount]);

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
                    {authState.isAuthenticated &&
                        <button className="btn btn-primary" onClick={() => navigate("/goals/register")}>
                            목표 등록
                        </button>
                    }
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
                                updateColumnCount(width); // ✅ 화면 크기 변경될 때 columnCount 업데이트

                                const columnWidth = Math.floor(width / columnCount);
                                const rowCount = Math.ceil(goals.length / columnCount); // ✅ 정확한 rowCount 계산
                                const rowHeight = 400;

                                return (
                                    <Grid
                                        ref={gridRef} // ✅ Grid 리렌더링 시 강제 업데이트 가능하도록 참조 저장
                                        key={width}  // ✅ `width` 변경될 때마다 강제 리렌더링
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
