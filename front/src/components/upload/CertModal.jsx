import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import CertDelete from "./CertDelete";
// import CertUpdate from "./CertUpdate";

const CertModal = ({ show, onClose, imageUrl, user, filePath, goalid, selectedDate, onRefresh }) => {
    const [showUpdate, setShowUpdate] = useState(false); // ✅ 수정 모달 상태 추가

    if (!show) return null; // ✅ 모달이 열리지 않았을 때 렌더링 방지

    return (
        <>
            <Modal show={show} onHide={onClose} centered>
                <Modal.Body className="text-center">
                    {/* 이미지 표시 */}
                    <img src={imageUrl} alt="인증 이미지" style={{ maxWidth: "100%" }} />
                    <p className="mt-2">작성자: {user}</p>
                </Modal.Body>
                <Modal.Footer>
                    {/* 수정 버튼
                    <Button
                        className="Update"
                        onClick={() => setShowUpdate(true)} // ✅ 클릭 시 수정 모달 열기
                    >
                        수정
                    </Button> */}

                    {/* 삭제 버튼 */}
                    <CertDelete
                        filePath={filePath}
                        goalid={goalid}
                        selectedDate={selectedDate}
                        onClose={onClose}
                        onRefresh={onRefresh}
                    />

                    <Button variant="secondary" onClick={onClose}>닫기</Button>
                </Modal.Footer>
            </Modal>

            {/* ✅ CertUpdate 모달 추가 */}
            {showUpdate && (
                <CertUpdate
                    show={showUpdate}
                    onClose={() => setShowUpdate(false)}
                    filePath={filePath}
                    goalid={goalid}
                    selectedDate={selectedDate}
                    onRefresh={onRefresh}
                />
            )}
        </>
    );
};

export default CertModal;
