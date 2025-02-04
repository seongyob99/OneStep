package com.onestep.back.service.chat;

import com.onestep.back.domain.Chats;
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

    @Override
    public int getMemberCountByChatId(Long chatId) {
        // 채팅방 번호에 해당하는 Chats 엔티티 조회
        Chats chat = chatsRepository.findByChatId(chatId);

        // 해당 채팅방의 멤버 수를 반환 (null 체크 필요)
        if (chat != null && chat.getMembers() != null) {
            return chat.getMembers().size();
        }
        return 0;  // 채팅방이나 멤버가 없으면 0 반환
    }


}