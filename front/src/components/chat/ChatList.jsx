import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '@styles/chat/ChatList.scss';
import { useAuth } from '../context/AuthContext';

const ChatList = ({ setSelectedChat }) => {
    const { chatId: currentChatId } = useParams(); // URL에서 chatId 가져오기
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    // AuthContext에서 authState 가져오기
    const { authState } = useAuth();
    const memberId = authState.user?.username;

    // ✅ 초기 상태를 `currentChatId`로 설정하여 새로고침 시 유지
    const [selectedChatId, setSelectedChatIdState] = useState(currentChatId);
    const [chatList, setChatList] = useState([]);

    // ✅ 서버에서 채팅방 목록 불러오기
    useEffect(() => {
        axios.get(`${SERVER_URL}/chat/list/${memberId}`)
            .then(response => {
                setChatList(response.data);
            })
            .catch(error => {
                console.error("채팅방 목록을 불러오는 데 실패했습니다:", error);
            });
    }, [memberId]);

    // ✅ `chatList`가 변경되면 `currentChatId`와 일치하는 채팅방을 `selectedChatId`로 설정
    useEffect(() => {
        if (chatList.length > 0 && currentChatId) {
            const foundChat = chatList.find(chat => chat.chatId === currentChatId);
            if (foundChat) {
                setSelectedChatIdState(foundChat.chatId);
                setSelectedChat(foundChat);
            }
        }
    }, [chatList, currentChatId]);

    // ✅ 사용자가 채팅방을 클릭하면 선택된 채팅방 업데이트
    const handleChatSelect = (chat) => {
        setSelectedChatIdState(chat.chatId);
        setSelectedChat(chat);
    };

    return (
        <ul className="chat-list">
            {chatList.length > 0 ? (
                chatList.map(chat => (
                    <li
                        key={chat.chatId}
                        className={`chat-item ${String(selectedChatId) === String(chat.chatId) ? 'selected' : ''}`}
                    >
                        <Link
                            to={`/chat/${chat.chatId}`}
                            className="chat-link"
                            onClick={() => handleChatSelect(chat)}
                            replace
                        >
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
