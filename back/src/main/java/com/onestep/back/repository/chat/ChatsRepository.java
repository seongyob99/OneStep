package com.onestep.back.repository.chat;

import com.onestep.back.domain.Chats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatsRepository extends JpaRepository<Chats, Long> {
}
