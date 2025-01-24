import React from "react";
import ChatBox from "./ChatBox"; // ChatBox 컴포넌트 임포트

function ChatPage() {
    return (
        <div>
            <h2>Chat Room</h2>
            <ChatBox /> {/* ChatBox 컴포넌트로 채팅 기능을 포함 */}
        </div>
    );
}

export default ChatPage;