package com.onestep.back.service.chat;

import com.onestep.back.domain.ChatMessages;

import java.util.List;

public interface ChatMessagesService {
    void saveMessage(Long chatId, String memberId, String content);

    List<ChatMessages> getMessages(Long chatId);
}
