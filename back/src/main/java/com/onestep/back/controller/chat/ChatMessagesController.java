package com.onestep.back.controller.chat;

import com.onestep.back.domain.ChatMessages;
import com.onestep.back.dto.chat.ChatMessagesDTO;
import com.onestep.back.service.chat.ChatMessagesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chatMessages")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ChatMessagesController {

    private final ChatMessagesService chatMessagesService;

    @PostMapping
    public ChatMessages sendMessage(@RequestBody ChatMessagesDTO chatMessagesDTO) {
        return chatMessagesService.sendMessage(chatMessagesDTO);
    }

    @GetMapping("/chat/{chatId}")
    public List<ChatMessages> getMessagesByChatId(@PathVariable Long chatId) {
        return chatMessagesService.getMessagesByChatId(chatId);
    }
}