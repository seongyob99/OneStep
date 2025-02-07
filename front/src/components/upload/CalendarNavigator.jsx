import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CertModal from "./CertModal";
import "@styles/upload/calendar.scss";

//환경 변수에서 API 서버 URL 가져오기
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const CalendarNavigator = ({ onDateClick }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [certificationData, setCertificationData] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [showMonthSelect, setShowMonthSelect] = useState(false);

  //모달
  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태 추가
  const [selectedImage, setSelectedImage] = useState(""); // ✅ 선택된 이미지
  const [selectedUser, setSelectedUser] = useState(""); // ✅ 선택된 사용자
  const [selectedFilePath, setSelectedFilePath] = useState(""); // ✅ 선택된 파일 경로

  const goalid = useParams().goalid;
  const selectedDayRef = useRef(null);


  // 날짜 포맷 (yy-mm-dd)
  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

    // 날짜 포맷 (mm.dd)
    const formatday = (date) => {
      return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    };

  // 현재 선택된 달의 모든 날짜(1일부터 말일까지)를 배열로 반환하는 함수
  const getDaysInMonth = (year, month) => {
    const lastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  };

  const handleMonthClick = () => {
    setShowMonthSelect(!showMonthSelect);
  };

  const handleMonthSelect = (month) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(month - 1);
    setSelectedMonth(month);
    setSelectedDate(newDate);
    setShowMonthSelect(false);
  };

  const changeDate = (days) => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);

      setSelectedMonth(newDate.getMonth() + 1);

      return newDate;
    });
  };
  // 날짜 변경 함수
  const getDates = () => {

    const dates = [];
    for (let offset = -2; offset <= 2; offset++) {
      const newDate = new Date(selectedDate);
      newDate.setDate(selectedDate.getDate() + offset);
      dates.push(newDate);
    }
    return dates;
  };
  // 선택된 날짜의 인증 리스트 가져오기 (API 호출)
  const fetchCertifications = useCallback(async () => {
    if (!goalid) {
      console.warn("🚨 goalid가 없습니다. API 요청을 실행하지 않습니다.");
      return;
    }

    try {
      const formattedDate = formatDate(selectedDate);
      const apiUrl = `${SERVER_URL}/cert?goalId=${goalid}&date=${formattedDate}`;

      console.log("📢 API 요청 URL:", apiUrl);

      const response = await axios.get(apiUrl, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("📢 API 응답 데이터:", response.data);
      setCertificationData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("🚨 데이터 가져오기 실패:", error);
      setCertificationData([]);
    }
  }, [goalid, selectedDate]);

  // // 컴포넌트가 처음 렌더링될 때 실행
  // useEffect(() => {
  //   fetchCertifications();
  // }, [fetchCertifications]); //selectedDate가 변경될 때 실행



  const showImageModal = (imageUrl, user, filePath) => {
    setSelectedImage(imageUrl);
    setSelectedUser(user || "알 수 없음");
    setSelectedFilePath(filePath);
    setShowModal(true);
  };

  useEffect(() => {
    fetchCertifications();
    if (selectedDayRef.current) {
      selectedDayRef.current.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [fetchCertifications, selectedDate]); 

  return (
    <div className="calendar-navigator">
      {/* ----------------------------------------------- */}
      {/* 월 선택 */}
      <div className="month-selector">
        <h2 onClick={handleMonthClick} style={{ cursor: "pointer" }}>
          {selectedMonth}월
        </h2>

        {showMonthSelect && (
          <div className="month-dropdown">
            <div className="month-grid">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <div key={month} onClick={() => handleMonthSelect(month)} className="month-option">
                  {month}월
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* ----------------------------------------------- */}

<div className="month-calendar">
      {getDaysInMonth(selectedDate.getFullYear(), selectedMonth).map((day) => (
        <span 
          key={day}
          ref={selectedDate.getDate() === day ? selectedDayRef : null} // ✅ 선택된 날짜에만 ref 적용
          className={selectedDate.getDate() === day ? "day selected-day" : "day"}
          onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedMonth - 1, day))}
        >
          {day}
        </span>
        ))}
      </div>
      {/* ----------------------------------------------- */}
      {/* 날짜 네비게이션 */}
      <div className="date-navigation">
        <button onClick={() => changeDate(-1)}>{"<"}</button>
        {getDates().map((date, index) => (
          <span
            key={index}
            className={date.toDateString() === selectedDate.toDateString() ? "selected-date" : "navday"}
            onClick={() => {
              setSelectedDate(date);
              setSelectedMonth(date.getMonth() + 1); // ✅ 월도 같이 변경
              if (onDateClick) onDateClick(formatDate(date));
            }}
          >
            {formatday(date)} {["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}
          </span>
        ))}
        <button onClick={() => changeDate(1)}>{">"}</button>
      </div>
      {/* ----------------------------------------------- */}
      {/* 인증된 멤버 리스트 */}
      <div className="certification-list">
        <h3>{formatDate(selectedDate)} 인증 리스트</h3>
        {certificationData.length > 0 ? (
          <ul>
            {certificationData.map((cert, index) => (
              <li key={index}>
                <img
                  src={`${SERVER_URL}/uploads/${cert.filePath}`}
                  alt="인증 이미지"
                  className="cert-image"
                  style={{ cursor: "pointer" }}
                  onClick={() => showImageModal(`${SERVER_URL}/uploads/${cert.filePath}`, cert.user, cert.filePath)}
                />
                <p>참여자: {cert.user}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 인증한 멤버가 없습니다.</p>
        )}
      </div>

      {/* ✅ CertModal 연결 */}
      {showModal && (
        <CertModal
          show={showModal}
          onClose={() => setShowModal(false)}
          imageUrl={selectedImage}
          user={selectedUser}
          filePath={selectedFilePath}
          goalid={goalid}
          selectedDate={formatDate(selectedDate)}
          onRefresh={fetchCertifications}
        />
      )}
    </div>
  );
};

export default CalendarNavigator;
