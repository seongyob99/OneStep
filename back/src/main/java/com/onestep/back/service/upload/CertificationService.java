package com.onestep.back.service.upload;

import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.dto.upload.CertificationsDTO;

import java.time.LocalDate;
import java.util.List;

public interface CertificationService {

    // 조회
    List<MemberDTO> Alllist(Long goalId);

    // 등록
    void register(CertificationsDTO dto);

    // 삭제
    void delete(Long goalId, String targetMemberId, LocalDate certDate, String currentMemberId);
}