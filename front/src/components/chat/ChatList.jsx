import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../styles/chat/ChatList.scss';

const ChatList = ({ setSelectedChatId }) => {
    const [chatList, setChatList] = useState([]);
    const [selectedChatId, setSelectedChatIdState] = useState(null);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    useEffect(() => {
        axios.get(`${SERVER_URL}/chat/list`)
            .then(response => {
                setChatList(response.data);
            })
            .catch(error => {
                console.error("채팅방 목록을 불러오는 데 실패했습니다:", error);
            });
    }, []);

    const handleChatSelect = (chatId) => {
        setSelectedChatIdState(chatId);
        setSelectedChatId(chatId);
    };

    return (
        <ul className="chat-list">
            {chatList.length > 0 ? (
                chatList.map(chat => (
                    <li
                        key={chat.chatId}
                        className={`chat-item ${selectedChatId === chat.chatId ? 'selected' : ''}`}
                        onClick={() => handleChatSelect(chat.chatId)}
                    >
                        <Link to={`/chat/${chat.chatId}`} className="chat-link">
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
