import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Button, Card, ListGroup, Tabs, Tab, Spinner } from "react-bootstrap";
import { FaUserCog, FaLock } from "react-icons/fa";

const MyPage = () => {
  const [member, setMember] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("ongoing"); // 진행 중 탭 선택

  const navigate = useNavigate();
  const SERVER_URL = "http://localhost:8080";

  const fetchMember = async () => {
    try {
      const memberId = "user02"; // 로그인된 사용자 ID
      const response = await axios.get(`${SERVER_URL}/api/member/${memberId}`);
      setMember(response.data);
    } catch (err) {
      console.error("사용자 정보를 가져오는 데 실패했습니다.", err);
      setError("사용자 정보를 가져오는 데 실패했습니다.");
    }
  };

  const fetchGoals = async () => {
    try {
      const memberId = "user02"; // 로그인된 사용자 ID
      const response = await axios.get(`${SERVER_URL}/api/member/${memberId}/goals`);
      setGoals(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("수행 중인 목표를 가져오는 데 실패했습니다.", err);
      setGoals([]);
    }
  };

  // 진행 중/종료된 목표 필터링
  const ongoingGoals = goals.filter(
    (goal) => !goal.endDate || new Date(goal.endDate) > new Date()
  );
  const completedGoals = goals.filter(
    (goal) => goal.endDate && new Date(goal.endDate) <= new Date()
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchMember();
      await fetchGoals();
      setLoading(false);
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

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1>마이페이지</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="bg-primary text-white">
              <h4>
                <FaUserCog className="me-2" />
                내 정보
              </h4>
            </Card.Header>
            <Card.Body>
              <p><strong>회원 ID:</strong> {member?.memberId}</p>
              <p><strong>이름:</strong> {member?.name}</p>
              <p><strong>이메일:</strong> {member?.email}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="bg-success text-white">
              <h4>참가 중인 목표</h4>
            </Card.Header>
            <Card.Body>
              <Tabs
                id="goals-tabs"
                activeKey={selectedTab}
                onSelect={(key) => setSelectedTab(key)}
                className="mb-3"
              >
                <Tab eventKey="ongoing" title="진행 중">
                  {ongoingGoals.length > 0 ? (
                    <ListGroup>
                      {ongoingGoals.map((goal, index) => (
                        <ListGroup.Item key={index}>{goal.title}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>현재 진행 중인 목표가 없습니다.</p>
                  )}
                </Tab>
                <Tab eventKey="completed" title="종료">
                  {completedGoals.length > 0 ? (
                    <ListGroup>
                      {completedGoals.map((goal, index) => (
                        <ListGroup.Item key={index}>{goal.title}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>종료된 목표가 없습니다.</p>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyPage;
