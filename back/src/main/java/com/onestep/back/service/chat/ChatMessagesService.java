package com.onestep.back.service.chat;

import com.onestep.back.domain.ChatMessages;
import com.onestep.back.dto.chat.ChatMessagesDTO;

import java.util.List;

public interface ChatMessagesService {

    ChatMessages sendMessage(ChatMessagesDTO chatMessagesDTO);

    List<ChatMessages> getMessagesByChatId(Long chatId);
}