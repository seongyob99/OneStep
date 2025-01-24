package com.onestep.back.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_messages")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessages extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "message_id")
    private Long messageId;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chats chat;

    @Column(name = "member_id")
    private String memberId;

    @Column(name = "content")
    private String content;

    public void setChatInfo(Chats chat, String memberId, String content) {
        this.chat = chat;
        this.memberId = memberId;
        this.content = content;
    }
}
