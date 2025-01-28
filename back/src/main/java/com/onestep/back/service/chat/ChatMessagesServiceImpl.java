package com.onestep.back.service.chat;

import com.onestep.back.domain.ChatMessages;
import com.onestep.back.domain.Chats;
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
    public List<ChatMessages> getMessages(Long chatId) {
        return chatMessagesRepository.findBychat_ChatId(chatId);
    }
}
