package com.onestep.back.service.goal;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.onestep.back.dto.goal.GoalDTO;
import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.domain.Categories;
import com.onestep.back.domain.Goals;
import com.onestep.back.domain.Members;
import com.onestep.back.domain.Chats;
import com.onestep.back.repository.member.MemberRepository;
import com.onestep.back.repository.category.CategoriesRepository;
import com.onestep.back.repository.goal.GoalRepository;
import com.onestep.back.repository.chat.ChatsRepository;

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
        log.info("🔍 목표 목록 조회 실행: categoryId={}, title={}", categoryId, title);
        List<Goals> goals = (categoryId != null) ?
                goalRepository.findByCategoryCategoryIdAndTitleContaining(categoryId, title == null ? "" : title) :
                goalRepository.findByTitleContaining(title == null ? "" : title);

        log.info("📌 조회된 목표 개수: {}", goals.size());
        return goals.stream().map(goal -> GoalDTO.builder()
                .goalId(goal.getGoalId())
                .title(goal.getTitle())
                .description(goal.getDescription())
                .rule(goal.getRule())
                .certCycle(goal.getCertCycle())
                .startDate(goal.getStartDate())
                .endDate(goal.getEndDate())
                .participants(goal.getParticipants())
                .currentParticipants((long) goal.getMembers().size()) // ✅ 참가자 수 포함
                .categoryId(goal.getCategory().getCategoryId())
                .categoryName(goal.getCategory().getCateName())
                .memberId(goal.getAdminMember().getMemberId())
                .thumbnail(goal.getThumbnail())
                .members(goal.getMembers() != null
                        ? goal.getMembers().stream()
                        .map(m -> MemberDTO.builder()
                                .memberId(m.getMemberId())
                                .name(m.getName())
                                .build())
                        .collect(Collectors.toList())
                        : List.of()) // 빈 리스트 반환
                .build()
        ).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public Long register(GoalDTO goalDTO) {
        log.info("🚀 목표 등록 요청: {}", goalDTO);

        // ✅ memberId 하드코딩 유지
        if (goalDTO.getMemberId() == null || goalDTO.getMemberId().trim().isEmpty()) {
            goalDTO.setMemberId("user01");
        }
        log.info("✅ memberId 확인 후: {}", goalDTO.getMemberId());

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
                .thumbnail(goalDTO.getThumbnail())
                .build();

        Goals savedGoal = goalRepository.save(goal);
        log.info("✅ 목표 저장 완료: ID={}", savedGoal.getGoalId());

        goalRepository.addMemberToGoal(savedGoal.getGoalId(), goalDTO.getMemberId());
        log.info("✅ 목표 참가 완료 (goals_members): {}", goalDTO.getMemberId());

        Goals updatedGoal = goalRepository.findByIdWithMembers(savedGoal.getGoalId());


        Chats chatRoom = Chats.builder()
                .goal(savedGoal)
                .chatName(savedGoal.getTitle() + " 채팅방")
                .build();

        chatsRepository.save(chatRoom);
        log.info("✅ 채팅방 생성 완료");

        return savedGoal.getGoalId();
    }
}
