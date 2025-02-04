package com.onestep.back.service.goal;

import com.onestep.back.domain.*;
import com.onestep.back.dto.goal.GoalDTO;
import com.onestep.back.dto.upload.CertificationsDTO;
import com.onestep.back.dto.goal.GoalDtlDTO;
import com.onestep.back.repository.category.CategoriesRepository;
import com.onestep.back.repository.chat.ChatsRepository;
import com.onestep.back.repository.member.MemberRepository;
import com.onestep.back.repository.upload.CertificationsRepository;
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
    private final CertificationsRepository certRepository;
    private final MemberRepository memberRepository;
    private final ChatsRepository chatsRepository;
    private final CategoriesRepository cateRepository;
    private final ModelMapper modelMapper;

    // 목표 상세 및 참여 정보 조회
    @Override
    public GoalDtlDTO getGoalInfo(Long goalId) {
        return goalRepository.getGoalInfo(goalId);
    }

    // 최근 인증 기록 탑4 조회
    @Override
    public List<CertificationsDTO> getRecentCert(Long goalId) {
        Pageable pageable = PageRequest.of(0, 4);
        List<Certifications> certifications = certRepository.findRecentCertificationsByGoalId(goalId, pageable);

        return certifications.stream()
                .map(cert -> modelMapper.map(cert, CertificationsDTO.class))
                .collect(Collectors.toList());
    }

    // 목표 참가
    @Override
    public void joinGoal(GoalDTO goalDTO) {
        Goals goal = goalRepository.findById(goalDTO.getGoalId()).orElseThrow();
        Members adminMember = memberRepository.findById(goalDTO.getMemberId()).orElseThrow();
        // 채팅방 추가
        chatsRepository.save(Chats.builder()
                .goal(goal)
                .chatName(goalDTO.getTitle())
                .members(List.of(adminMember))
                .build()
        );
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

    // 목표 수정
    @Override
    public void updateGoal(GoalDTO goalDTO) {
        Goals goal = goalRepository.findById(goalDTO.getGoalId()).orElseThrow();
        Categories category = cateRepository.findById(goalDTO.getCategoryId()).orElseThrow();
        goal.changeGoal(goalDTO, category);
        goalRepository.save(goal);
    }

    // 목표 삭제
    @Override
    public void deleteGoal(Long goalId) {
        goalRepository.deleteById(goalId);
    }
}
