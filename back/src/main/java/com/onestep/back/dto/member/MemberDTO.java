package com.onestep.back.dto.member;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.onestep.back.dto.upload.CertificationsDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberDTO {
    private String memberId;
    private String name;
    private String email;
    private String password;
    private String phone;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate birth;
    private String sex;
    private boolean social;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    private LocalDate endDate;
    private Long certCycle;
    private List<CertificationsDTO> certdto;
    private String adminMemberId;
}