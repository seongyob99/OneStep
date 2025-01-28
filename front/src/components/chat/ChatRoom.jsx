// src/pages/ChatRoom.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatRoom = () => {
    const { chatId } = useParams(); // URL에서 chatId 파라미터를 가져옵니다.
    const [messages, setMessages] = useState([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        // 채팅방 메시지 불러오기
        axios.get(`${SERVER_URL}/chat/${chatId}/messages`)
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error("채팅 메시지를 불러오는 데 실패했습니다:", error);
            });
    }, [chatId]); // chatId가 변경될 때마다 호출됩니다.

    return (
        <div>
            <h3>채팅방 {chatId} 메시지</h3>
            <div>
                {messages.map(message => (
                    <div key={message.messageId} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                        <strong>{message.memberId}</strong>: {message.content}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatRoom;
