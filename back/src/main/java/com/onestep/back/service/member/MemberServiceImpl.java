package com.onestep.back.service.member;

import com.onestep.back.domain.Certifications;
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
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));

        // 기존 데이터 유지 및 변경 데이터 적용
        if (memberDTO.getName() != null) {
            member.setName(memberDTO.getName());
        }
        if (memberDTO.getEmail() != null) {
            member.setEmail(memberDTO.getEmail());
        }
        if (memberDTO.getPhone() != null) {
            member.setPhone(memberDTO.getPhone());
        }
        if (memberDTO.getBirth() != null) {
            member.setBirth(memberDTO.getBirth());
        }
        if (memberDTO.getPassword() != null) {
            member.setPassword(passwordEncoder.encode(memberDTO.getPassword()));
        }

        memberRepository.save(member);
    }

    @Override
    public void deleteMember(String memberId) {
        // 1. 회원 조회
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));

        // 2. 회원의 모든 인증 데이터 삭제 (이미지 포함)
        List<Certifications> certifications = certificationsRepository.findByMemberMemberId(memberId);
        for (Certifications cert : certifications) {
            if (cert.getFilePath() != null) {
                String filePath = uploadPath + File.separator + cert.getFilePath();
                File file = new File(filePath);
                if (file.exists()) {
                    file.delete(); // 파일 삭제
                }
            }
        }
        certificationsRepository.deleteAll(certifications);

        // 3. 회원이 관리하는 목표 삭제
        member.getDelGoals().forEach(goal -> goalRepository.delete(goal));

        // 4. 회원 삭제
        memberRepository.delete(member);
    }


    @Override
    public List<String> getMemberGoals(String memberId) {
        Members member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("해당 회원을 찾을 수 없습니다."));
        return member.getGoals().stream().map(goal -> goal.getTitle()).collect(Collectors.toList());
    }

    @Override
    public MemberDTO join(MemberDTO memberDTO) throws MidExistException {
        String mid = memberDTO.getMemberId();
        boolean exist = memberRepository.existsById(mid);
        if (exist) {
            throw new MidExistException();
        }
        Members members = modelMapper.map(memberDTO, Members.class);
        members.changePassword(passwordEncoder.encode(memberDTO.getPassword()));

        memberRepository.save(members);
        return modelMapper.map(members, MemberDTO.class);
    }
}
