// ChatBox.jsx
import { useState, useEffect } from "react";
import axios from "axios"; // axios import

function ChatBox({ chatId }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        if (!chatId) return;  // chatId가 없으면 실행하지 않음

        // 서버에서 해당 채팅방의 메시지를 가져오는 API 호출
        axios.get(`${SERVER_URL}/chatMessages/chat/${chatId}`)
            .then(response => {
                setMessages(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the messages:", error);
            });
    }, [chatId]); // chatId가 변경될 때마다 새로 호출

    const handleMessageSend = () => {
        if (!newMessage.trim()) return; // 공백 메시지는 보내지 않도록

        // 새 메시지를 보내는 API 호출
        axios.post(`${SERVER_URL}/chatMessages`, {
            chatId: chatId,      // 채팅방 ID
            memberId: "user1",   // 예시로 임의의 사용자 ID 사용
            content: newMessage  // 메시지 내용
        })
            .then(response => {
                setMessages((prevMessages) => [...prevMessages, response.data]);
                setNewMessage("");  // 입력창 초기화
            })
            .catch(error => {
                console.error("There was an error sending the message:", error);
            });
    };

    return (
        <div className="chat-box">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <div><strong>{msg.memberId}</strong>: {msg.content}</div>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)} // 메시지 입력
                    placeholder="Type a message"
                />
                <button onClick={handleMessageSend}>Send</button>
            </div>
        </div>
    );
}

export default ChatBox;
