import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '@styles/goal/goalDtl.scss';
import { Container, Row, Col, Button, ListGroup, Image, Spinner, Modal } from 'react-bootstrap';
import { FaMedal, FaCalendarAlt, FaUser, FaUserCog } from 'react-icons/fa';
import { BsCalendarWeekFill } from "react-icons/bs";
import { RiTodoFill, RiArrowDownSLine } from "react-icons/ri";

const GoalDtl = () => {
    const [goalData, setGoalData] = useState(null);
    const [imageData, setImageData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isMembersVisible, setIsMembersVisible] = useState(false);
    const [dataChanged, setDataChanged] = useState(false);

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const goalid = useParams().goalid;
    const isStarted = goalData && new Date(goalData?.startDate).getTime() <= Date.now();
    const isEnded = goalData && new Date(goalData?.endDate).getTime() <= Date.now();

    // 정보 조회
    const getGoalInfo = useCallback(async () => {
        try {
            const response = await axios.post(
                `${SERVER_URL}/goals/dtl/${goalid}`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setGoalData(response.data);
        } catch (err) {
            alert("상세정보를 가져오지 못했습니다.");
        }
    }, []);

    // 최근 인증 기록 조회
    const getRecentCert = useCallback(async () => {
        try {
            const response = await axios.post(
                `${SERVER_URL}/goals/dtl/getRecentCert/${goalid}`,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setImageData(response.data);
        } catch (err) {
            alert("인증 기록을 가져오지 못했습니다.");
        }
    }, []);

    useEffect(() => {
        getGoalInfo();
        getRecentCert();
    }, [dataChanged]);

    // 인원 리스트 조회
    const handleArrowClick = () => {
        setIsMembersVisible(prevState => !prevState);
    };

    // 관리자 외 참가자 목록
    const filteredMembers = useMemo(() => {
        return goalData?.members.filter((member) => member.memberId !== goalData.adminMemberId);
    }, [goalData]);

    // 참가하기
    const onJoin = useCallback(async () => {
        if (goalData?.members.length === goalData?.participants) {
            alert("모집 완료된 목표입니다.");
            return;
        }
        const confirmJoin = confirm("이 목표에 참가하시겠습니까?");
        if (confirmJoin) {
            try {
                await axios.post(
                    `${SERVER_URL}/goals/dtl/joinGoal`,
                    { goalId: goalid, memberId: 'user03' }, // 로그인 유저
                    { headers: { 'Content-Type': 'application/json' } }
                );
                setDataChanged(prev => !prev);
            } catch (err) {
                alert("작업에 실패했습니다. 다시 시도해주세요.");
            }
        }
    }, [goalData]);

    // 내보내기 및 그만두기
    const removeMember = useCallback(async (memberId) => {
        try {
            await axios.post(
                `${SERVER_URL}/goals/dtl/removeMember`,
                { goalId: goalid, memberId: memberId },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setDataChanged(prev => !prev);
        } catch (err) {
            alert("작업에 실패했습니다. 다시 시도해주세요.");
        }
    }, []);

    // 그만두기
    const onCancel = useCallback(() => {
        const confirmCancel = confirm("정말 그만두시겠습니까?");
        if (confirmCancel) {
            removeMember('user03'); // 로그인 유저
        }
    }, []);

    // 내보내기
    const onExport = () => {
        setSelectedMember(null);
        setShowModal(true);
    };

    // 선택완료
    const handleSelectComplete = useCallback(() => {
        if (!selectedMember) {
            alert("선택된 유저가 없습니다.");
            return;
        }
        const confirmDelete = confirm(`${selectedMember?.name}(${selectedMember?.memberId}) 을(를) 내보내시겠습니까?`);
        if (confirmDelete) {
            removeMember(selectedMember.memberId);
            setShowModal(false);
        }
    }, [selectedMember]);

    // 수정하기
    const onUpdate = useCallback(() => {
        navigate(`/${goalid}/update`)
    }, []);

    // 삭제하기
    const onDelete = useCallback(async () => {
        const confirmDelete = confirm(`이 목표를 삭제하시겠습니까?`);
        if (confirmDelete) {
            try {
                await axios.delete(
                    `${SERVER_URL}/goals/dtl/${goalid}`,
                    { headers: { 'Content-Type': 'application/json' } }
                );
                navigate("/");
            } catch (err) {
                alert("목표 삭제에 실패했습니다. 다시 시도해주세요.");
            }
        }
    }, []);

    // 인증하기
    const onCertification = useCallback(() => {
        navigate(`/cert/${goalid}`);
    }, []);

    // 데이터 없는 경우 로딩창
    if (!goalData) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p>Loading...</p>
            </Container>
        );
    }

    return (
        <Container>
            <Col className="d-flex align-items-center">
                <Col xs="auto" className="mt-3">
                    <Image src={`${SERVER_URL}/uploads/${goalData.thumbnail}`} alt="Goal Thumbnail" className="goal-thumbnail" />
                </Col>
                <Col>
                    <Row className="mt-4 d-flex align-items-center">
                        <Col>
                            <h3 className="d-inline goal-title">{goalData.title}</h3>
                            <p className="d-inline ms-2 mb-0 gray-text">| {goalData.categoryName}</p>
                            <p className="my-2">{goalData.description}</p>
                        </Col>
                        <Col xs="auto">
                            {!isEnded &&
                                <>
                                    <Button variant="danger" className="ms-2" onClick={onExport}>내보내기</Button>
                                    <Button variant="danger" className="ms-2" onClick={onCancel}>그만두기</Button>
                                </>
                            }
                            {!isStarted &&
                                <>
                                    <Button variant="danger" className="ms-2" onClick={onUpdate}>수정하기</Button>
                                    <Button variant="danger" className="ms-2" onClick={onDelete}>삭제하기</Button>
                                    <Button variant="primary" className="ms-2" onClick={onJoin}>참가하기</Button>
                                </>
                            }
                        </Col>
                    </Row>
                </Col>
            </Col>
            <hr />
            <Row className="mt-4">
                <Col md={8}>
                    <div className="mb-4">
                        <h5><FaUserCog className="me-2" />방장</h5>
                        <p>{goalData.adminMemberName} ({goalData.adminMemberId})</p>
                        <h5 className="d-flex align-items-center">
                            <FaUser className="me-2" />인원
                            <div className="arrow-container position-relative"> {/* 새로운 div 추가 */}
                                <RiArrowDownSLine
                                    className={`ms-2 ${isMembersVisible ? 'rotated' : ''}`}
                                    onClick={handleArrowClick}
                                />
                                {/* 인원 리스트 */}
                                {isMembersVisible && (
                                    <div className="member-list-modal">
                                        <ul>
                                            {goalData.members.map((member, index) => (
                                                <li key={index}>{member.name} ({member.memberId})</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </h5>
                        <p>{goalData.members.length} / {goalData.participants}</p>
                        <h5><FaCalendarAlt className="me-2" />기간</h5>
                        <p>{goalData.startDate} ~ {goalData.endDate || '종료 시'}</p>
                        <h5><BsCalendarWeekFill className="me-2" />주기</h5>
                        <p>{goalData.certCycle}일마다</p>
                        <h5><RiTodoFill className="me-2" />규칙</h5>
                        <p>{goalData.rule}</p>
                    </div>
                </Col>
                <Col md={4}>
                    <div>
                        <h4>인증 랭킹</h4>
                        {!isStarted ? (
                            <>
                                <br /><p>랭킹은 목표 시작일부터 표시됩니다.</p>
                            </>
                        ) : (
                            <ListGroup>
                                {goalData.members.map((member, index) => {
                                    if (index === 0) {
                                        return (
                                            <ListGroup.Item key={member.memberId} title={`${member.name} (${member.memberId})`}>
                                                <FaMedal color="gold" size={24} className="rank" />
                                                {member.name} <span className="gray-text">({member.certCnt}회)</span>
                                            </ListGroup.Item>
                                        );
                                    } else if (index === 1) {
                                        return (
                                            <ListGroup.Item key={member.memberId} title={`${member.name} (${member.memberId})`}>
                                                <FaMedal color="silver" size={24} className="rank" />
                                                {member.name} <span className="gray-text">({member.certCnt}회)</span>
                                            </ListGroup.Item>
                                        );
                                    } else if (index === 2) {
                                        return (
                                            <ListGroup.Item key={member.memberId} title={`${member.name} (${member.memberId})`}>
                                                <FaMedal color="brown" size={24} className="rank" />
                                                {member.name} <span className="gray-text">({member.certCnt}회)</span>
                                            </ListGroup.Item>
                                        );
                                    } else {
                                        return (
                                            <ListGroup.Item key={member.memberId} title={`${member.name} (${member.memberId})`}>
                                                <strong className="rank">{index + 1}위</strong>{member.name} <span className="gray-text">({member.certCnt}회)</span>
                                            </ListGroup.Item>
                                        );
                                    }
                                })}
                            </ListGroup>
                        )}
                    </div>
                </Col>
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
                                <Image src={`${SERVER_URL}/uploads/${image.filePath}`} />
                            </Col>
                        )}
                    </Row>
                </>
            }

            {/* 모달 */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>유저 선택</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {filteredMembers.map((member) => (
                            <ListGroup.Item
                                key={member.memberId}
                                onClick={() => setSelectedMember(member)}
                                className={`member-item ${selectedMember?.memberId === member.memberId ? 'selected-member' : ''}`}
                            >
                                {member.name} ({member.memberId})
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSelectComplete}>
                        선택 완료
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default GoalDtl;
