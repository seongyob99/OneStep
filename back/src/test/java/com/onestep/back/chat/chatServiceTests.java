package com.onestep.back.chat;

import com.onestep.back.service.chat.ChatMessagesService;
import com.onestep.back.service.chat.ChatService;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@SpringBootTest
public class chatServiceTests {
    @Autowired
    private ChatService chatService;
    @Autowired
    private ChatMessagesService chatMessagesService;


    @Test
    public void testChatService() {
        log.info(chatService.getAllChats());
    }

    @Test
    @Transactional
    public void testChatMessagesService() {
        log.info(chatService.getMemberCountByChatId(1L));
    }


}
