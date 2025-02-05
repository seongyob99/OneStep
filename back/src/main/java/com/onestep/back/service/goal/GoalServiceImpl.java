package com.onestep.back.service.goal;

import com.onestep.back.domain.Categories;
import com.onestep.back.domain.Chats;
import com.onestep.back.domain.Goals;
import com.onestep.back.domain.Members;
import com.onestep.back.dto.goal.GoalDTO;
import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.repository.category.CategoriesRepository;
import com.onestep.back.repository.chat.ChatsRepository;
import com.onestep.back.repository.goal.GoalRepository;
import com.onestep.back.repository.member.MemberRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    private static final String uploadPath = "c:\\upload\\onestep";

    private final GoalRepository goalRepository;
    private final ModelMapper modelMapper;
    private final MemberRepository memberRepository;
    private final CategoriesRepository categoriesRepository;
    private final ChatsRepository chatsRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<GoalDTO> getList(Long categoryId, String title) {
        List<Goals> goals = (categoryId != null) ?
                goalRepository.findByCategoryCategoryIdAndTitleContaining(categoryId, title == null ? "" : title) :
                goalRepository.findByTitleContaining(title == null ? "" : title);

        return goals.stream().map(goal -> GoalDTO.builder()
                .goalId(goal.getGoalId())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .rule(goal.getRule())
                .certCycle(goal.getCertCycle())
                .startDate(goal.getStartDate())
                .endDate(goal.getEndDate())
                .participants(goal.getParticipants())
                .categoryId(goal.getCategory().getCategoryId())
                .categoryName(goal.getCategory().getCateName())
                .memberId(goal.getAdminMember().getMemberId())
                .thumbnail(goal.getThumbnail())
                .members(goal.getMembers().stream() // null 체크 제거
                        .map(m -> MemberDTO.builder()
                                .memberId(m.getMemberId())
                                .name(m.getName())
                                .build())
                        .collect(Collectors.toList()))
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public Long register(GoalDTO goalDTO) {

        // ✅ memberId 하드코딩 유지
        if (goalDTO.getMemberId() == null || goalDTO.getMemberId().trim().isEmpty()) {
            goalDTO.setMemberId("user01");
        }

        Categories category = categoriesRepository.findById(goalDTO.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("❌ Invalid category ID: " + goalDTO.getCategoryId()));

        Members member = memberRepository.findById(goalDTO.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("❌ Invalid member ID: " + goalDTO.getMemberId()));

        Goals goal = Goals.builder()
                .title(goalDTO.getTitle())
                .description(goalDTO.getDescription())
                .rule(goalDTO.getRule())
                .certCycle(goalDTO.getCertCycle())
                .category(category)
                .adminMember(member)
                .startDate(goalDTO.getStartDate())
                .endDate(goalDTO.getEndDate())
                .participants(goalDTO.getParticipants())
                .members(List.of(member))
                .thumbnail(goalDTO.getThumbnail())
                .build();

        Goals savedGoal = goalRepository.save(goal);


        Chats chatRoom = Chats.builder()
                .goal(savedGoal)
                .chatName(savedGoal.getTitle())
                .members(List.of(member))
                .build();

        chatsRepository.save(chatRoom);

        return savedGoal.getGoalId();
    }
}
