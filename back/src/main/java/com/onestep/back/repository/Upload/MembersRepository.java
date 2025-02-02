package com.onestep.back.repository.Upload;

import com.onestep.back.domain.Members;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MembersRepository extends JpaRepository<Members, String> {
}
