package com.onestep.back.service.chat;

import com.onestep.back.domain.ChatMessages;
import com.onestep.back.domain.Chats;
import com.onestep.back.dto.chat.ChatMessagesDTO;
import com.onestep.back.repository.chat.ChatMessagesRepository;
import com.onestep.back.repository.chat.ChatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessagesServiceImpl implements ChatMessagesService {

    private final ChatMessagesRepository chatMessagesRepository;
    private final ChatsRepository chatsRepository;

    @Override
    public ChatMessages sendMessage(ChatMessagesDTO chatMessagesDTO) {
        // 채팅방 ID로 Chats 객체를 데이터베이스에서 조회
        Chats chat = chatsRepository.findById(chatMessagesDTO.getChatId())
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        // ChatMessages 객체 생성
        ChatMessages chatMessage = new ChatMessages();

        // setChatInfo 메서드를 사용하여 값을 설정
        chatMessage.setChatInfo(chat, chatMessagesDTO.getMemberId(), chatMessagesDTO.getContent());

        // 저장
        return chatMessagesRepository.save(chatMessage);
    }


    @Override
    public List<ChatMessages> getMessagesByChatId(Long chatId) {
        return chatMessagesRepository.findByChatChatId(chatId);
    }
}
