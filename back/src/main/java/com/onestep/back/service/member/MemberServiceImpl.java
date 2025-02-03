package com.onestep.back.service.member;

import com.onestep.back.domain.Members;
import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    @Override
    public MemberDTO getMemberById(String memberId) { // String 타입 사용
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        return new MemberDTO(
                member.getMemberId(),
                member.getName(),
                member.getEmail(),
                member.getPhone(),
                member.getBirth() != null ? member.getBirth().toString() : null,
                member.getSex(),
                member.isSocial()
        );
    }

    @Override
    public void updateMember(String memberId, MemberDTO memberDTO) { // String 타입 사용
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        member.setName(memberDTO.getName());
        member.setEmail(memberDTO.getEmail());
        member.setPhone(memberDTO.getPhone());
        if (memberDTO.getBirth() != null) {
            member.setBirth(LocalDate.parse(memberDTO.getBirth()));
        }
        member.setSex(memberDTO.getSex());
        memberRepository.save(member);
    }
}
