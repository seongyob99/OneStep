package com.onestep.back.service.goal;

import com.onestep.back.domain.Certifications;
import com.onestep.back.dto.goal.CertDTO;
import com.onestep.back.dto.goal.GoalDtlDTO;
import com.onestep.back.repository.goal.CertRepository;
import com.onestep.back.repository.goal.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GoalDtlServiceImpl implements GoalDtlService{

    private final GoalRepository goalRepository;
    private final CertRepository certRepository;
    private final ModelMapper modelMapper;

    // 목표 상세 및 참여 정보 조회
    @Override
    public GoalDtlDTO getGoalInfo(Long goalId) {
        return goalRepository.getGoalInfo(goalId);
    }

    // 최근 인증 기록 탑4 조회
    @Override
    public List<CertDTO> getRecentCert(Long goalId) {
        Pageable pageable = PageRequest.of(0, 4);
        List<Certifications> certifications = certRepository.findRecentCertificationsByGoalId(goalId, pageable);

        return certifications.stream()
                .map(cert -> modelMapper.map(cert, CertDTO.class))
                .collect(Collectors.toList());
    }
}
