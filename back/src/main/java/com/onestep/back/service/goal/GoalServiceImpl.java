package com.onestep.back.service.goal;

import com.onestep.back.domain.Categories;
import com.onestep.back.domain.Goals;
import com.onestep.back.domain.Members;
import com.onestep.back.dto.GoalDTO;
import com.onestep.back.repository.MemberRepository;
import com.onestep.back.repository.category.CategoriesRepository;
import com.onestep.back.repository.goal.GoalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final ModelMapper modelMapper;
    private final MemberRepository memberRepository;
    private final CategoriesRepository categoriesRepository;

    @Override
    public List<GoalDTO> getList(String categoryName, String title) {
        List<Goals> goals = (categoryName == null || categoryName.isEmpty()) && (title == null || title.isEmpty())
                ? goalRepository.findAll()
                : goalRepository.findByCategoryCateNameContainingAndTitleContaining(
                categoryName == null ? "" : categoryName,
                title == null ? "" : title
        );

        return goals.stream()
                .map(goal -> modelMapper.map(goal, GoalDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Long register(GoalDTO goalDTO) {
        log.info("🚀 목표 등록 요청: {}", goalDTO);

        // 🚨 categoryId가 null인지 체크
        Long categoryId = goalDTO.getCategoryId();
        if (categoryId == null) {
            throw new IllegalArgumentException("❌ Category ID is required.");
        }

        // 🚨 categoryId가 유효한지 체크
        Categories category = categoriesRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("❌ Invalid category ID: " + categoryId));

        // 🚨 memberId가 null인지 체크
        String memberId = goalDTO.getMemberId();
        if (memberId == null) {
            throw new IllegalArgumentException("❌ Member ID is required.");
        }

        // 🚨 memberId가 유효한지 체크
        Members adminMember = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("❌ Invalid member ID: " + memberId));

        // 🚀 Goal 객체 생성
        Goals goal = Goals.builder()
                .title(goalDTO.getTitle() != null ? goalDTO.getTitle() : "제목 없음")  // null 방지
                .description(goalDTO.getDescription() != null ? goalDTO.getDescription() : "설명 없음")  // null 방지
                .rule(goalDTO.getRule() != null ? goalDTO.getRule() : "기본 규칙")  // null 방지
                .certCycle(goalDTO.getCertCycle())
                .category(category)
                .adminMember(adminMember)
                .startDate(goalDTO.getStartDate())
                .endDate(goalDTO.getEndDate())
                .participants(goalDTO.getParticipants() > 0 ? goalDTO.getParticipants() : 1) // 최소 1명 설정
                .build();

        // 🚀 저장
        Goals savedGoal = goalRepository.save(goal);
        log.info("✅ 목표 저장 완료: ID={}", savedGoal.getGoalId());

        return savedGoal.getGoalId();
    }



    @Override
    public void join(Long goalId, Long memberId) {
        log.info("목표 참가 요청: goalId={}, memberId={}", goalId, memberId);
        // 참가 로직 추가 (Goal_Members 테이블에 데이터 삽입 로직 필요)
    }

    @Override
    public Long update(GoalDTO goalDTO) {
        Goals existingGoal = goalRepository.findById(goalDTO.getGoalId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 목표입니다."));
        modelMapper.map(goalDTO, existingGoal); // 기존 데이터 업데이트
        Goals updatedGoal = goalRepository.save(existingGoal);
        return updatedGoal.getGoalId();
    }

    @Override
    public void delete(Long goalId) {
        goalRepository.deleteById(goalId);
    }
}