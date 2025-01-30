import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, ListGroup, Image } from 'react-bootstrap';
import '@styles/goal/goalDtl.scss';
import { FaMedal, FaCalendarAlt, FaUser, FaUserCog } from 'react-icons/fa';
import { GiDuration } from "react-icons/gi";
import { RiTodoLine } from "react-icons/ri";

const goalData = {
    goalId: 1,
    title: "매일 1시간씩 걷기",
    description: `매일 1시간 걷기를 실천하여 건강을 증진하고 체력을 향상시킵니다. 심혈관 건강과 스트레스 해소에 효과적입니다.`,
    categoryName: "운동",
    rule: `1. 하루에 최소 1시간 걷기. 2. 걷기 후 인증 사진을 찍어 업로드.`,
    certCycle: 1,
    adminMember: "user01",
    startDate: "2025-01-31",
    endDate: "",
    participants: 15,
    members: [
        { memberId: 1, name: '사용자1', certifications: 5 },
        { memberId: 2, name: '사용자2', certifications: 3 },
        { memberId: 3, name: '사용자3', certifications: 8 },
        { memberId: 4, name: '사용자4', certifications: 2 },
        { memberId: 5, name: '사용자5', certifications: 4 },
        { memberId: 6, name: '사용자6', certifications: 6 },
        { memberId: 7, name: '사용자7', certifications: 1 },
        { memberId: 8, name: '사용자8', certifications: 7 },
    ],
};

// 인증 횟수 기준으로 랭킹 정렬
const sortedMembers = goalData.members.sort((a, b) => b.certifications - a.certifications);

const imageData = [
    { filePath: './src/assets/react.svg' },
    { filePath: './src/assets/react.svg' },
    { filePath: './src/assets/react.svg' },
    { filePath: './src/assets/react.svg' },
];

const GoalDtl = () => {
    const navigate = useNavigate();
    const isStarted = new Date(goalData.startDate).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0);

    const onCertification = () => {
        navigate("/cert");
    };

    return (
        <Container>
            <Row className="my-4 d-flex align-items-center">
                <Col>
                    <h3 className="d-inline">{goalData.title}</h3>
                    <p className="d-inline ms-2 mb-0">| {goalData.categoryName}</p>
                </Col>
                <Col xs="auto">
                    <Button variant="danger" className="ms-2">내보내기</Button>
                    <Button variant="danger" className="ms-2">그만두기</Button>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <p>{goalData.description}</p>
                </Col>
            </Row>
            <hr />
            <Row className="mt-4">
                <Col md={8}>
                    <div className="mb-4">
                        <h5><FaUserCog className="me-2" />방장</h5>
                        <p>{goalData.adminMember}</p>
                        <h5><FaUser className="me-2" />인원</h5>
                        <p>{goalData.members.length} / {goalData.participants}</p>
                        <h5><FaCalendarAlt className="me-2" />기간</h5>
                        <p>{goalData.startDate} ~ {goalData.endDate || '종료 시'}</p>
                        <h5><GiDuration className="me-2" />주기</h5>
                        <p>{goalData.certCycle}일마다</p>
                        <h5><RiTodoLine className="me-2" />규칙</h5>
                        <p>{goalData.rule}</p>
                    </div>
                </Col>
                {isStarted &&
                    <Col md={4}>
                        <div>
                            <h4>인증 랭킹</h4>
                            <ListGroup>
                                {sortedMembers.map((member, index) => {
                                    if (index === 0) {
                                        return (
                                            <ListGroup.Item key={member.memberId}>
                                                <FaMedal color="gold" size={24} className="rank" />
                                                {member.name} (<span>{member.certifications}회)</span>
                                            </ListGroup.Item>
                                        );
                                    } else if (index === 1) {
                                        return (
                                            <ListGroup.Item key={member.memberId}>
                                                <FaMedal color="silver" size={24} className="rank" />
                                                {member.name} (<span>{member.certifications}회)</span>
                                            </ListGroup.Item>
                                        );
                                    } else if (index === 2) {
                                        return (
                                            <ListGroup.Item key={member.memberId}>
                                                <FaMedal color="brown" size={24} className="rank" />
                                                {member.name} (<span>{member.certifications}회)</span>
                                            </ListGroup.Item>
                                        );
                                    } else {
                                        return (
                                            <ListGroup.Item key={member.memberId}>
                                                <strong className="rank">{index + 1}위</strong>{member.name} (<span>{member.certifications}회)</span>
                                            </ListGroup.Item>
                                        );
                                    }
                                })}
                            </ListGroup>
                        </div>
                    </Col>
                }
            </Row>
            {isStarted &&
                <>
                    <br /><hr />
                    <Row className="my-4 d-flex justify-content-between align-items-center">
                        <Col>
                            <h4>인증 기록</h4>
                        </Col>
                        <Col xs="auto">
                            <Button variant="primary" onClick={onCertification}>
                                인증하기
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        {imageData.map((image, index) =>
                            <Col xs={3} key={index} className="image-container">
                                <Image src={image.filePath} />
                            </Col>
                        )}
                    </Row>
                </>
            }
        </Container>
    );
};

export default GoalDtl;
