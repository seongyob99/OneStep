package com.onestep.back.repository.upload;

import com.onestep.back.domain.Certifications;
import com.querydsl.core.Tuple;
import com.onestep.back.domain.QCertifications;
import com.onestep.back.domain.QGoals;
import com.onestep.back.domain.QMembers;
import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.dto.upload.CertificationsDTO;

import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class CertCustomRepoImpl extends QuerydslRepositorySupport implements CertCustomRepo {

    public CertCustomRepoImpl() {
        super(Certifications.class);
    }

    // 목표 상세 및 참여 정보 조회 (멤버별로 묶고, 각 멤버마다 인증정보 리스트를 가져옴)
    @Override
    public List<MemberDTO> getCertInfo(Long goalId) {
        QGoals goals = QGoals.goals;
        QMembers members = QMembers.members;
        QCertifications certifications = QCertifications.certifications;

        // 1. 인증 정보를 튜플 리스트로 fetch (goalId를 필터링)
        List<Tuple> memberResult = from(members)
                .leftJoin(members.certifications, certifications).on(certifications.goal.goalId.eq(goalId))
                .leftJoin(members.goals, goals)
                .where(goals.goalId.eq(goalId)) // goalId가 일치하는 멤버만 가져옴
                .select(
                        goals.goalId,
                        goals.adminMember.memberId,
                        members.memberId,
                        members.name,
                        certifications.filePath,
                        certifications.certDate,
                        goals.startDate,
                        goals.endDate,
                        goals.certCycle
                )
                .orderBy(members.memberId.asc(), certifications.certDate.desc())
                .fetch();

        // 2. Java Streams를 사용하여 멤버별로 그룹화 (memberId를 기준으로)
        Map<String, List<Tuple>> groupedResults = memberResult.stream()
                .collect(Collectors.groupingBy(tuple -> tuple.get(members.memberId)));

        // 3. 그룹화된 결과를 MemberDTO 리스트로 변환
        List<MemberDTO> memberDTOList = groupedResults.entrySet().stream()
                .map(entry -> {
                    List<Tuple> tuples = entry.getValue();
                    Tuple first = tuples.get(0);
                    String memberId = first.get(members.memberId);
                    String memberName = first.get(members.name);
                    LocalDate startDate = first.get(goals.startDate);
                    LocalDate endDate = first.get(goals.endDate);
                    Long certCycle = first.get(goals.certCycle);
                    String adminMemberId = first.get(goals.adminMember.memberId);

                    // 🔹 goalId가 일치하는 인증 정보만 필터링하여 certDTOList 생성
                    List<CertificationsDTO> certDTOList = tuples.stream()
                            .filter(tuple -> goalId.equals(tuple.get(goals.goalId))) // goalId 일치하는 데이터만 필터링
                            .map(tuple -> CertificationsDTO.builder()
                                    .goalId(tuple.get(goals.goalId))
                                    .memberId(tuple.get(members.memberId))
                                    .name(tuple.get(members.name))
                                    .filePath(tuple.get(certifications.filePath))
                                    .certDate(tuple.get(certifications.certDate))
                                    .build())
                            .collect(Collectors.toList());

                    return MemberDTO.builder()
                            .memberId(memberId)
                            .name(memberName)
                            .certdto(certDTOList)
                            .startDate(startDate)
                            .endDate(endDate)
                            .adminMemberId(adminMemberId)
                            .certCycle(certCycle)
                            .build();
                })
                .collect(Collectors.toList());

        return memberDTOList;
    }
}