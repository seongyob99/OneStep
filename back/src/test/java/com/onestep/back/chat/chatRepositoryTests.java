package com.onestep.back.chat;

import com.onestep.back.domain.Chats;
import com.onestep.back.repository.chat.ChatMessagesRepository;
import com.onestep.back.repository.chat.ChatsRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Log4j2
@SpringBootTest
public class chatRepositoryTests {

    @Autowired
    private ChatsRepository chatsRepository;
    @Autowired
    private ChatMessagesRepository chatMessagesRepository;


    @Test
    @Transactional
    public void testChatsRepository() {
        log.info(chatsRepository.findAll());
    }

    @Test
    public void testChatMessagesRepository() {
        log.info(chatMessagesRepository.findAll());
    }

}
