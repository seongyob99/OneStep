import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, ListGroup, Tabs, Tab, Spinner, Button } from "react-bootstrap";
import '@styles/member/MyPage.scss';

const MyPage = () => {
  const [member, setMember] = useState({});
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("ongoing");

  const [ongoingPage, setOngoingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [PAGE_SIZE] = useState(7);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const memberId = "user03";
        const [memberResponse, goalsResponse] = await Promise.all([
          axios.get(`${SERVER_URL}/api/member/${memberId}`),
          axios.get(`${SERVER_URL}/api/member/${memberId}/goals`),
        ]);
        setMember(memberResponse.data);
        setGoals(goalsResponse.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 불러오는 데 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p>로딩 중...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  const ongoingGoals = goals.filter(
    (goal) => !goal.endDate || new Date(goal.endDate) > new Date()
  );
  const completedGoals = goals.filter(
    (goal) => goal.endDate && new Date(goal.endDate) <= new Date()
  );

  const getPaginatedGoals = (goals, currentPage) => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return goals.slice(startIndex, endIndex);
  };

  const totalOngoingPages = Math.ceil(ongoingGoals.length / PAGE_SIZE);
  const totalCompletedPages = Math.ceil(completedGoals.length / PAGE_SIZE);

  const handleEditInfo = () => {
    navigate("/member/detail");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("정말로 회원 탈퇴를 진행하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const memberId = "user03"; // 로그인된 사용자 ID
      await axios.delete(`${SERVER_URL}/api/member/${memberId}`);
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
      alert(`회원 탈퇴 중 오류가 발생했습니다: ${error.response?.data || error.message}`);
    }
  };


  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h3>마이페이지</h3>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <div className="mb-4">
            <h5>회원 ID</h5>
            <p>{member.memberId}</p>
            <h5>이름</h5>
            <p>{member.name}</p>
            <h5>이메일</h5>
            <p>{member.email}</p>
            <h5>생일</h5>
            <p>{member.birth}</p>
            <h5>전화번호</h5>
            <p>{member.phone}</p>
            <h5>성별</h5>
            <p>{member.sex === "M" ? "남성" : "여성"}</p>
          </div>
          <div className="d-flex">
            <Button variant="primary" onClick={handleEditInfo}>
              회원정보 수정
            </Button>
            <Button variant="danger" className="ml-2" onClick={handleDeleteAccount}>
              회원 탈퇴
            </Button>
          </div>
        </Col>
        <Col md={6}>
          <h4>참가 중인 목표</h4>
          <Card>
            <Card.Body style={{ height: 380 }}>
              <Tabs activeKey={selectedTab} onSelect={(k) => setSelectedTab(k)} className="mb-3">
                <Tab eventKey="ongoing" title="진행 중">
                  {ongoingGoals.length > 0 ? (
                    <>
                      <ListGroup>
                        {getPaginatedGoals(ongoingGoals, ongoingPage).map((goal, index) => (
                          <ListGroup.Item
                            key={index}
                            className="hover-item"
                            onClick={() => navigate(`/${goal.goalId}`)}
                          >
                            {goal.title}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                  ) : (
                    <p>현재 진행 중인 목표가 없습니다.</p>
                  )}
                </Tab>
                <Tab eventKey="completed" title="종료">
                  {completedGoals.length > 0 ? (
                    <>
                      <ListGroup>
                        {getPaginatedGoals(completedGoals, completedPage).map((goal, index) => (
                          <ListGroup.Item
                            key={index}
                            className="hover-item"
                            onClick={() => navigate(`/${goal.goalId}`)}
                          >
                            {goal.title}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </>
                  ) : (
                    <p>종료된 목표가 없습니다.</p>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center">
              {selectedTab === "ongoing" ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setOngoingPage(ongoingPage - 1)}
                    disabled={ongoingPage === 1}
                  >
                    이전
                  </Button>
                  <span className="mx-3">{`Page ${ongoingPage} of ${totalOngoingPages}`}</span>
                  <Button
                    variant="secondary"
                    onClick={() => setOngoingPage(ongoingPage + 1)}
                    disabled={ongoingPage === totalOngoingPages}
                  >
                    다음
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setCompletedPage(completedPage - 1)}
                    disabled={completedPage === 1}
                  >
                    이전
                  </Button>
                  <span className="mx-3">{`Page ${completedPage} of ${totalCompletedPages}`}</span>
                  <Button
                    variant="secondary"
                    onClick={() => setCompletedPage(completedPage + 1)}
                    disabled={completedPage === totalCompletedPages}
                  >
                    다음
                  </Button>
                </>
              )}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;
