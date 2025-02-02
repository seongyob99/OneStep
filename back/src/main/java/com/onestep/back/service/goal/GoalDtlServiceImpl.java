package com.onestep.back.service.goal;

import com.onestep.back.domain.Certifications;
import com.onestep.back.domain.Goals;
import com.onestep.back.dto.GoalDTO;
import com.onestep.back.dto.goal.CertDTO;
import com.onestep.back.dto.goal.GoalDtlDTO;
import com.onestep.back.repository.MemberRepository;
import com.onestep.back.repository.goal.CertRepository;
import com.onestep.back.repository.goal.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalDtlServiceImpl implements GoalDtlService{

    @Value("${com.onestep.upload.path}")
    private String uploadPath;

    private final GoalRepository goalRepository;
    private final CertRepository certRepository;
    private final MemberRepository memberRepository;
    private final ModelMapper modelMapper;

    // 목표 상세 및 참여 정보 조회
    @Override
    public GoalDtlDTO getGoalInfo(Long goalId) {
        return goalRepository.getGoalInfo(goalId);
    }

    // 최근 인증 기록 탑4 조회
    @Override
    public List<CertDTO> getRecentCert(Long goalId) {
        Pageable pageable = PageRequest.of(0, 4);
        List<Certifications> certifications = certRepository.findRecentCertificationsByGoalId(goalId, pageable);

        return certifications.stream()
                .map(cert -> modelMapper.map(cert, CertDTO.class))
                .collect(Collectors.toList());
    }

    // 목표 참가
    @Override
    public void joinGoal(GoalDTO goalDTO) {
        Goals goal = goalRepository.findById(goalDTO.getGoalId()).orElseThrow();
        // 새 멤버 추가
        goal.getMembers().add(
                memberRepository.findById(goalDTO.getMemberId()).orElseThrow()
        );
        goalRepository.save(goal);
    }

    // 목표 내보내기, 그만두기
    @Override
    public void removeMember(GoalDTO goalDTO) {
        Goals goal = goalRepository.findById(goalDTO.getGoalId()).orElseThrow();
        // 인증 정보 삭제
        List<Certifications> delCert = certRepository.findByGoalGoalIdAndMemberMemberId(goal.getGoalId(), goalDTO.getMemberId());
        for (Certifications cert : delCert) {
            // 파일 삭제
            if (cert.getFilePath() != null) {
                String filePath = uploadPath + "\\" + cert.getFilePath();
                File file = new File(filePath);
                if (file.exists()) {
                    file.delete();
                }
            }
        }
        certRepository.deleteAll(delCert);
        // 멤버 삭제
        goal.getMembers().remove(
                memberRepository.findById(goalDTO.getMemberId()).orElseThrow()
        );
        goalRepository.save(goal);
    }
}
