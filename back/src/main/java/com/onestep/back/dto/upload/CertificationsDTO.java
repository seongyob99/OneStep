package com.onestep.back.dto.upload;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

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

    private MultipartFile file;

    private String uuid;

    private String fileName;

    private boolean img;
}