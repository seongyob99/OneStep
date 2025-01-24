package com.onestep.back.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "chats")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chats extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_id")
    private Long chatId;

    @OneToOne
    @JoinColumn(name = "goal_id")
    private Goals goal;

    @Column(name = "chat_name")
    private String chatName;

    @ManyToMany(mappedBy = "chats", fetch = FetchType.LAZY)
    private List<Members> members;

    @OneToMany(mappedBy = "chat", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChatMessages> chatMessages;
}
