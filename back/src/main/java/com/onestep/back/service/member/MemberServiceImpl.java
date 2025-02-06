package com.onestep.back.service.member;

import com.onestep.back.domain.Certifications;
import com.onestep.back.domain.Chats;
import com.onestep.back.domain.Goals;
import com.onestep.back.domain.Members;
import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.repository.member.MemberRepository;
import com.onestep.back.repository.upload.CertificationsRepository;
import com.onestep.back.repository.goal.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final CertificationsRepository certificationsRepository;
    private final GoalRepository goalRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Value("${com.onestep.upload.path}")
    private String uploadPath;

    @Override
    public MemberDTO getMemberById(String memberId) {
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        return new MemberDTO(
                member.getMemberId(),
                member.getName(),
                member.getEmail(),
                member.getPassword(),
                member.getPhone(),
                member.getBirth(),
                member.getSex(),
                member.isSocial()
        );
    }

    @Override
    public void updateMember(String memberId, MemberDTO memberDTO) {
        Members member = memberRepository.findById(memberDTO.getMemberId())
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        member.updateMember(memberDTO);
        memberRepository.save(member);
    }

    @Override
    public void deleteMember(String memberId) {
        try {
            // 1. 회원 조회
            Members member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다: " + memberId));

            // 2. 인증 데이터 삭제
            List<Certifications> certifications = certificationsRepository.findByMemberMemberId(memberId);
            certifications.forEach(cert -> {
                if (cert.getFilePath() != null) {
                    String filePath = uploadPath + File.separator + cert.getFilePath();
                    File file = new File(filePath);
                    if (file.exists()) file.delete(); // 파일 삭제
                }
            });

            // 3. 회원이 참여 중인 목표와의 연관 관계 삭제
            List<Goals> participatedGoals = member.getGoals();
            participatedGoals.forEach(goal -> {
                goal.getMembers().remove(member); // 목표에서 회원 제거
            });

            List<Chats> chats = member.getChats();
            for (Chats chat : chats) {
                chat.getMembers().remove(member); // 본인만 제거
            }
            // 4. 회원 삭제
            memberRepository.delete(member);
        } catch (Exception e) {
            throw new RuntimeException("회원 삭제 중 오류 발생: " + e.getMessage(), e);
        }
    }


    @Override
    public List<String> getMemberGoals(String memberId) {
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        return member.getGoals().stream().map(goal -> goal.getTitle()).collect(Collectors.toList());
    }

    @Override
    public MemberDTO join(MemberDTO memberDTO) throws MidExistException {
        String memberId = memberDTO.getMemberId();
        boolean exist = memberRepository.existsById(memberId);
        if (exist) {
            throw new MidExistException();
        }
        Members members = modelMapper.map(memberDTO, Members.class);
        members.changePassword(passwordEncoder.encode(memberDTO.getPassword()));

        memberRepository.save(members);
        return modelMapper.map(members, MemberDTO.class);
    }
}
