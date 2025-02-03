package com.onestep.back.service.chat;

import com.onestep.back.dto.chat.ChatsDTO;
import com.onestep.back.repository.chat.ChatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    private final ChatsRepository chatsRepository;

    @Override
    public List<ChatsDTO> getAllChats() {
        return chatsRepository.findAll().stream()
                .map(chat -> new ChatsDTO(chat.getChatId(), chat.getChatName()))
                .collect(Collectors.toList());
    }
}