package com.onestep.back.service.chat;

import com.onestep.back.dto.chat.ChatMessagesDTO;

import java.util.List;

public interface ChatMessagesService {
    void saveMessage(Long chatId, String memberId, String content);

    List<ChatMessagesDTO> getMessages(Long chatId);
}
