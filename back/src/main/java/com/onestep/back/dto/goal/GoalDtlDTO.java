package com.onestep.back.dto.goal;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.onestep.back.dto.upload.CertificationsDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GoalDtlDTO {

    private Long goalId;
    private String title;
    private String description;
    private String categoryName;
    private String rule;
    private Long certCycle;
    private String adminMemberId;
    private String adminMemberName;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private Long participants;
    private String thumbnail;
    private List<CertificationsDTO> members;
}
