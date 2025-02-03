package com.onestep.back.service.member;

import com.onestep.back.domain.Members;
import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;

    @Override
    public MemberDTO getMemberById(String memberId) {
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        return new MemberDTO(
                member.getMemberId(),
                member.getPassword(),
                member.getName(),
                member.getEmail(),
                member.getPhone(),
                member.getBirth() != null ? member.getBirth().toString() : null,
                member.getSex(),
                member.isSocial()
        );
    }

    @Override
    public void updateMember(String memberId, MemberDTO memberDTO) {
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));

        Members updatedMember = Members.builder()
                .memberId(member.getMemberId())
                .password(memberDTO.getPassword() != null ? memberDTO.getPassword() : member.getPassword()) // ✅ 비밀번호도 변경 가능
                .name(memberDTO.getName() != null ? memberDTO.getName() : member.getName())
                .email(memberDTO.getEmail() != null ? memberDTO.getEmail() : member.getEmail())
                .phone(memberDTO.getPhone() != null ? memberDTO.getPhone() : member.getPhone())
                .birth(memberDTO.getBirth() != null ? LocalDate.parse(memberDTO.getBirth()) : member.getBirth())
                .sex(memberDTO.getSex() != null ? memberDTO.getSex() : member.getSex())
                .social(member.isSocial())
                .goals(member.getGoals())
                .chats(member.getChats())
                .certifications(member.getCertifications())
                .build();

        memberRepository.save(updatedMember);

    }


    @Override
    public void deleteMember(String memberId) {
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        memberRepository.delete(member);
    }

    @Override
    public List<String> getMemberGoals(String memberId) {
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        return member.getGoals().stream().map(goal -> goal.getTitle()).collect(Collectors.toList());
    }
}
