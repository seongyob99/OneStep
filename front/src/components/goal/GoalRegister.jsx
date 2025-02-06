import React, { useCallback, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { produce } from 'immer';
import { Container } from 'react-bootstrap';
import '@styles/goal/goalUpdate.scss';

const GoalRegister = () => {
    const [form, setForm] = useState({
        title: "",
        description: "",
        participants: 1,
        startDate: "",
        endDate: "",
        certCycle: 1,
        rule: "",
        categoryId: "",
        file: null,
    });
    const [cateList, setCateList] = useState([]);
    const [noEndDate, setNoEndDate] = useState(false);
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const fileInputRef = useRef(null);

    useEffect(() => {
        axios.get(`${SERVER_URL}/categories`)
            .then(response => setCateList(response.data))
            .catch(() => alert("카테고리를 불러오는 데 실패했습니다."));
    }, []);

    const onChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setNoEndDate(checked);
            if (checked) {
                setForm(produce((draft) => { draft.endDate = ""; }));
            }
        } else {
            if (name === "participants" || name === "certCycle") {
                if (!/^\d*$/.test(value)) {
                    alert("유효한 숫자를 입력해주세요.");
                    e.target.value = "";
                    return;
                }

                const numericValue = Number(value);

                if (numericValue <= 0) {
                    alert("1 이상의 숫자를 입력해주세요.");
                    e.target.value = "";
                    return;
                }

                if (value.includes(".")) {
                    alert("소수점은 입력할 수 없습니다.");
                    e.target.value = "";
                    return;
                }
            }

            if (name === "startDate") {
                const selectedStartDate = new Date(value);
                selectedStartDate.setHours(0, 0, 0, 0);

                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);

                if (selectedStartDate < tomorrow) {
                    alert("시작일은 내일 이후여야 합니다.");
                    setForm(produce((draft) => { draft.startDate = ""; }));
                    return;
                }
            }

            if (name === "endDate") {
                const selectedEndDate = new Date(value);
                selectedEndDate.setHours(0, 0, 0, 0);

                if (!form.startDate) {
                    alert("시작일을 먼저 입력해주세요.");
                    setForm(produce((draft) => { draft.endDate = ""; }));
                    return;
                }

                const startDate = new Date(form.startDate);
                startDate.setHours(0, 0, 0, 0);

                if (selectedEndDate <= startDate) {
                    alert("종료일은 시작일 이후여야 합니다.");
                    setForm(produce((draft) => { draft.endDate = ""; }));
                    return;
                }
            }

            setForm(produce((draft) => { draft[name] = value; }));
        }
    }, [form]);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, file }));
        }
    };

    // 🔹 파일 업로드 취소 함수
    const handleFileCancel = () => {
        setForm(prev => ({ ...prev, file: null }));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRegister = async () => {
        if (!form.categoryId || !form.title.trim() || !form.description.trim()
            || !form.startDate || !form.certCycle || !form.rule.trim()) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
        if (!noEndDate && !form.endDate) {
            alert("종료일을 입력해주세요.");
            return;
        }
        if (!form.file) {
            alert("썸네일은 필수입니다.");
            return;
        }

        if (form.endDate && form.startDate) {
            const startDate = new Date(form.startDate);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(form.endDate);
            endDate.setHours(0, 0, 0, 0);

            if (isNaN(startDate) || isNaN(endDate)) {
                alert("날짜를 올바르게 입력해주세요.");
                return;
            }

            const dateDiff = Math.floor((endDate - startDate) / (1000 * 3600 * 24));
            const certCycleNum = Number(form.certCycle);

            if (isNaN(certCycleNum) || certCycleNum <= 0) {
                alert("인증 주기는 1 이상의 숫자여야 합니다.");
                return;
            }

            if (certCycleNum > dateDiff) {
                alert(`인증 주기는 시작일과 종료일 사이 최대 일수를 초과할 수 없습니다.`);
                return;
            }
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("participants", form.participants);
        formData.append("startDate", form.startDate);
        formData.append("endDate", noEndDate ? "" : form.endDate);
        formData.append("certCycle", form.certCycle);
        formData.append("rule", form.rule);
        formData.append("categoryId", Number(form.categoryId));
        formData.append("memberId", "user01");

        if (form.file) {
            formData.append("file", form.file);
        }

        try {
            await axios.post(`${SERVER_URL}/goals/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("목표 등록 완료!");
            navigate("/");
        } catch (error) {
            alert("목표 등록에 실패했습니다.");
        }
    };


    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center my-4">
                <h3>목표 등록</h3>
                <button type="button" onClick={handleRegister} className="btn btn-primary mb-3">등록하기</button>
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
                            <option value="">...</option>
                            {cateList.map(category => (
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
                </div>
            </form>
        </Container>
    );
};

export default GoalRegister;