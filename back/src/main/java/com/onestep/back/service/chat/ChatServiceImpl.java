package com.onestep.back.service.chat;

import com.onestep.back.domain.Chats;
import com.onestep.back.repository.chat.ChatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final ChatsRepository chatsRepository;

    @Override
    public List<Chats> getAllChats() {
        return chatsRepository.findAll();
    }
}