import React, { useState } from "react";
import { useParams } from "react-router-dom";
import CalendarNavigator from "./CalendarNavigator";
import CertUpload from "./CertUpload";
import { Container } from "react-bootstrap";

const CertBoard = () => {
  const { goalId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowDetail(true);
  };

  return (
    <Container>
      <CertUpload goalId={goalId} />
      <CalendarNavigator goalId={goalId} onDateClick={handleDateClick} />
    </Container>
  );
};

export default CertBoard;
