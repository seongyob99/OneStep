package com.onestep.back.dto.goal;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.onestep.back.dto.member.MemberDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GoalDTO {
    private Long goalId;
    private String title; // 목표 제목
    private String description; // 목표 설명
    private String categoryName; // 카테고리 이름
    private String rule; // 인증 규칙
    private Long certCycle; // 인증 주기
    private String thumbnail; // 업로드된 파일 경로
    private String memberId; // 멤버아이디
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private Long categoryId;
    private Long participants;
    private Long currentParticipants; // ✅ 현재 참가 인원
    private List<MemberDTO> members; // ✅ 현재 참가 인원 리스트

    private MultipartFile file; // 업로드된 파일
}
