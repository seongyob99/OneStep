package com.onestep.back.service.member;

import com.onestep.back.dto.member.MemberDTO;

public interface MemberService {
    MemberDTO getMemberById(String memberId); // 기본 키 타입을 String으로 수정
    void updateMember(String memberId, MemberDTO memberDTO); // 기본 키 타입을 String으로 수정
    static class MidExistException extends Exception {
    }
    MemberDTO join(MemberDTO memberDTO) throws MidExistException;
}
