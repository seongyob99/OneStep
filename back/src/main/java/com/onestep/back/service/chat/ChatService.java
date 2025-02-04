package com.onestep.back.service.chat;

import com.onestep.back.dto.chat.ChatsDTO;

import java.util.List;

public interface ChatService {
    List<ChatsDTO> getAllChats();
}
