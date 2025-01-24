// ChatList.jsx
import { useState, useEffect } from "react";
import axios from "axios";

function ChatList({ setSelectedChatId }) {
    const [chatRooms, setChatRooms] = useState([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        // 채팅방 목록을 가져오는 API 호출
        axios.get(`${SERVER_URL}/chats`)
            .then(response => {
                setChatRooms(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the chat rooms:", error);
            });
    }, []);

    return (
        <div className="chat-list">
            {chatRooms.map((chat) => (
                <div
                    key={chat.chatId}
                    className="chat-item"
                    onClick={() => setSelectedChatId(chat.chatId)} // 채팅방 클릭 시 chatId 설정
                >
                    {chat.chatName}
                </div>
            ))}
        </div>
    );
}

export default ChatList;
