package com.onestep.back.dto.goal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CertDTO {
    private Long goalId;
    private String memberId;
    private String name;
    private Long certCnt;
    private String filePath;
}
