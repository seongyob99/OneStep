package com.onestep.back.service.member;

import com.onestep.back.dto.member.MemberDTO;

import java.util.List;

public interface MemberService {
    MemberDTO getMemberById(String memberId); // 기본 키 타입을 String으로 수정
    void updateMember(String memberId, MemberDTO memberDTO); // 기본 키 타입을 String으로 수정

    void deleteMember(String memberId);

    List<String> getMemberGoals(String memberId);
}
