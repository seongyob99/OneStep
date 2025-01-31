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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private final GoalRepository goalRepository;
    private final ModelMapper modelMapper;
    private final MemberRepository memberRepository;
    private final CategoriesRepository categoriesRepository;

    // 📌 목표 목록 조회 (페이징 적용)
    @Override
    public Page<GoalDTO> getPagedList(String categoryName, String title, Pageable pageable) {
        Page<Goals> goalsPage = goalRepository.findByCategoryCateNameContainingAndTitleContaining(
                categoryName == null ? "" : categoryName,
                title == null ? "" : title,
                pageable
        );

        return goalsPage.map(goal -> modelMapper.map(goal, GoalDTO.class));
    }

    @Override
    public Long register(GoalDTO goalDTO) {
        log.info("🚀 목표 등록 요청: {}", goalDTO);

        Long categoryId = goalDTO.getCategoryId();
        if (categoryId == null) {
            throw new IllegalArgumentException("❌ Category ID is required.");
        }

        Categories category = categoriesRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("❌ Invalid category ID: " + categoryId));

        String memberId = goalDTO.getMemberId();
        if (memberId == null) {
            throw new IllegalArgumentException("❌ Member ID is required.");
        }

        Members adminMember = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("❌ Invalid member ID: " + memberId));

        Goals goal = Goals.builder()
                .title(goalDTO.getTitle() != null ? goalDTO.getTitle() : "제목 없음")
                .description(goalDTO.getDescription() != null ? goalDTO.getDescription() : "설명 없음")
                .rule(goalDTO.getRule() != null ? goalDTO.getRule() : "기본 규칙")
                .certCycle(goalDTO.getCertCycle())
                .category(category)
                .adminMember(adminMember)
                .startDate(goalDTO.getStartDate())
                .endDate(goalDTO.getEndDate())
                .participants(goalDTO.getParticipants() > 0 ? goalDTO.getParticipants() : 1)
                .build();

        Goals savedGoal = goalRepository.save(goal);
        log.info("✅ 목표 저장 완료: ID={}", savedGoal.getGoalId());

        return savedGoal.getGoalId();
    }

    @Override
    public void join(Long goalId, Long memberId) {
        log.info("목표 참가 요청: goalId={}, memberId={}", goalId, memberId);
    }

    @Override
    public Long update(GoalDTO goalDTO) {
        Goals existingGoal = goalRepository.findById(goalDTO.getGoalId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 목표입니다."));
        modelMapper.map(goalDTO, existingGoal);
        Goals updatedGoal = goalRepository.save(existingGoal);
        return updatedGoal.getGoalId();
    }

    @Override
    public void delete(Long goalId) {
        goalRepository.deleteById(goalId);
    }
}
