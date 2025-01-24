package com.onestep.back.controller.chat;

import com.onestep.back.dto.chat.ChatMessagesDTO;
import com.onestep.back.service.chat.ChatMessagesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chatMessages")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ChatMessagesController {

    private final ChatMessagesService chatMessagesService;

    @PostMapping
    public ChatMessagesDTO sendMessage(@RequestBody ChatMessagesDTO chatMessagesDTO) {
        // 메시지를 전송하고, 반환할 DTO로 변환
        return chatMessagesService.sendMessage(chatMessagesDTO);
    }

    @GetMapping("/chat/{chatId}")
    public List<ChatMessagesDTO> getMessagesByChatId(@PathVariable Long chatId) {
        // 채팅방 ID로 메시지를 가져오고, DTO로 변환하여 반환
        return chatMessagesService.getMessagesByChatId(chatId)
                .stream()
                .map(chatMessage -> new ChatMessagesDTO(
                        chatMessage.getMessageId(),
                        chatMessage.getChat().getChatId(),
                        chatMessage.getMemberId(),
                        chatMessage.getContent(),
                        chatMessage.getCreatedAt() // 메시지 생성 시간도 반환 (선택 사항)
                ))
                .collect(Collectors.toList());
    }
}
