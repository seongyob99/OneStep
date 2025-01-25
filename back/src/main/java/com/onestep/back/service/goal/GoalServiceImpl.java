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
        // 카테고리와 제목 필터링 조건에 따른 조회 로직
        return goalRepository.findAll().stream() // 검색 조건 추가 가능
                .map(entity -> modelMapper.map(entity, GoalDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Long register(GoalDTO goalDTO) {
        // 1. DTO에서 categoryId 가져오기
        Long categoryId = goalDTO.getCategoryId();
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID is required.");
        }

        // 2. Categories 엔티티 조회
        Categories category = categoriesRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID: " + categoryId));

        // 3. Members 엔티티 조회 (adminMember 처리)
        String memberId = goalDTO.getMemberId();
        Members adminMember = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid member ID: " + memberId));

        // 4. Goals 객체 생성
        Goals goal = Goals.builder()
                .title(goalDTO.getTitle())
                .description(goalDTO.getDescription())
                .rule(goalDTO.getRule())
                .certCycle(goalDTO.getCertCycle())
                .category(category) // Categories 매핑
                .adminMember(adminMember) // Members 매핑
                .startDate(goalDTO.getStartDate())
                .endDate(goalDTO.getEndDate())
                .participants(goalDTO.getParticipants())
                .build();

        // 5. 저장
        Goals savedGoal = goalRepository.save(goal);
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