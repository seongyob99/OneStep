package com.onestep.back.controller.chat;

import com.onestep.back.domain.ChatMessages;
import com.onestep.back.domain.Chats;
import com.onestep.back.service.chat.ChatMessagesService;
import com.onestep.back.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Log4j2
public class ChatController {
    private final ChatMessagesService chatMessagesService;
    private final ChatService chatService;

    @PostMapping("/{chatId}/messages")
    public ResponseEntity<String> saveMessage(@PathVariable Long chatId,
                                              @RequestParam String memberId,
                                              @RequestParam String content) {
        chatMessagesService.saveMessage(chatId, memberId, content);
        return ResponseEntity.ok("Message saved successfully");
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<ChatMessages>> getMessages(@PathVariable Long chatId) {
        List<ChatMessages> messages = chatMessagesService.getMessages(chatId);
        return ResponseEntity.ok(messages);
    }

    // 채팅방 리스트 가져오기
    @GetMapping("/list")
    public ResponseEntity<List<Chats>> getChatList() {
        List<Chats> chatList = chatService.getAllChats();
        log.info("chatList"+chatList);
        return ResponseEntity.ok(chatList);
    }
}
