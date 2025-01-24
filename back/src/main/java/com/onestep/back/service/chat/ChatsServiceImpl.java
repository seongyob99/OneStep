package com.onestep.back.service.chat;

import com.onestep.back.domain.Members;
import com.onestep.back.dto.chat.ChatsDTO;
import com.onestep.back.repository.chat.ChatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatsServiceImpl implements ChatsService {

    private final ChatsRepository chatsRepository;

    @Override
    public List<ChatsDTO> getAllChats() {
        // 모든 채팅방 정보를 가져와서 DTO로 변환
        return chatsRepository.findAll()
                .stream()
                .map(chat -> new ChatsDTO(
                        chat.getChatId(), // 채팅방 ID
                        chat.getChatName(), // 채팅방 이름
                        chat.getMembers().stream() // 멤버들의 ID 목록
                                .map(Members::getMemberId) // Member 객체에서 memberId 추출
                                .collect(Collectors.toList()) // List로 수집
                ))
                .collect(Collectors.toList());
    }

    @Override
    public ChatsDTO getChatById(Long chatId) {
        return chatsRepository.findById(chatId)
                .map(chat -> new ChatsDTO(
                        chat.getChatId(), // 채팅방 ID
                        chat.getChatName(), // 채팅방 이름
                        chat.getMembers().stream() // 채팅방에 속한 멤버들의 ID를 추출
                                .map(Members::getMemberId) // Member 객체에서 memberId 추출
                                .collect(Collectors.toList()) // List로 수집
                ))
                .orElseThrow(() -> new RuntimeException("Chat not found"));
    }
}
