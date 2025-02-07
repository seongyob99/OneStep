package com.onestep.back.service.upload;


import com.onestep.back.domain.CertificationId;
import com.onestep.back.domain.Certifications;
import com.onestep.back.domain.Goals;
import com.onestep.back.domain.Members;
import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.dto.upload.CertificationsDTO;
import com.onestep.back.repository.member.MemberRepository;
import com.onestep.back.repository.upload.CertificationsRepository;

import com.onestep.back.repository.goal.GoalRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class CertificationServiceImpl implements CertificationService {

    private final CertificationsRepository certificationsRepository;
    private final GoalRepository goalsRepository;
    private final MemberRepository membersRepository;

    @Override
    public void register(CertificationsDTO dto) {


        // 인증 등록은 오늘 날짜만 허용
        if (!dto.getCertDate().equals(LocalDate.now())) {
            throw new RuntimeException("인증 등록은 오늘 날짜에만 가능합니다.");
        }

        log.info("service goalId확인 : "+ dto.getGoalId());
        // 중복 등록 체크: 동일 목표, 동일 회원, 동일 날짜의 인증이 존재하는지 확인하기 // 아님 수정기능 ?
        Goals goal = goalsRepository.findById(dto.getGoalId())
                .orElseThrow(() -> new RuntimeException("목표를 찾을 수 없습니다."));
        Members member = membersRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        CertificationId cid = new CertificationId(goal.getGoalId(), member.getMemberId(), dto.getCertDate());

        LocalDate certDate = dto.getCertDate();
        LocalDate startDate = goal.getStartDate();

        // 1일 1사진
        if (certificationsRepository.findById(cid).isPresent()) {
            throw new RuntimeException("이미 해당 날짜에 인증이 등록되어 있습니다.");
        }
        // 시작일 이전이면 업로드 안됨
        if (certDate.isBefore(startDate)) {
            throw new RuntimeException("인증일은 목표 시작일 이후여야 합니다.");
        }

        // 종료일이 설정되어 있고 인증일이 종료일 이후이면 업로드 안됨
        if (goal.getEndDate() != null && certDate.isAfter(goal.getEndDate())) {
            throw new RuntimeException("인증일은 목표 종료일 이전이어야 합니다.");
        }

        // 인증 주기 체크: 목표 시작일과 인증일 사이의 일수 차이가 목표의 인증 주기로 나누어 떨어져야 함
        long diffDays = ChronoUnit.DAYS.between(startDate, certDate);
        if (diffDays % goal.getCertCycle() != 0) {
            throw new RuntimeException("인증일은 인증 주기에 맞지 않습니다.");
        }

        //불변성 유지, 새 인스턴스 생성
        Certifications certification = Certifications.builder()
                .goal(goal)
                .member(member)
                .certDate(dto.getCertDate())
                .filePath(dto.getFilePath())
                .build();

        certificationsRepository.save(certification);
    }

    @Override
    public CertificationsDTO read(Long goalId, String memberId, LocalDate certDate) {
        Goals goal = goalsRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("목표를 찾을 수 없습니다."));
        Members member = membersRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        CertificationId cid = new CertificationId(goal.getGoalId(), member.getMemberId(), certDate);
        Certifications certification = certificationsRepository.findById(cid)
                .orElseThrow(() -> new RuntimeException("인증 정보를 찾을 수 없습니다."));
        return entityToDto(certification);
    }

    @Override
    public void update(CertificationsDTO dto) {
        // 수정은 오늘 날짜의 인증만 가능 / 로그인한 본인만
        Goals goal = goalsRepository.findById(dto.getGoalId())
                .orElseThrow(() -> new RuntimeException("목표를 찾을 수 없습니다."));
        Members member = membersRepository.findById(dto.getMemberId())
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));
        CertificationId cid = new CertificationId(goal.getGoalId(), member.getMemberId(), dto.getCertDate());
        Certifications certification = certificationsRepository.findById(cid)
                .orElseThrow(() -> new RuntimeException("인증 정보를 찾을 수 없습니다."));

        if (!certification.getCertDate().equals(LocalDate.now())) {
            throw new RuntimeException("오늘의 인증만 수정할 수 있습니다.");
        }

        // 불변성을 유지, 새 인스턴ㅅ,생성 해서 업데이트
        Certifications updated = Certifications.builder()
                .goal(certification.getGoal())
                .member(certification.getMember())
                .certDate(certification.getCertDate())
                .filePath(dto.getFilePath()) // 변경할 파일 경로
                .build();
        certificationsRepository.save(updated);
    }

    @Override
    public void delete(Long goalId, String targetMemberId, LocalDate certDate, String currentMemberId) {
        // 목표 조회
        Goals goal = goalsRepository.findById(goalId)
                .orElseThrow(() -> new RuntimeException("목표를 찾을 수 없습니다."));
        // 인증사진 업로드한 멤버 조회
        Members targetMember = membersRepository.findById(targetMemberId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        CertificationId cid = new CertificationId(goal.getGoalId(), targetMember.getMemberId(), certDate);
        Certifications certification = certificationsRepository.findById(cid)
                .orElseThrow(() -> new RuntimeException("인증 정보를 찾을 수 없습니다."));

        // 오늘날짜 인증사진만 삭제하는 조건
        if (!certification.getCertDate().equals(LocalDate.now())) {
            throw new RuntimeException("오늘의 인증만 삭제할 수 있습니다.");
        }

        // 업로드한 본인과 목표 방장만 삭제 가능하도록 권한 체크
        if (!currentMemberId.equals(targetMember.getMemberId()) &&
                !currentMemberId.equals(goal.getAdminMember().getMemberId())) {
            throw new RuntimeException("삭제 권한이 없습니다.");
        }

        certificationsRepository.delete(certification);
    }

    public List<MemberDTO> Alllist(Long goalId) {

        return  certificationsRepository.getCertInfo(goalId);// ✅ 인터페이스의 default 메서드 호출
    }


        public List<CertificationsDTO> listByAll(Long goalId, String memberId, LocalDate certDate) {
        // 인증 데이터 확인후 가져오기
        List<Certifications> list = (certDate != null) ?
                certificationsRepository.findByGoalIdAndCertDate(goalId, certDate) :
                certificationsRepository.findByGoal_Id(goalId);

        return list.stream()
                .map(cert -> {
                    CertificationsDTO dto = entityToDto(cert);
                    dto.setName(cert.getMember().getName());  // DTO의 name 필드에 회원 이름 저장
                    return dto;
                })
                .collect(Collectors.toList());
    }
}