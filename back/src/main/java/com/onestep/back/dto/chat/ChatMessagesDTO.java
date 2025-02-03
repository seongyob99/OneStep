package com.onestep.back.dto.chat;
import com.onestep.back.domain.ChatMessages;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessagesDTO {
    private Long messageId;   // 메시지 ID
    private String memberId;  // 메시지를 보낸 멤버의 ID
    private String content;   // 메시지 내용
    private LocalDateTime timestamp; // 메시지 작성 시각

    // ChatMessages 엔티티를 DTO로 변환하는 생성자
    public ChatMessagesDTO(ChatMessages chatMessages) {
        this.messageId = chatMessages.getMessageId();
        this.memberId = chatMessages.getMemberId();
        this.content = chatMessages.getContent();
        this.timestamp = chatMessages.getRegDate();  // createdDate 필드를 timestamp로 사용
    }
}
