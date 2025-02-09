import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import CertDelete from "./CertDelete";
import { useAuth } from '../context/AuthContext';


const CertModal = ({ show,
    onClose,
    imageUrl,
    user,
    filePath,
    goalid,
    selectedDate,
    onRefresh,
    adminMemberId,
    certOwnerId }) => {

    // 모달이 열리지 않았을 때 렌더링 방지
    if (!show) return null; 

    const { authState } = useAuth();
    const loggedInUser = authState.user?.username;

    return (
        <>
            <Modal show={show} onHide={onClose} centered>
                <Modal.Body className="text-center">
                    <p className="mt-2">{user} ({certOwnerId})</p>
                    <img src={imageUrl} alt="인증 이미지" />  
                    {/* style={{ maxWidth: "100%" }} */}

                </Modal.Body>
                <Modal.Footer>
                    <CertDelete
                        filePath={filePath}
                        goalid={goalid}
                        selectedDate={selectedDate}
                        onClose={onClose}
                        onRefresh={onRefresh}
                        adminMemberId={adminMemberId}
                        certOwnerId={certOwnerId}
                    />
                    <Button variant="secondary" onClick={onClose}>닫기</Button>
                </Modal.Footer>
            </Modal>


        </>
    );
};

export default CertModal;
