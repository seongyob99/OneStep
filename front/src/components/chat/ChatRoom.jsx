import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import '@styles/chat/ChatRoom.scss';
import { IoPersonSharp } from "react-icons/io5";
import { useAuth } from '../context/AuthContext';

const ChatRoom = () => {
    const { chatId } = useParams();
    const [memberCount, setMemberCount] = useState(null);
    const { selectedChat } = useOutletContext();
    const chatRoomName = selectedChat ? selectedChat.chatName : chatId;
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
    const [lastConfirmedMessageId, setLastConfirmedMessageId] = useState(null);

    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const listRef = useRef(null);
    // AuthContext에서 authState 가져오기
    const { authState } = useAuth();
    // username 가져오기
    const memberId = authState.user?.username;

    const cacheRef = useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: 50,
        })
    );

    // 메시지 로드 함수
    const loadMessages = (loadMore = false) => {
        const lastMessageId =
            loadMore && messages.length > 0 ? messages[0].messageId : null;
        axios.get(`${SERVER_URL}/chat/${chatId}/messages`, {
            params: { loadMore, lastMessageId },
        })
            .then((response) => {
                const newMessages = response.data;
                setMessages((prev) =>
                    loadMore ? [...newMessages, ...prev] : newMessages
                );
                cacheRef.current.clearAll();
            })
            .catch((error) => {
                console.error('채팅 메시지 불러오기 실패:', error);
                setError('메시지를 불러오는 데 실패했습니다.');
            });
    };

    useEffect(() => {
        axios
            .get(`${SERVER_URL}/chat/${chatId}/memberCount`)
            .then((response) => {
                setMemberCount(response.data);
            })
            .catch((err) => {
                setError('멤버 수를 가져오는 데 실패했습니다.');
            });
    }, [chatId]);

    useEffect(() => {
        setShouldAutoScroll(true);
        loadMessages();
        setLastConfirmedMessageId(null);
    }, [chatId]);

    // 새로운 메시지가 들어오면 주기적으로 메시지를 불러옴
    useEffect(() => {
        const intervalId = setInterval(() => {
            loadMessages();
        }, 2500);
        return () => clearInterval(intervalId);
    }, [chatId]);

    const handleScroll = ({ scrollTop, clientHeight, scrollHeight }) => {
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            setIsAtBottom(true);
            setShowNewMessageIndicator(false);
            if (messages.length > 0) {
                setLastConfirmedMessageId(messages[messages.length - 1].messageId);
            }
        } else {
            setIsAtBottom(false);
        }
    };

    useEffect(() => {
        const currentLastMessageId =
            messages.length > 0 ? messages[messages.length - 1].messageId : null;

        if (shouldAutoScroll || isAtBottom) {
            listRef.current.scrollToRow(messages.length - 1);  // 메시지 추가 시 자동으로 맨 아래로
            setShouldAutoScroll(false);
            setShowNewMessageIndicator(false);
            setLastConfirmedMessageId(currentLastMessageId);
        } else {
            if (currentLastMessageId && currentLastMessageId !== lastConfirmedMessageId) {
                setShowNewMessageIndicator(true);  // 스크롤이 맨 아래가 아닐 경우 인디케이터 표시
            }
        }
    }, [messages, shouldAutoScroll, isAtBottom, lastConfirmedMessageId]);

    const handleScrollToBottom = () => {
        if (listRef.current) {
            listRef.current.scrollToRow(messages.length - 1);
            setIsAtBottom(true);
            setShowNewMessageIndicator(false);
            const currentLastMessageId =
                messages.length > 0 ? messages[messages.length - 1].messageId : null;
            setLastConfirmedMessageId(currentLastMessageId);
        }
    };

    const rowRenderer = useCallback(
        ({ index, key, parent, style }) => {
            const message = messages[index];
            const isCurrentUser = message.memberId === memberId;
            return (
                <CellMeasurer
                    cache={cacheRef.current}
                    columnIndex={0}
                    key={key}
                    parent={parent}
                    rowIndex={index}
                >
                    {({ measure, registerChild }) => (
                        <div ref={registerChild} style={style} className={`message ${isCurrentUser ? 'mine' : ''}`}>
                            {isCurrentUser ? (
                                <div className="message-content mine">
                                    <span className="timestamp">
                                        {new Date(message.timestamp).toLocaleDateString()} {new Date(message.timestamp).toLocaleTimeString()}
                                    </span>
                                    &nbsp;&nbsp;
                                    <span className="message-text message-text-mine">{message.content}</span>
                                </div>
                            ) : (
                                <div className="message-content">
                                    <strong>{message.memberId}</strong>&nbsp;
                                    <span className='message-text message-text-other'>{message.content}</span>
                                    <span className="timestamp">
                                        &nbsp;&nbsp;{new Date(message.timestamp).toLocaleDateString()} {new Date(message.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </CellMeasurer>
            );
        },
        [messages, memberId]
    );

    const handleMessageSend = () => {
        if (!newMessage.trim()) return;

        const messageData = {
            content: newMessage,
            timestamp: new Date().toISOString(),
            memberId: memberId,
            isMine: true,
        };

        setShouldAutoScroll(true);
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setNewMessage('');

        // 메시지 전송 후 새 메시지 인디케이터는 뜨지 않도록 설정
        setShowNewMessageIndicator(false);

        axios
            .post(`${SERVER_URL}/chat/${chatId}/messages`, {
                memberId,
                content: newMessage,
                chatId,
            })
            .then((response) => {

            })
            .catch((error) => {
                console.error('메시지 전송 실패:', error);
            });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleMessageSend();
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="chat-room">
            <h3>{chatRoomName} <span className="small"><IoPersonSharp color="red" /> {memberCount}</span></h3>
            <div className="messages-container">
                <AutoSizer>
                    {({ width, height }) => (
                        <List
                            ref={listRef}
                            width={width}
                            height={height}
                            rowCount={messages.length}
                            deferredMeasurementCache={cacheRef.current}
                            rowHeight={cacheRef.current.rowHeight}
                            rowRenderer={rowRenderer}
                            overscanRowCount={5}
                            onScroll={handleScroll}
                        />
                    )}
                </AutoSizer>
                {showNewMessageIndicator && (
                    <div className="new-message-indicator" onClick={handleScrollToBottom}>
                        새 메시지가 도착했습니다.
                    </div>
                )}
            </div>
            <div className="message-input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="message-input"
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleMessageSend} className="send-button">
                    보내기
                </button>
            </div>
        </div>
    );
};

export default React.memo(ChatRoom);
