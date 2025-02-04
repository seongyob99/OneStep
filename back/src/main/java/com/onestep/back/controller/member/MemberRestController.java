package com.onestep.back.controller.member;

import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Log4j2
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MemberRestController {
    private final MemberService memberService;

    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> join(@RequestBody MemberDTO memberDTO) {
        try {
            MemberDTO responseDTO = memberService.join(memberDTO);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "회원가입이 완료되었습니다.");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (MemberService.MidExistException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "error");
            response.put("message", "이미 존재하는 회원 ID입니다.");

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
