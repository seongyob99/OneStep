import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, ListGroup, Tabs, Tab, Spinner, Button } from "react-bootstrap";
import { FaUserCog } from "react-icons/fa";

const MyPage = () => {
  const [member, setMember] = useState({});
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("ongoing");

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
        console.log("Goals Response:", goalsResponse.data); // 로그 추가
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
          <h1>마이페이지</h1>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h4>
                <FaUserCog className="me-2" />
                내 정보
              </h4>
            </Card.Header>
            <Card.Body>
              <p><strong>회원 ID:</strong> {member.memberId}</p>
              <p><strong>이름:</strong> {member.name}</p>
              <p><strong>이메일:</strong> {member.email}</p>
              <p><strong>생일:</strong> {member.birth}</p>
              <p><strong>전화번호:</strong> {member.phone}</p>
              <p><strong>성별:</strong> {member.sex}</p>
              <p><strong>소셜가입유무:</strong> {member.social ? "예" : "아니오"}</p>

              <div className="d-flex justify-content-between mt-4">
                <Button variant="primary" onClick={handleEditInfo}>
                  회원정보 수정
                </Button>
                <Button variant="danger" onClick={handleDeleteAccount}>
                  회원 탈퇴
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h4>참가 중인 목표</h4>
            </Card.Header>
            <Card.Body>
            <Tabs activeKey={selectedTab} onSelect={(k) => setSelectedTab(k)} className="mb-3">
  <Tab eventKey="ongoing" title="진행 중">
    {ongoingGoals.length > 0 ? (
      <ListGroup>
        {ongoingGoals.map((goal, index) => (
          <ListGroup.Item key={index}>{goal}</ListGroup.Item> /* goal 자체를 출력 */
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
          <ListGroup.Item key={index}>{goal}</ListGroup.Item>/* goal 자체를 출력 */
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
