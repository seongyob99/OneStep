package com.onestep.back.dto.upload;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CertificationsDTO {

    @NotNull
    private Long goalId;

    @NotNull
    private String memberId;

    private String name;

    @NotNull
    @FutureOrPresent
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate certDate;

    @NotNull
    private String filePath;

    private Long certCnt;
}