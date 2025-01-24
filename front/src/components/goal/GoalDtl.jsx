import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, ListGroup, Image } from 'react-bootstrap';
import { FaMedal } from 'react-icons/fa';

// 더미 데이터 (하나의 Goals 엔티티 기반)
const goalData = {
    goalId: 1,
    title: "매일 1시간씩 걷기",
    description: `
        매일 1시간 걷기를 실천하여 건강을 증진하고 체력을 향상시킵니다. 걷기는 심혈관 건강과 스트레스 해소에 효과적입니다.
    `,
    rule: `
        1. 하루에 최소 1시간 걷기. 
        2. 걷기 후 인증 사진을 찍어 업로드.
    `,
    certCycle: 1, // 인증 주기: 매일 인증
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    participants: 15,
    members: [
        { memberId: 1, name: '사용자1', certifications: 5 },
        { memberId: 2, name: '사용자2', certifications: 3 },
        { memberId: 3, name: '사용자3', certifications: 8 },
        { memberId: 4, name: '사용자4', certifications: 2 },
        { memberId: 5, name: '사용자5', certifications: 4 },
        { memberId: 6, name: '사용자6', certifications: 6 },
        { memberId: 7, name: '사용자7', certifications: 1 },
    ],
};

// 인증 횟수 기준으로 랭킹 정렬
const sortedMembers = goalData.members.sort((a, b) => b.certifications - a.certifications);

const GoalDtl = () => {
    const navigate = useNavigate();

    const onCertification = () => {
        navigate("/");
    };

    return (
        <Container>
            <Row className="my-3 d-flex justify-content-between align-items-center">
                <Col>
                    <h1>{goalData.title}</h1>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={onCertification}>
                        인증하기
                    </Button>
                    <Button variant="danger" className="ms-2">그만두기</Button>
                </Col>
            </Row>

            <Row>
                <Col md={8}>
                    <div>
                        <h2>목표 설명</h2>
                        <p>{goalData.description}</p>
                        <h3>규칙</h3>
                        <p>{goalData.rule}</p>
                        <h3>참여자</h3>
                        <p>참여자 수: {goalData.participants}</p>
                        <h3>기간</h3>
                        <p>{goalData.startDate} ~ {goalData.endDate}</p>
                        <h3>인증 주기</h3>
                        <p>{goalData.certCycle}일마다 인증을 해야 합니다.</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div>
                        <h2>인증 랭킹</h2>
                        <ListGroup>
                            {sortedMembers.map((member, index) => {
                                if (index === 0) {
                                    return (
                                        <ListGroup.Item key={member.memberId}>
                                            <FaMedal color="gold" size={24} />&nbsp;
                                            {member.name} - <span>{member.certifications}회 인증</span>
                                        </ListGroup.Item>
                                    );
                                } else if (index === 1) {
                                    return (
                                        <ListGroup.Item key={member.memberId}>
                                            <FaMedal color="silver" size={24} />&nbsp;
                                            {member.name} - <span>{member.certifications}회 인증</span>
                                        </ListGroup.Item>
                                    );
                                } else if (index === 2) {
                                    return (
                                        <ListGroup.Item key={member.memberId}>
                                            <FaMedal color="brown" size={24} />&nbsp;
                                            {member.name} - <span>{member.certifications}회 인증</span>
                                        </ListGroup.Item>
                                    );
                                } else {
                                    return (
                                        <ListGroup.Item key={member.memberId}>
                                            <strong>{index + 1}위</strong> {member.name} - <span>{member.certifications}회 인증</span>
                                        </ListGroup.Item>
                                    );
                                }
                            })}
                        </ListGroup>
                    </div>
                </Col>
            </Row>

            {/* 인증 이미지 추가된 새 Row */}
            <Row className="my-4">
                <Col>
                    <h2>인증 이미지</h2>
                </Col>
            </Row>
            <Row>
                <Col xs={3}>
                    <Image src="https://via.placeholder.com/150" fluid />
                </Col>
                <Col xs={3}>
                    <Image src="https://via.placeholder.com/150" fluid />
                </Col>
                <Col xs={3}>
                    <Image src="https://via.placeholder.com/150" fluid />
                </Col>
                <Col xs={3}>
                    <Image src="https://via.placeholder.com/150" fluid />
                </Col>
            </Row>
        </Container>
    );
};

export default GoalDtl;
