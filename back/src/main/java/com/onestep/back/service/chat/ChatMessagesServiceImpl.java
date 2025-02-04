package com.onestep.back.service.chat;

import com.onestep.back.domain.ChatMessages;
import com.onestep.back.domain.Chats;
import com.onestep.back.dto.chat.ChatMessagesDTO;
import com.onestep.back.repository.chat.ChatMessagesRepository;
import com.onestep.back.repository.chat.ChatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessagesServiceImpl implements ChatMessagesService {
    private final ChatMessagesRepository chatMessagesRepository;
    private final ChatsRepository chatsRepository;

    @Override
    public void saveMessage(Long chatId, String memberId, String content) {
        Chats chat = chatsRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));
        ChatMessages message = ChatMessages.builder()
                .chat(chat)
                .memberId(memberId)
                .content(content)
                .build();
        chatMessagesRepository.save(message);
    }

    @Override
    public List<ChatMessagesDTO> getMessages(Long chatId) {
        // 채팅방에 해당하는 메시지 엔티티 리스트를 조회
        List<ChatMessages> chatMessages = chatMessagesRepository.findBychat_ChatId(chatId);

        // 채팅 메시지 엔티티 리스트를 ChatMessagesDTO로 변환
        List<ChatMessagesDTO> chatMessagesDTOList = chatMessages.stream()
                .map(ChatMessagesDTO::new)  // ChatMessages 엔티티를 DTO로 변환 (멤버 수 계산 포함)
                .collect(Collectors.toList());

        return chatMessagesDTOList;  // DTO 리스트 반환
    }

}
