package com.onestep.back.service.chat;

import com.onestep.back.dto.chat.ChatsDTO;

import java.util.List;

public interface ChatsService {

    List<ChatsDTO> getAllChats();

    ChatsDTO getChatById(Long chatId);
}
