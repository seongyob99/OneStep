package com.onestep.back.repository.upload;

import com.onestep.back.dto.goal.GoalDtlDTO;
import com.onestep.back.dto.member.MemberDTO;

import java.util.List;

public interface CertCustomRepo {

    List<MemberDTO> getCertInfo(Long goalId);
}
