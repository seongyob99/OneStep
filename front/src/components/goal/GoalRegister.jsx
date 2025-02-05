import React, { useCallback, useState, useEffect } from "react";
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
        file: null
    });
    const [cateList, setCateList] = useState([]);
    const [noEndDate, setNoEndDate] = useState(false);
    const navigate = useNavigate();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    // 카테고리 목록 불러오기
    useEffect(() => {
        axios.get(`${SERVER_URL}/categories`)
            .then(response => setCateList(response.data))
            .catch(() => alert("카테고리를 불러오는 데 실패했습니다."));
    }, []);

    // 입력값 변경 핸들러
    const onChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setNoEndDate(checked);
            if (checked) {
                setForm(
                    produce((draft) => {
                        draft.endDate = "";
                    })
                );
            }
        } else {
            if (name === "participants" || name === "certCycle") {
                if (!/^\d*$/.test(value)) {
                    alert("🚨 유효한 숫자를 입력해주세요.");
                    e.target.value = "";
                    return;
                }

                const numericValue = Number(value);

                if (numericValue <= 0) {
                    alert("🚨 1 이상의 숫자를 입력해주세요.");
                    e.target.value = "";
                    return;
                }

                if (value.includes(".")) {
                    alert("🚨 소수점은 입력할 수 없습니다.");
                    e.target.value = "";
                    return;
                }

                setForm(
                    produce((draft) => {
                        draft[name] = numericValue;
                    })
                );
            } else {
                setForm(
                    produce((draft) => {
                        draft[name] = value;
                    })
                );
            }
        }
    }, []);

    // 파일 업로드 핸들러
    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, file }));
        }
    };

    // 목표 등록 요청
    const handleRegister = async () => {
        if (!form.categoryId || !form.title.trim() || !form.description.trim()
            || !form.startDate || !form.certCycle || !form.rule.trim()) {
            alert("🚨 모든 필드를 입력해주세요.");
            return;
        }
        if (!noEndDate && !form.endDate) {
            alert("🚨 종료일을 입력해주세요.");
            return;
        }
        if (!form.file) {
            alert("🚨 썸네일은 필수입니다.");
            return;
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
        formData.append("memberId", "user01"); // 로그인 유저

        if (form.file) {
            formData.append("file", form.file);
        }

        try {
            await axios.post(`${SERVER_URL}/goals/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("✅ 목표 등록 완료!");
            navigate("/");
        } catch (error) {
            alert("❌ 목표 등록에 실패했습니다.");
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
                    <div className="flex-1 ml-4">
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
                    <div className="flex-2 ml-4">
                        <label className="form-label">시작일</label>
                        <input
                            type="date"
                            name="startDate"
                            className="form-control"
                            value={form.startDate}
                            onChange={onChange}
                        />
                    </div>
                    <div className="flex-2 ml-4">
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
                        onChange={onFileChange}
                    />
                </div>
                <div className="text-right">
                    <button type="button" onClick={handleRegister} className="btn btn-primary mb-3">등록하기</button>
                </div>
            </form>
        </Container>
    );
};

export default GoalRegister;