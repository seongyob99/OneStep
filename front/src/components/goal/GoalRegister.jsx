import React, { useCallback, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { produce } from 'immer';
import { Container } from 'react-bootstrap';
import '@styles/goal/goalUpdate.scss';
import { useAuth } from '../context/AuthContext';



const GoalRegister = () => {
    // AuthContext에서 authState 가져오기
    const { authState } = useAuth();
    // username 가져오기
    const username = authState.user?.username;

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
                    return;
                }
                setForm(produce((draft) => { draft[name] = value; }));
                return;
            }

            setForm(produce((draft) => { draft[name] = value; }));
        }
    }, [noEndDate]);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, file }));
        }
    };

    const handleFileCancel = () => {
        setForm(prev => ({ ...prev, file: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRegister = async () => {
        // 필수 필드 검증
        if (!form.categoryId || !form.title.trim() || !form.description.trim()
            || !form.startDate || !form.certCycle || !form.rule.trim()) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        // 정원 검증
        const participants = Number(form.participants);
        if (isNaN(participants) || participants < 1) {
            alert("정원은 1 이상의 숫자를 입력해주세요.");
            return;
        }

        // 인증 주기 검증
        const certCycle = Number(form.certCycle);
        if (isNaN(certCycle) || certCycle < 1) {
            alert("인증 주기는 1 이상의 숫자를 입력해주세요.");
            return;
        }

        // 시작일 검증
        const startDate = new Date(form.startDate);
        if (isNaN(startDate.getTime())) {
            alert("유효한 시작일을 입력해주세요.");
            return;
        }
        startDate.setHours(0, 0, 0, 0);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        if (startDate < tomorrow) {
            alert("시작일은 내일 이후여야 합니다.");
            return;
        }

        // 종료일 검증
        if (!noEndDate) {
            if (!form.endDate) {
                alert("종료일을 입력해주세요.");
                return;
            }

            const endDate = new Date(form.endDate);
            if (isNaN(endDate.getTime())) {
                alert("유효한 종료일을 입력해주세요.");
                return;
            }
            endDate.setHours(0, 0, 0, 0);

            if (endDate <= startDate) {
                alert("종료일은 시작일 이후여야 합니다.");
                return;
            }

            // 인증 주기 일수 검증
            const dateDiff = Math.floor((endDate - startDate) / (1000 * 3600 * 24));
            if (certCycle > dateDiff) {
                alert(`인증 주기는 시작일과 종료일 사이 최대 일수(${dateDiff}일)를 초과할 수 없습니다.`);
                return;
            }
        }

        // 파일 검증
        if (!form.file) {
            alert("썸네일은 필수입니다.");
            return;
        }

        // 폼 데이터 생성
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("participants", participants);
        formData.append("startDate", form.startDate);
        formData.append("endDate", noEndDate ? "" : form.endDate);
        formData.append("certCycle", certCycle);
        formData.append("rule", form.rule);
        formData.append("categoryId", Number(form.categoryId));
        formData.append("memberId", username);
        formData.append("file", form.file);

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