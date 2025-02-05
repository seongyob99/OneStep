// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import "../../styles/upload/calendar.scss";

// // const CalendarNavigator = ({ onDateClick }) => {
// //   const [selectedDate, setSelectedDate] = useState(new Date());
// //   const [certificationData, setCertificationData] = useState([]);
// //   const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// //   // 📌 날짜 변경 함수
// //   const changeDate = (days) => {
// //     setSelectedDate((prevDate) => {
// //       const newDate = new Date(prevDate);
// //       newDate.setDate(newDate.getDate() + days);
// //       return newDate;
// //     });
// //   };

// // //   // 📌 날짜 포맷 변환 함수 (YYYY.MM.DD 형식)
// // //   const formatDate = (date) => {
// // //     return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
// // //   };

// // const formatDate = (date) => {
// //     return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
// //   };
  
  

// //   // 📌 3일 범위 날짜 계산 (어제, 오늘, 내일)
// //   const getDates = () => {
// //     const yesterday = new Date(selectedDate);
// //     yesterday.setDate(selectedDate.getDate() - 1);

// //     const tomorrow = new Date(selectedDate);
// //     tomorrow.setDate(selectedDate.getDate() + 1);

// //     return [yesterday, selectedDate, tomorrow];
// //   };

// //   // 📌 선택된 날짜의 인증 리스트 가져오기 (API 호출)
// //   useEffect(() => {
// //     const fetchCertifications = async () => {
// //       try {
// //         const formattedDate = formatDate(selectedDate);
// //         const response = await axios.get(`/api/certifications?date=${formattedDate}`);
  
// //         console.log("API 응답 데이터:", response.data); // ✅ 데이터 확인
// //         setCertificationData(Array.isArray(response.data) ? response.data : []); // ✅ 응답이 배열인지 체크
// //       } catch (error) {
// //         console.error("데이터 가져오기 실패", error);
// //         setCertificationData([]); // ✅ 오류 발생 시 빈 배열 설정
// //       }
// //     };
// //     fetchCertifications();
// //   }, [selectedDate]);
  

// //   return (
// //     <div className="calendar-navigator">
// //       {/* 오늘 날짜 표시 */}
// //       {/* <h2>오늘 {formatDate(new Date())}</h2> */}
// //       <h2 onClick={() => setSelectedDate(new Date())} style={{ cursor: "pointer", textDecoration: "underline" }}>
// //   오늘 ({formatDate(new Date())})
// // </h2>


// //       {/* 날짜 네비게이션 */}
// //       <div className="date-navigation">
// //         <button onClick={() => changeDate(-1)}>{"<"}</button>
// //         {getDates().map((date, index) => (
// //           <span
// //             key={index}
// //             className={date.toDateString() === selectedDate.toDateString() ? "selected-date" : ""}
// //             onClick={() => setSelectedDate(date)}
// //           >
// //             {formatDate(date)} {["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}
// //           </span>
// //         ))}
// //         <button onClick={() => changeDate(1)}>{">"}</button>
// //       </div>

// //       {/* 인증된 멤버 리스트 */}
// //       <div className="certification-list">
// //         <h3>{formatDate(selectedDate)} 인증 리스트</h3>
// //         {/* {certificationData.length > 0 ? (
// //           <ul>
// //             {certificationData.map((cert, index) => (
// //               <li key={index}>
// //                 <img src={cert.image} alt="인증 이미지" className="cert-image" />
// //                 <p>참여자: {cert.user}</p>
// //               </li>
// //             ))}
// //           </ul>
// //         ) : (
// //           <p>아직 인증된 멤버가 없습니다.</p>
// //         )} */}
// //         {certificationData?.length > 0 ? (
// //   certificationData.map((cert, index) => (
// //     <li key={index}>
// //       <img src={cert.image} alt="인증 이미지" className="cert-image" />
// //       <p>참여자: {cert.user}</p>
// //     </li>
// //   ))
// // ) : (
// //   <p>아직 인증된 멤버가 없습니다.</p>
// // )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default CalendarNavigator;

// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import "../../styles/upload/calendar.scss";

// const SERVER_URL = import.meta.env.VITE_SERVER_URL; // ✅ 환경 변수에서 API 서버 URL 가져오기

// const CalendarNavigator = ({ onDateClick, goalid }) => {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [certificationData, setCertificationData] = useState([]);

//   // 📌 날짜 변경 함수
//   const changeDate = (days) => {
//     setSelectedDate((prevDate) => {
//       const newDate = new Date(prevDate);
//       newDate.setDate(newDate.getDate() + days);
//       return newDate;
//     });
//   };

//   // 📌 날짜 포맷 변환 (YYYY-MM-DD 형식)
//   const formatDate = (date) => {
//     return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//   };

//   // 📌 3일 범위 날짜 계산 (어제, 오늘, 내일)
//   const getDates = () => {
//     const yesterday = new Date(selectedDate);
//     yesterday.setDate(selectedDate.getDate() - 1);

//     const tomorrow = new Date(selectedDate);
//     tomorrow.setDate(selectedDate.getDate() + 1);

//     return [yesterday, selectedDate, tomorrow];
//   };

//   // 📌 선택된 날짜의 인증 리스트 가져오기 (API 호출)
// //   const fetchCertifications = useCallback(async () => {
// //     if (!goalid) return; // ✅ goalid가 없으면 요청 안 함

// //     try {
// //       const formattedDate = formatDate(selectedDate);
// //       const response = await axios.get(
    
// //         `${SERVER_URL}/cert/${goalid}`,  //&date=${formattedDate}
// //         { headers: { "Content-Type": "application/json" } }
// //       );
// //       console.log("API 응답 데이터:", response.data); // ✅ 데이터 확인
// //       setCertificationData(Array.isArray(response.data) ? response.data : []); // ✅ 응답이 배열인지 체크
// //     } catch (error) {
// //       console.error("데이터 가져오기 실패", error);
// //       setCertificationData([]); // ✅ 오류 발생 시 빈 배열 설정
// //     }
// //   }, [goalid, selectedDate]); // ✅ goalid나 selectedDate가 변경될 때만 함수 재생성

// const fetchCertifications = useCallback(async () => {
//     if (!goalid || !SERVER_URL) return;
//     try {
//       console.log("📢 API 요청 URL:", `${SERVER_URL}/cert/${goalid}`);
//       const response = await axios.get(`${SERVER_URL}/cert/${goalid}`);
//       setCertificationData(response.data);
//     } catch (error) {
//       console.error("데이터 가져오기 실패:", error);
//     }
//   }, [goalid, selectedDate, SERVER_URL]);

//   useEffect(() => {
//     fetchCertifications();
//   }, [fetchCertifications]); // ✅ fetchCertifications이 변경될 때만 실행

//   return (
//     <div className="calendar-navigator">
//       {/* 오늘 날짜 표시 (클릭 시 오늘로 변경) */}
//       <h2 onClick={() => setSelectedDate(new Date())} style={{ cursor: "pointer", textDecoration: "underline" }}>
//         오늘 ({formatDate(new Date())})
//       </h2>

//       {/* 날짜 네비게이션 */}
//       <div className="date-navigation">
//         <button onClick={() => changeDate(-1)}>{"<"}</button>
//         {getDates().map((date, index) => (
//           <span
//             key={index}
//             className={date.toDateString() === selectedDate.toDateString() ? "selected-date" : ""}
//             onClick={() => {
//               setSelectedDate(date);
//               if (onDateClick) onDateClick(formatDate(date)); // ✅ 날짜 변경 시 부모로 전달
//             }}
//           >
//             {formatDate(date)} {["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}
//           </span>
//         ))}
//         <button onClick={() => changeDate(1)}>{">"}</button>
//       </div>

//       {/* 인증된 멤버 리스트 */}
//       <div className="certification-list">
//         <h3>{formatDate(selectedDate)} 인증 리스트</h3>
//         {certificationData?.length > 0 ? (
//           <ul>
//             {certificationData.map((cert, index) => (
//               <li key={index}>
//                 <img src={cert.image} alt="인증 이미지" className="cert-image" />
//                 <p>참여자: {cert.user}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>아직 인증된 멤버가 없습니다.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CalendarNavigator;




import React, { useState, useEffect, useCallback } from "react";
import {useParams } from 'react-router-dom';
import axios from "axios";
import "../../styles/upload/calendar.scss";


// ✅ 환경 변수에서 API 서버 URL 가져오기 (없으면 기본값 설정)
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
// const goalid = 1;

const CalendarNavigator = ({ onDateClick}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [certificationData, setCertificationData] = useState([]);
   const goalid = useParams().goalid;
    

  console.log("골아이디",goalid);

  // 📌 날짜 변경 함수
  const changeDate = (days) => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  // 📌 날짜 포맷 변환 (YYYY-MM-DD 형식)
  const formatDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // 📌 3일 범위 날짜 계산 (어제, 오늘, 내일)
  const getDates = () => {
    const yesterday = new Date(selectedDate);
    yesterday.setDate(selectedDate.getDate() - 1);

    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(selectedDate.getDate() + 1);

    return [yesterday, selectedDate, tomorrow];
  };

  // 📌 선택된 날짜의 인증 리스트 가져오기 (API 호출)
  const fetchCertifications = useCallback(async () => {
    console.log("골아이디",goalid);
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
      console.log("goal아이디",goalid);
      console.error("🚨 데이터 가져오기 실패:", error);
      setCertificationData([]);
    }
  }, [goalid, selectedDate]);

  // 📌 컴포넌트가 처음 렌더링될 때와 `goalid` 또는 `selectedDate`가 변경될 때 실행
  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  return (
    <div className="calendar-navigator">
      {/* 오늘 날짜 표시 (클릭 시 오늘로 변경) */}
      <h2 onClick={() => setSelectedDate(new Date())} style={{ cursor: "pointer", textDecoration: "underline" }}>
        오늘 ({formatDate(new Date())})
      </h2>

      {/* 날짜 네비게이션 */}
      <div className="date-navigation">
        <button onClick={() => changeDate(-1)}>{"<"}</button>
        {getDates().map((date, index) => (
          <span
            key={index}
            className={date.toDateString() === selectedDate.toDateString() ? "selected-date" : ""}
            onClick={() => {
              setSelectedDate(date);
              if (onDateClick) onDateClick(formatDate(date)); // ✅ 날짜 변경 시 부모로 전달
            }}
          >
            {formatDate(date)} {["일", "월", "화", "수", "목", "금", "토"][date.getDay()]}
          </span>
        ))}
        <button onClick={() => changeDate(1)}>{">"}</button>
      </div>

      {/* 인증된 멤버 리스트 */}
      <div className="certification-list">
        <h3>{formatDate(selectedDate)} 인증 리스트</h3>
        {certificationData.length > 0 ? (
          <ul>
            {certificationData.map((cert, index) => (
              <li key={index}>
                <img src={cert.image} alt="인증 이미지" className="cert-image" />
                <p>참여자: {cert.user}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 인증된 멤버가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default CalendarNavigator;
