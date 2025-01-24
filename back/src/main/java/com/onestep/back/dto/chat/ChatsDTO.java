package com.onestep.back.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatsDTO {

    private Long chatId; // 채팅방 ID
    private String chatName; // 채팅방 이름
    private List<String> members; // 채팅방에 속한 멤버들의 ID 목록
}
