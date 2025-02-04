import React, { useCallback, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { produce } from 'immer';
import { Container } from 'react-bootstrap';

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

    // 📌 카테고리 목록 불러오기
    useEffect(() => {
        axios.get(`${SERVER_URL}/categories`)
            .then(response => setCateList(response.data))
            .catch(() => alert("카테고리를 불러오는 데 실패했습니다."));
    }, []);

    // 📌 입력값 변경 핸들러 (Validation 추가)
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
            // 🚨 참가 인원 & 인증 주기 필드
            if (name === "participants" || name === "certCycle") {
                // 🚨 숫자가 아닌 값 입력 시 경고 & 즉시 초기화
                if (!/^\d*$/.test(value)) {
                    alert("🚨 유효한 숫자를 입력해주세요.");
                    e.target.value = ""; // 입력창 즉시 초기화
                    return;
                }

                const numericValue = Number(value);

                // 🚨 0 이하 입력 방지
                if (numericValue <= 0) {
                    alert("🚨 1 이상의 숫자를 입력해주세요.");
                    e.target.value = ""; // 입력창 즉시 초기화
                    return;
                }

                // 🚨 소수점 입력 방지
                if (value.includes(".")) {
                    alert("🚨 소수점은 입력할 수 없습니다.");
                    e.target.value = ""; // 입력창 즉시 초기화
                    return;
                }

                setForm(
                    produce((draft) => {
                        draft[name] = numericValue; // 정상 입력만 반영
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


    // 📌 종료일 없음 체크박스 핸들러
    const toggleNoEndDate = () => {
        setNoEndDate(!noEndDate);
        setForm(prev => ({ ...prev, endDate: noEndDate ? "" : null }));
    };

    // 📌 파일 업로드 핸들러 (썸네일 미리보기 포함)
    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(prev => ({ ...prev, file }));
        }
    };

    // 📌 목표 등록 요청 (Validation 추가)
    const handleRegister = async () => {
        console.log("📌 현재 입력 데이터:", form);
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
            <div className="container mt-4">
                <h1 className="text-2xl font-bold mb-4">목표 등록</h1>
                <hr />
                <form>
                    {/* ✅ 카테고리 선택 */}
                    <div className="mb-4">
                        <label className="form-label">카테고리</label>
                        <select name="categoryId" className="form-control" value={form.categoryId} onChange={onChange}>
                            <option value="">카테고리를 선택하세요</option>
                            {cateList.map(category => (
                                <option key={category.categoryId} value={category.categoryId}>{category.cateName}</option>
                            ))}
                        </select>
                    </div>

                    {/* ✅ 제목, 설명 */}
                    <div className="mb-4">
                        <label className="form-label">목표 제목</label>
                        <input type="text" name="title" className="form-control" value={form.title} onChange={onChange} />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">목표 설명</label>
                        <textarea name="description" className="form-control" value={form.description} onChange={onChange} />
                    </div>

                    {/* ✅ 참가 인원 */}
                    <div className="mb-4">
                        <label className="form-label">참가 인원</label>
                        <input type="number" name="participants" className="form-control" value={form.participants} onChange={onChange} />
                    </div>

                    {/* ✅ 시작일 & 종료일 */}
                    <div className="mb-4">
                        <label className="form-label">시작일</label>
                        <input type="date" name="startDate" className="form-control" value={form.startDate} onChange={onChange} />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">종료일</label>
                        <input type="date" name="endDate" className="form-control" value={form.endDate} onChange={onChange} disabled={noEndDate} />
                        <input type="checkbox" checked={noEndDate} onChange={toggleNoEndDate} /> 종료일 없음
                    </div>

                    {/* ✅ 인증 주기 추가 */}
                    <div className="mb-4">
                        <label className="form-label">인증 주기</label>
                        <input type="number" name="certCycle" className="form-control" value={form.certCycle} onChange={onChange} />
                    </div>

                    {/* ✅ 인증 규칙 */}
                    <div className="mb-4">
                        <label className="form-label">인증 규칙</label>
                        <input type="text" name="rule" className="form-control" value={form.rule} onChange={onChange} />
                    </div>

                    {/* ✅ 썸네일 업로드 */}
                    <div className="mb-4">
                        <label className="form-label">썸네일</label>
                        <input type="file" name="file" className="form-control" onChange={onFileChange} />
                    </div>

                    <button type="button" className="btn btn-primary" onClick={handleRegister}>등록</button>
                </form>
            </div>
        </Container>
    );
};

export default GoalRegister;
