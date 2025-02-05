package com.onestep.back.controller.member;

import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/{memberId}")
    public ResponseEntity<MemberDTO> getMember(@PathVariable String memberId) {
        MemberDTO member = memberService.getMemberById(memberId);
        return ResponseEntity.ok(member);
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateMember(@RequestBody MemberDTO memberDTO) {
        memberService.updateMember(memberDTO.getMemberId(), memberDTO);
        return ResponseEntity.ok("회원 정보가 수정되었습니다.");
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<String> deleteMember(@PathVariable String memberId) {
        memberService.deleteMember(memberId);
        return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
    }

    @GetMapping("/{memberId}/goals")
    public ResponseEntity<List<String>> getMemberGoals(@PathVariable String memberId) {
        List<String> goals = memberService.getMemberGoals(memberId);
        return ResponseEntity.ok(goals);
    }
}
