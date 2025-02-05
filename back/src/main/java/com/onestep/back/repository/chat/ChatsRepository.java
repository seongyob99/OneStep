package com.onestep.back.repository.chat;

import com.onestep.back.domain.Chats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatsRepository extends JpaRepository<Chats, Long> {
   Chats findByChatId(Long chatId);

   @Query("SELECT c FROM Chats c JOIN c.members m WHERE m.memberId = :memberId")
   List<Chats> findChatsByMemberId(@Param("memberId") String memberId);

}
