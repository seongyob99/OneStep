import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ChatList from './ChatList';
import '@styles/chat/ChatPage.scss';  // SCSS 파일 import

const ChatPage = () => {
    const [selectedChatId, setSelectedChatId] = useState(null);

    return (
        <div className="chat-page">
            <div className="chat-list-container">
                <h3>채팅방 리스트</h3>
                <div className="chat-list-scroll">
                    <ChatList setSelectedChatId={setSelectedChatId} />
                </div>
            </div>
            <div className="chat-room-container">
                <Outlet context={{ selectedChatId }} />
            </div>
        </div>
    );
};

export default ChatPage;
