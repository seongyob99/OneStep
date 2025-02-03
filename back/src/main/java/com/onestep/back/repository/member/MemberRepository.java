package com.onestep.back.repository.member;

import com.onestep.back.domain.Members;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Members, String> {

}
