import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ChatList from './ChatList';
import '@styles/chat/ChatPage.scss';  // SCSS 파일 import
import { Container } from 'react-bootstrap';

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);

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
