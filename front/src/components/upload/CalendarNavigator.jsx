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
  const [selectedCertOwnerId, setSelectedCertOwnerId] = useState(null);
  const [isEditingYear, setIsEditingYear] = useState(false);
  const [inputYear, setInputYear] = useState(selectedDate.getFullYear());

  //모달
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedFilePath, setSelectedFilePath] = useState("");

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


  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (year, month) => {
    // 각 월의 기본 일 수 (윤년 고려 X)
    const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return Array.from({ length: daysInMonth[month - 1] }, (_, i) => i + 1);
  };

  // 년도 입력 활성화
  const startEditingYear = () => {
    setInputYear(selectedDate.getFullYear());
    setIsEditingYear(true);
  };

  // 년도 변경 처리
  const handleYearChange = () => {
    if (inputYear && !isNaN(inputYear)) {
      setSelectedDate(new Date(parseInt(inputYear, 10), selectedDate.getMonth()));
    }
    setIsEditingYear(false);
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
      const apiUrl = `${SERVER_URL}/cert/${goalid}`;
      const response = await axios.get(apiUrl, {
        headers: { "Content-Type": "application/json" },
      });
      setCertificationData(Array.isArray(response.data) ? response.data : []);

    } catch (error) {
      console.error("🚨 데이터 가져오기 실패:", error);
      setCertificationData([]);
    }
  }, [goalid, selectedDate]);
  const groupedCertifications = certificationData.reduce((acc, member) => {
    if (Array.isArray(member.certdto)) {
      member.certdto.forEach((cert) => {
        if (cert.certDate) {
          const dateKey = cert.certDate;
          if (!acc[dateKey]) {
            acc[dateKey] = [];
          }
          acc[dateKey].push({
            memberName: member.name,
            memberId: member.memberId,
            filePath: cert.filePath,
          });
        }
      });
    }
    return acc;
  }, {});


  // adminMemberId
  const adminMemberId = certificationData && certificationData.length > 0
    ? certificationData[0].adminMemberId
    : null;

  const showImageModal = (imageUrl, user, filePath, certOwnerId) => {
    setSelectedImage(imageUrl);
    setSelectedUser(user || "알 수 없음");
    setSelectedFilePath(filePath);
    setShowModal(true);
    setSelectedCertOwnerId(certOwnerId);
  };

  useEffect(() => {
    fetchCertifications();
    if (selectedDayRef.current) {
      selectedDayRef.current.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [fetchCertifications, selectedDate]);

  // 선택된 날짜에 해당하는 인증 정보만 추출
  const selectedDateKey = formatDate(selectedDate);
  const certificationsForSelectedDate = groupedCertifications[selectedDateKey] || [];


  return (
    <div className="calendar-navigator">
      <div className="month-selector">
        <h2 onClick={handleMonthClick} style={{ cursor: "pointer" }}>
          {selectedDate.getFullYear()}년 {selectedMonth}월
        </h2>

        {showMonthSelect && (
          <div className="month-dropdown">
            {/* 년도 선택 */}
            <div className="year-selector">
              <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear() - 1, selectedDate.getMonth()))}>
                {'<'}
              </button>
              {/* 클릭하면 입력 가능 */}
              {isEditingYear ? (
                <input
                  type="number"
                  className="year-input"
                  value={inputYear}
                  onChange={(e) => setInputYear(e.target.value)}
                  onBlur={handleYearChange}
                  onKeyDown={(e) => e.key === "Enter" && handleYearChange()}
                  autoFocus
                />
              ) : (
                <span onClick={() => startEditingYear()} style={{ cursor: "pointer" }}>
                  {selectedDate.getFullYear()}년
                </span>
              )}
              <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth()))}>
                {'>'}
              </button>
            </div>

            {/* 월 선택 */}
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
      <div className="month-calendar">
        {getDaysInMonth(selectedDate.getFullYear(), selectedMonth).map((day) => (
          <span
            key={day}
            ref={selectedDate.getDate() === day ? selectedDayRef : null}
            className={selectedDate.getDate() === day ? "day selected-day" : "day"}
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedMonth - 1, day))}
          >
            {day}
          </span>
        ))}
      </div>
      {/* 날짜 네비게이션 */}
      <div className="date-navigation">
        <button onClick={() => changeDate(-1)}>{"<"}</button>
        {getDates().map((date, index) => (
          <span
            key={index}
            className={date.toDateString() === selectedDate.toDateString() ? "selected-date" : "navday"}
            onClick={() => {
              setSelectedDate(date);
              setSelectedMonth(date.getMonth() + 1);
              if (onDateClick) onDateClick(formatDate(date));
            }}
          >
            {formatday(date)} {["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}
          </span>
        ))}
        <button onClick={() => changeDate(1)}>{">"}</button>
      </div>
      {/* 인증한 멤버 리스트 */}
      <div className="certification-list">
        <h3>{formatday(selectedDate)} 인증 리스트</h3>
        {certificationsForSelectedDate.length > 0 ? (
          <ul>
            {certificationsForSelectedDate.map((cert, index) => (
              <li key={index}>
                <p>&nbsp;&nbsp;&nbsp;{cert.memberName} ({cert.memberId})</p>
                <img
                  src={`${SERVER_URL}/uploads/${cert.filePath}`}
                  alt="인증 이미지"
                  className="cert-image"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    showImageModal(
                      `${SERVER_URL}/uploads/${cert.filePath}`,
                      cert.memberName,
                      cert.filePath,
                      cert.memberId
                    )
                  }
                />
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 인증한 멤버가 없습니다.</p>
        )}
      </div>

      {/* CertModal 연결 */}
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
          adminMemberId={adminMemberId}
          certOwnerId={selectedCertOwnerId}
        />
      )}
    </div>
  );
};

export default CalendarNavigator;