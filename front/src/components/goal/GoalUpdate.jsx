import React, { useCallback, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { produce } from 'immer';
import { Container } from 'react-bootstrap';
import '@styles/goal/goalUpdate.scss';

const GoalUpdate = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const goalid = useParams().goalid;
    const fileInputRef = useRef(null);

    const [cateList, setCateList] = useState([]);
    const [noEndDate, setNoEndDate] = useState(false);
    const [memberCnt, setMemberCnt] = useState(0);
    const [currentImg, setCurrentImg] = useState('');
    const [form, setForm] = useState({
        goalId: goalid,
        categoryId: '',
        title: '',
        description: '',
        participants: 1,
        startDate: '',
        endDate: '',
        certCycle: 1,
        rule: '',
        thumbnail: '',
        file: null
    });

    // 카테고리 조회
    const getCate = useCallback(async () => {
        try {
            const response = await axios.get(
                `${SERVER_URL}/categories`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setCateList(response.data);
        } catch (err) {
            alert("카테고리를 가져오는데 실패했습니다.");
        }
    }, []);

    // 정보 조회
    const getGoalInfo = useCallback(async () => {
        try {
            const response = await axios.post(
                `${SERVER_URL}/goals/dtl/${goalid}`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setForm(response.data);
            setMemberCnt(response.data.members.length);
            setCurrentImg(response.data.thumbnail);
            setNoEndDate(!response.data.endDate);
        } catch (err) {
            alert("상세정보를 가져오지 못했습니다.");
        }
    }, []);

    useEffect(() => {
        getCate();
        getGoalInfo();
    }, []);

    // onChange
    const onChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setNoEndDate(checked);
            if (checked) {
                setForm(
                    produce((draft) => {
                        draft.endDate = '';
                    })
                )
            }
        } else {
            setForm(
                produce((draft) => {
                    if (name === 'participants' || name === 'certCycle') {
                        const numericValue = Number(value);
                        if (value !== '') {
                            if (isNaN(numericValue) || numericValue === 0) {
                                alert("유효한 숫자를 입력해주세요.");
                                return;
                            }
                            if (value.includes('.')) {
                                alert("소수점은 입력할 수 없습니다.");
                                return;
                            }
                        }
                        draft[name] = value;

                    } else if (name === 'startDate') {
                        const selectedStartDate = new Date(value);
                        selectedStartDate.setHours(0, 0, 0, 0);

                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(0, 0, 0, 0);

                        if (selectedStartDate < tomorrow) {
                            alert("시작일은 내일 이후여야 합니다.");
                            return;
                        }

                        const startDate = new Date(value);
                        startDate.setHours(0, 0, 0, 0);
                        const endDate = new Date(form.endDate);
                        endDate.setHours(0, 0, 0, 0);

                        if (endDate <= startDate) {
                            alert("시작일은 종료일 이전이여야 합니다.");
                            return;
                        }

                        draft[name] = value;

                    } else if (name === 'endDate') {
                        if (!form.startDate) {
                            alert("시작일을 먼저 입력해주세요.");
                            return;
                        }

                        const startDate = new Date(form.startDate);
                        startDate.setHours(0, 0, 0, 0);
                        const endDate = new Date(value);
                        endDate.setHours(0, 0, 0, 0);

                        if (endDate <= startDate) {
                            alert("종료일은 시작일 이후여야 합니다.");
                            return;
                        }

                        draft[name] = value;

                    } else {
                        draft[name] = value;
                    }
                })
            );
        }
    }, [form, memberCnt]);

    // onFileChange
    const onFileChange = useCallback((e) => {
        setForm(
            produce((draft) => {
                draft.file = e.target.files[0];
            })
        );
    }, []);

    // 파일 업로드 취소
    const handleFileCancel = () => {
        setForm(prev => ({ ...prev, file: null }));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // 썸네일 제거 시 처리
    const removeThumbnail = () => {
        setForm(
            produce((draft) => {
                draft.thumbnail = '';
            })
        );
    };

    // 수정
    const handleUpdate = useCallback(async (e) => {
        e.preventDefault();

        if (!form.categoryId || !form.title.trim() || !form.description.trim()
            || !form.startDate || !form.certCycle || !form.rule.trim()) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
        if (form.participants < memberCnt) {
            alert("현재 참가 인원이 정원보다 많을 수 없습니다.");
            return;
        }
        if (!noEndDate && !form.endDate) {
            alert("종료일을 입력해주세요.");
            return;
        }
        if (form.endDate) {
            const dateDiff = Math.floor((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 3600 * 24)); // 날짜 차이
            if (form.certCycle > dateDiff) {
                alert(`인증 주기는 시작일과 종료일 사이 최대 일수를 초과할 수 없습니다.`);
                return;
            }
        }
        if (!form.thumbnail && !form.file) {
            alert("썸네일은 필수입니다.");
            return;
        }

        const formData = new FormData();
        formData.append("goalId", Number(form.goalId));
        formData.append("categoryId", Number(form.categoryId));
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("participants", form.participants);
        formData.append("startDate", form.startDate);
        formData.append("endDate", noEndDate ? '' : form.endDate);
        formData.append("certCycle", form.certCycle);
        formData.append("rule", form.rule);
        formData.append("thumbnail", currentImg);
        formData.append("memberId", "user05");  // 로그인 유저

        if (form.file) {
            formData.append("file", form.file);
        }

        try {
            const response = await axios.put(
                `${SERVER_URL}/goals/dtl/updateGoal`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            navigate(`/${goalid}`);
        } catch (err) {
            alert("수정에 실패했습니다. 다시 시도해주세요.");
        }
    }, [form, noEndDate]);

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center my-4">
                <h3>목표 수정</h3>
                <button type="button" onClick={handleUpdate} className="btn btn-primary mb-3">저장하기</button>
            </div>
            <form>
                <div className="mb-4 flex">
                    <div className="flex-1">
                        <label className="form-label">카테고리</label>
                        <select
                            name="categoryId"
                            className="form-control"
                            value={form.categoryId}
                            onChange={onChange}
                        >
                            {cateList.map((category) => (
                                <option key={category.categoryId} value={category.categoryId}>
                                    {category.cateName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-9 ml-4">
                        <label className="form-label">제목</label>
                        <input
                            type="text"
                            name="title"
                            className="form-control"
                            value={form.title}
                            onChange={onChange}
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="form-label">설명</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={form.description}
                        onChange={onChange}
                    />
                </div>
                <div className="mb-4 flex">
                    <div className="flex-1">
                        <label className="form-label">정원</label>
                        <span className="small-font">(현재 {memberCnt}명)</span>

                        <div className="flex">
                            <input
                                type="text"
                                name="participants"
                                className="form-control no-spin"
                                value={form.participants}
                                onChange={onChange}
                            />
                            <span>명</span>
                        </div>
                    </div>
                    <div className="flex-1 ml-8">
                        <label className="form-label">시작일</label>
                        <input
                            type="date"
                            name="startDate"
                            className="form-control"
                            value={form.startDate}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex-1 ml-4">
                        <label className="form-label">종료일</label>
                        <input
                            type="date"
                            name="endDate"
                            className="form-control"
                            value={form.endDate ? form.endDate : ''}
                            onChange={onChange}
                            disabled={noEndDate}
                        />
                    </div>
                    <div className="ml-2 flex checkbox">
                        <input
                            type="checkbox"
                            name="noEndDate"
                            checked={noEndDate}
                            onChange={onChange}
                        />
                        <label>종료일 없음</label>
                    </div>
                    <div className="flex-1 ml-8">
                        <label className="form-label">인증 주기</label>
                        <div className="flex">
                            <input
                                type="text"
                                name="certCycle"
                                className="form-control no-spin"
                                value={form.certCycle}
                                onChange={onChange}
                            />
                            <span>일</span>
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="form-label">인증 규칙</label>
                    <textarea
                        name="rule"
                        className="form-control"
                        value={form.rule}
                        onChange={onChange}
                    />
                </div>
                <div className="thumbnail-input mb-4">
                    <label className="form-label">썸네일</label>
                    <span className="small-font ml-2" style={{ color: "#fc4c24" }}>* 이미지는 1:1 비율로 넣어주세요 (권장)</span>
                    {form.thumbnail ? (
                        <div className="thumbnail-preview mb-2">
                            <img
                                src={`${SERVER_URL}/uploads/${form.thumbnail}`}
                                alt="썸네일"
                                className="thumbnail-img"
                            />
                            <button
                                type="button"
                                onClick={removeThumbnail}
                                className="remove-btn"
                            >
                                X
                            </button>
                        </div>
                    ) : (
                        <>
                            <input
                                type="file"
                                name="file"
                                className="form-control"
                                ref={fileInputRef}
                                onChange={onFileChange}
                            />
                            {form.file && (
                                <div className="mt-2 d-flex">
                                    <p>
                                        {form.file.name}
                                        <button type="button" className="btn btn-danger ml-2" onClick={handleFileCancel}>
                                            취소
                                        </button>
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </form>
        </Container>
    );
};

export default GoalUpdate;
