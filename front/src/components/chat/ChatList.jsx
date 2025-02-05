import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '@styles/chat/ChatList.scss';

const ChatList = ({ setSelectedChat }) => {
    const [chatList, setChatList] = useState([]);
    const [selectedChatId, setSelectedChatIdState] = useState(null);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const memberId = 'user01'; // 실제 사용자 ID로 변경 필요

    useEffect(() => {
        axios.get(`${SERVER_URL}/chat/list/${memberId}`)
            .then(response => {
                setChatList(response.data);
            })
            .catch(error => {
                console.error("채팅방 목록을 불러오는 데 실패했습니다:", error);
            });
    }, []);

    const handleChatSelect = (chat) => {
        setSelectedChatIdState(chat.chatId);
        setSelectedChat(chat);
    };

    return (
        <ul className="chat-list">
            {chatList.length > 0 ? (
                chatList.map(chat => (
                    <li key={chat.chatId} className={`chat-item ${selectedChatId === chat.chatId ? 'selected' : ''}`}>
                        <Link
                            to={`/chat/${chat.chatId}`}
                            className="chat-link"
                            onClick={() => handleChatSelect(chat)}
                            replace>
                            {chat.chatName}
                        </Link>
                    </li>
                ))
            ) : (
                <li className="chat-item">채팅방이 없습니다.</li>
            )}
        </ul>
    );
};

export default ChatList;
