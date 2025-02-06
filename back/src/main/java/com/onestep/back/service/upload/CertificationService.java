package com.onestep.back.service.upload;


import com.onestep.back.domain.Certifications;
import com.onestep.back.dto.upload.CertificationsDTO;
import org.springframework.beans.factory.annotation.Value;


import java.time.LocalDate;
import java.util.List;


public interface CertificationService {

    @Value("${com.onestep.server.url}") // ✅ 서버 URL을 인터페이스에서 사용할 경우 static final로 정의
    String serverUrl = "http://localhost:8080"; // ⚠ 환경 변수를 직접 사용할 수 없으므로 기본값 설정 필요


    // 인증사진 등록 /오늘만
    void register(CertificationsDTO dto);

    // 복합키(목표ID, 회원ID, 인증날짜)를 이용한 인증사진 상세 조회하기 / 사용전
    CertificationsDTO read(Long goalId, String memberId, LocalDate certDate);

    // 인증 수정 / 오늘 날짜의 인증만 수정 가능, 수정 시 파일 경로만 변경한다고 가정했을때 / 업로드 횟수 제한후 삭제하고 재업로드할지 고민중
    void update(CertificationsDTO dto);

    // 인증 삭제 / 오늘 날짜 인증사진만 삭제가능 / 로그인된 나랑 방장만 삭제가능
    void delete(Long goalId, String targetMemberId, LocalDate certDate, String currentMemberId);

    // 특정 목표에 해당하는 전체 인증 목록 조회 (날짜 내림차순 정렬) /
//    List<CertificationsDTO> listByGoal(Long goalId);

    List<CertificationsDTO> listByGoalAndDate(Long goalId, LocalDate certDate);
    // Entity > DTO
    default CertificationsDTO entityToDto(Certifications certification) {
        return CertificationsDTO.builder()
                .goalId(certification.getGoal().getGoalId())
                .memberId(certification.getMember().getMemberId())
                .certDate(certification.getCertDate())
                .filePath(certification.getFilePath())
                .build();
    }
    // DTO  > Entity
    default Certifications dtoToEntity(CertificationsDTO dto) {
        return Certifications.builder()
                .certDate(dto.getCertDate())
                .filePath(dto.getFilePath())
                .build();
    }


}