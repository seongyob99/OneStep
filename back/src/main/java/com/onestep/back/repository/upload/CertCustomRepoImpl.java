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

        // 1. 인증 정보를 튜플 리스트로 fetch (GroupBy transform 대신 일반 fetch 사용)
        List<Tuple> memberResult = from(members)
                .leftJoin(members.certifications, certifications)
                .leftJoin(members.goals, goals)
                .where(goals.goalId.eq(goalId))
                .select(
                        goals.goalId,
                        members.memberId,
                        members.name,
                        certifications.filePath,
                        certifications.certDate,
                        goals.startDate,
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
                    // 첫 번째 튜플에서 회원 정보를 추출 (모든 튜플은 같은 회원 정보임)
                    Tuple first = tuples.get(0);
                    String memberId = first.get(members.memberId);
                    String memberName = first.get(members.name);
                    LocalDate startDate = first.get(goals.startDate);
                    Long certCycle = first.get(goals.certCycle);

                    // 각 튜플을 CertificationsDTO로 매핑
                    List<CertificationsDTO> certDTOList = tuples.stream()
                            .map(tuple -> CertificationsDTO.builder()
                                    .filePath(tuple.get(certifications.filePath))
                                    .certDate(tuple.get(certifications.certDate))
                                    .build())
                            .collect(Collectors.toList());

                    return MemberDTO.builder()
                            .memberId(memberId)
                            .name(memberName)
                            .certdto(certDTOList)
                            .startDate(startDate)
                            .certCycle(certCycle)
                            .build();
                })
                .collect(Collectors.toList());

        return memberDTOList;
    }
}
