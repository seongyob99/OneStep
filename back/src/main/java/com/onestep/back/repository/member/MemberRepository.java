package com.onestep.back.repository.member;

import com.onestep.back.domain.Members;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Members, String> {
    Optional<Members> findByMemberId(String memberId);

}
