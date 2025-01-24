package com.onestep.back.controller.chat;

import com.onestep.back.dto.chat.ChatsDTO;
import com.onestep.back.service.chat.ChatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ChatsController {

    private final ChatsService chatsService;

    @GetMapping
    public List<ChatsDTO> getAllChats() {
        return chatsService.getAllChats();
    }

    @GetMapping("/{chatId}")
    public ChatsDTO getChatById(@PathVariable Long chatId) {
        return chatsService.getChatById(chatId);
    }
}
