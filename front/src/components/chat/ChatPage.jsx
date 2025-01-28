// src/pages/ChatPage.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import ChatList from './ChatList';

const ChatPage = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '300px', padding: '20px', backgroundColor: '#f0f0f0', borderRight: '1px solid #ccc' }}>
                <h3>채팅방 리스트</h3>
                <ChatList />
            </div>
            <div style={{ flexGrow: 1, padding: '20px' }}>
                <Outlet /> {/* ChatRoom이 여기에 렌더링됩니다 */}
            </div>
        </div>
    );
};

export default ChatPage;
