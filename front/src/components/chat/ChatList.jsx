import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ChatList = () => {
    const [chatList, setChatList] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    useEffect(() => {
        // 채팅방 리스트를 백엔드에서 받아옵니다.
        axios.get(`${SERVER_URL}/chat/list`)
            .then(response => {
                setChatList(response.data);  // 받은 데이터를 상태에 저장
                console.log(response.data);
                setLoading(false);  // 로딩 종료
            })
            .catch(error => {
                console.error("채팅방 목록을 불러오는 데 실패했습니다:", error);
                setError('채팅방 목록을 불러오는 데 실패했습니다.');  // 에러 메시지 설정
                setLoading(false);  // 로딩 종료
            });
    }, []);

    if (loading) {
        return <div>로딩 중...</div>; // 로딩 중인 경우
    }

    if (error) {
        return <div>{error}</div>; // 에러 발생 시
    }

    return (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
            {chatList && chatList.length > 0 ? (
                chatList.map(chat => (
                    <li key={chat.chatId} style={{ padding: '10px', backgroundColor: '#fff', borderBottom: '1px solid #ccc' }}>
                        <Link to={`/chat/${chat.chatId}`} style={{ textDecoration: 'none', color: 'black' }}>
                            {chat.chatName}
                        </Link>
                    </li>
                ))
            ) : (
                <li style={{ padding: '10px', backgroundColor: '#fff', borderBottom: '1px solid #ccc' }}>
                    채팅방이 없습니다.
                </li>
            )}
        </ul>
    );
};

export default ChatList;
