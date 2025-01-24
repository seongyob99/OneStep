package com.onestep.back.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessagesDTO {

    private Long chatId;
    private String memberId;
    private String content;
}
