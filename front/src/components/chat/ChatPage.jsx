import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ChatList from './ChatList';
import '@styles/chat/ChatPage.scss';  // SCSS 파일 import
import { Container } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";

const ChatPage = () => {
    // AuthContext에서 authState 가져오기
    const { authState } = useAuth();
    // username 가져오기
    const username = authState.user?.username;
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState(null);

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

    return (
        <Container>
            <div className="chat-page">
                <div className="chat-list-container">
                    <h3>채팅방 리스트</h3>
                    <div className="chat-list-scroll">
                        <ChatList setSelectedChat={setSelectedChat} />
                    </div>
                </div>
                <div className="chat-room-container">
                    <Outlet context={{ selectedChat }} />
                </div>
            </div>
        </Container>
    );
};

export default ChatPage;
