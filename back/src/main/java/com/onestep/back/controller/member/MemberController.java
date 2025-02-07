package com.onestep.back.controller.member;

import com.onestep.back.dto.goal.GoalDTO;
import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@Log4j2
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
        log.info("Update member: {}", memberDTO);
        memberService.updateMember(memberDTO.getMemberId(), memberDTO);
        return ResponseEntity.ok("회원 정보가 수정되었습니다.");
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<String> deleteMember(@PathVariable String memberId) {
        try {
            log.info("멤버아이디:" + memberId);
            memberService.deleteMember(memberId);
            return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
        } catch (RuntimeException e) {
            System.err.println("❌ 회원 탈퇴 요청 처리 중 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("회원 탈퇴 중 오류 발생: " + e.getMessage());
        }
    }



    @GetMapping("/{memberId}/goals")
    public ResponseEntity<List<GoalDTO>> getMemberGoals(@PathVariable String memberId) {
        List<GoalDTO> goals = memberService.getMemberGoals(memberId);
        return ResponseEntity.ok(goals);
    }
}
