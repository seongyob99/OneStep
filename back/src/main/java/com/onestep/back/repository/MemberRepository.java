package com.onestep.back.repository;

import com.onestep.back.domain.Members;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Members, String> {
    // 이메일로 회원 조회
    Optional<Members> findByEmail(String email);

    // 이름으로 회원 조회
    Optional<Members> findByName(String name);
}
