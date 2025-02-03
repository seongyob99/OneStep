package com.onestep.back.controller.member;

import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    // 1. 회원 정보 조회
    @GetMapping("/{memberId}")
    public ResponseEntity<MemberDTO> getMember(@PathVariable String memberId) {
        MemberDTO member = memberService.getMemberById(memberId);
        return ResponseEntity.ok(member);
    }

    // 2. 회원 정보 수정 (memberId 제거)
    @PutMapping("/update")
    public ResponseEntity<String> updateMember(@RequestBody MemberDTO memberDTO) {
        memberService.updateMember(memberDTO.getMemberId(), memberDTO);
        return ResponseEntity.ok("회원 정보가 수정되었습니다.");
    }
}