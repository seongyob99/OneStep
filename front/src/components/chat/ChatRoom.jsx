import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { List, AutoSizer } from 'react-virtualized'; // AutoSizer 추가
import '../../styles/chat/ChatRoom.scss';  // SCSS 파일 import

const ChatRoom = () => {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');  // 새로운 메시지 상태 추가
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const listRef = useRef(null);
    const memberId = '현재 사용자';  // 실제 사용자 ID로 변경 필요

    useEffect(() => {
        console.log(`useEffect 감지: chatId=${chatId}`);
        loadMessages();
    }, [chatId]);

    const loadMessages = (loadMore = false) => {
        if (loading || !hasMore) return;

        setLoading(true);
        const lastMessageId = loadMore && messages.length > 0 ? messages[0].messageId : null;

        axios.get(`${SERVER_URL}/chat/${chatId}/messages`, {
            params: { loadMore, lastMessageId }
        })
            .then(response => {
                const newMessages = response.data;
                setMessages(prev => (loadMore ? [...newMessages, ...prev] : newMessages));
                setHasMore(newMessages.length === 20);
                setLoading(false);
            })
            .catch(error => {
                console.error("채팅 메시지 불러오기 실패:", error);
                setError("메시지를 불러오는 데 실패했습니다.");
                setLoading(false);
            });
    };

    const handleScroll = ({ scrollTop }) => {
        if (scrollTop === 0 && !loading && hasMore) {
            loadMessages(true);
        }
    };

    const rowRenderer = useCallback(
        ({ index, key, style }) => {
            const message = messages[index];
            return (
                <div key={key} style={style} className={`message ${message.isMine ? 'mine' : ''}`}>
                    <strong>{message.memberId}</strong>: {message.content}
                    <span className="timestamp">
                        &nbsp;&nbsp;{new Date(message.timestamp).toLocaleDateString()} {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                </div>
            );
        },
        [messages]
    );

    const handleMessageSend = () => {
        if (!newMessage.trim()) return;

        const messageData = {
            content: newMessage,
            timestamp: new Date().toISOString(),
            memberId: memberId,  // 실제 사용자 ID로 변경 필요
            isMine: true,  // 메시지가 나의 것임을 나타냄
        };

        setMessages(prevMessages => [...prevMessages, messageData]);
        setNewMessage('');

        // 서버로 메시지 전송
        axios.post(`${SERVER_URL}/chat/${chatId}/messages`, {
            memberId,  // 실제 사용자 ID
            content: newMessage,
        })
            .then(response => {
                console.log('메시지가 서버에 저장되었습니다:', response.data);
                // 메시지 전송 후, 스크롤을 맨 아래로 내리기
                listRef.current.scrollToRow(messages.length);  // 새 메시지로 스크롤
            })
            .catch(error => {
                console.error("메시지 전송 실패:", error);
            });
    };

    if (loading && !messages.length) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="chat-room">
            <h3>채팅방 {chatId} 메시지</h3>
            <div className="messages-container">
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            ref={listRef}
                            width={width}
                            height={height}
                            rowCount={messages.length}
                            rowHeight={50}
                            rowRenderer={rowRenderer}
                            onScroll={handleScroll}
                            overscanRowCount={5}
                        />
                    )}
                </AutoSizer>
            </div>

            {/* 메시지 입력창 및 보내기 버튼 */}
            <div className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="message-input"
                />
                <button onClick={handleMessageSend} className="send-button">보내기</button>
            </div>
        </div>
    );
};

export default ChatRoom;
