import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CalendarNavigator from "./CalendarNavigator";
import CertUpload from "./CertUpload";
// import CertDetail from "./CertDetail";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CertBoard = () => {
  const { goalId } = useParams(); // ✅ URL에서 goalId 가져오기
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowDetail(true);
  };

  
  return (
    <Container>
      <h1>인증 게시판</h1> 
      <CertUpload goalId={goalId} />
      <CalendarNavigator goalId={goalId} onDateClick={handleDateClick} />
      {/* <CertDetail show={showDetail} handleClose={() => setShowDetail(false)} date={selectedDate} goalId={goalId} /> */}
    </Container>
  );
};

export default CertBoard;
