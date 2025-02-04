package com.onestep.back.dto.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberDTO {
    private String memberId; // Long → String으로 변경
    private String name;
    private String email;
    private String password;
    private String phone;
    private String birth;
    private String sex;
    private boolean social;
}
