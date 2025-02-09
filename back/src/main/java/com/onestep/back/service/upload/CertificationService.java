package com.onestep.back.service.upload;


import com.onestep.back.domain.Certifications;
import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.dto.upload.CertificationsDTO;
import org.springframework.beans.factory.annotation.Value;


import java.time.LocalDate;
import java.util.List;


public interface CertificationService {

    @Value("${com.onestep.server.url}") // 서버 URL을 인터페이스에서 사용할 경우 static final로 정의
    String serverUrl = "http://localhost:8080"; // 환경 변수를 직접 사용할 수 없으므로 기본값 설정 필요

    // 조회
    List<MemberDTO> Alllist(Long goalId);

    // 등록
    void register(CertificationsDTO dto);

    // 삭제
    void delete(Long goalId, String targetMemberId, LocalDate certDate, String currentMemberId);
}