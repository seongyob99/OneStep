import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CalendarNavigator from "./CalendarNavigator";
import CertUpload from "./CertUpload";
import { Container } from "react-bootstrap";
import { useAuth } from '../context/AuthContext';


const CertBoard = () => {
  const { goalId } = useParams(); // ✅ URL에서 goalId 가져오기
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // AuthContext에서 authState 가져오기
  const { authState } = useAuth();
  // username 가져오기
  const username = authState.user?.username;
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (authState === undefined || authState === null) {
      return;
    }
    setIsAuthLoaded(true);
    setLoading(false);
  }, [authState]);

  useEffect(() => {
    if (isAuthLoaded && !authState.isAuthenticated) {
      navigate("/member/login", { replace: true });
    }
  }, [isAuthLoaded, authState.isAuthenticated, navigate]);

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
