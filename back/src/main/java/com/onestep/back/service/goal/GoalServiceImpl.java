package com.onestep.back.service.goal;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.onestep.back.dto.goal.GoalDTO;
import com.onestep.back.domain.Categories;
import com.onestep.back.domain.Goals;
import com.onestep.back.domain.Members;
import com.onestep.back.repository.member.MemberRepository;
import com.onestep.back.repository.category.CategoriesRepository;
import com.onestep.back.repository.goal.GoalRepository;

@Log4j2
@Service
@RequiredArgsConstructor
public class GoalServiceImpl implements GoalService {

    // 파일 업로드 경로
    private static final String uploadPath = "c:\\upload\\onestep";

    private final GoalRepository goalRepository;
    private final ModelMapper modelMapper;
    private final MemberRepository memberRepository;
    private final CategoriesRepository categoriesRepository;


    // 목록 조회
    @Override
    public List<GoalDTO> getList(Long categoryId, String title) {
        log.info("🔍 getList 실행: categoryId={}, title={}", categoryId, title);
        List<Goals> goals;

        if (categoryId != null) {
            goals = goalRepository.findByCategoryCategoryIdAndTitleContaining(categoryId, title == null ? "" : title);
        } else {
            goals = goalRepository.findByTitleContaining(title == null ? "" : title);
        }

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
                .categoryId(goal.getCategory().getCategoryId())
                .memberId(goal.getAdminMember().getMemberId())
                .thumbnail(goal.getThumbnail())
                .build()).collect(Collectors.toList());
    }

    // 📌 목표 등록 (파일 업로드 포함)
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

        // 📌 목표 저장 (썸네일 포함)
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
                .thumbnail(goalDTO.getThumbnail())  // 📌 썸네일 파일명 저장
                .build();

        Goals savedGoal = goalRepository.save(goal);
        log.info("✅ 목표 저장 완료: ID={}, 썸네일={}", savedGoal.getGoalId(), savedGoal.getThumbnail());

        return savedGoal.getGoalId();
    }

    // 📂 파일 업로드 처리
    public void handleFileUpload(MultipartFile file, GoalDTO goalDTO) {
        if (file != null && !file.isEmpty()) {
            log.info("📂 파일 업로드 시작: {}", file.getOriginalFilename());

            // 파일명 생성
            String uuid = UUID.randomUUID().toString();
            String fileName = uuid + "_" + file.getOriginalFilename();
            Path savePath = Paths.get(uploadPath, fileName);

            log.info("📂 파일 저장 경로: {}", savePath);

            // 업로드 경로가 존재하지 않으면 생성
            Path uploadDir = Paths.get(uploadPath);
            if (Files.notExists(uploadDir)) {
                try {
                    Files.createDirectories(uploadDir);
                    log.info("📂 업로드 경로 생성 완료: {}", uploadDir);
                } catch (IOException e) {
                    log.error("업로드 디렉토리 생성 중 오류 발생: ", e);
                }
            }

            // 파일 저장
            try {
                file.transferTo(savePath);
                log.info("✅ 파일 저장 완료: {}", savePath);
            } catch (IOException e) {
                log.error("파일 업로드 중 오류 발생: ", e);
            }

            // 📌 DB에는 파일명만 저장
            goalDTO.setThumbnail(fileName);
            log.info("📂 goal.getThumbnail(): {}", goalDTO.getThumbnail());
        } else {
            log.info("📂 파일이 제공되지 않음.");
        }
    }
}
