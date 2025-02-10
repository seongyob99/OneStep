package com.onestep.back.repository.goal;

import com.onestep.back.domain.*;
import com.onestep.back.dto.upload.CertificationsDTO;
import com.onestep.back.dto.goal.GoalDtlDTO;
import com.querydsl.core.Tuple;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.ArrayList;
import java.util.List;

@Log4j2
public class GoalCustomRepoImpl extends QuerydslRepositorySupport implements GoalCustomRepo {
    public GoalCustomRepoImpl() {
        super(Goals.class);
    }

    // 목표 상세 및 참여 정보 조회
    @Override
    public GoalDtlDTO getGoalInfo(Long goalId) {
        QGoals goals = QGoals.goals;
        QCategories categories = QCategories.categories;
        QMembers members = QMembers.members;
        QCertifications certifications = QCertifications.certifications;
        QChats chats = QChats.chats;

        // 목표 정보 조회
        Tuple goalResult = from(goals)
                .leftJoin(goals.category, categories)
                .leftJoin(goals.adminMember, members)
                .leftJoin(goals.chat, chats)
                .where(goals.goalId.eq(goalId))
                .select(
                        goals.goalId,
                        goals.title,
                        goals.description,
                        categories.categoryId,
                        categories.cateName,
                        goals.rule,
                        goals.certCycle,
                        members.memberId,
                        members.name,
                        goals.startDate,
                        goals.endDate,
                        goals.participants,
                        goals.thumbnail,
                        chats.chatId
                )
                .fetchOne();

        if (goalResult == null) {
            throw new RuntimeException("Goal not found for ID: " + goalId);
        }

        // GoalDtlDTO 세팅
        GoalDtlDTO dto = GoalDtlDTO.builder()
                .goalId(goalId)
                .title(goalResult.get(goals.title))
                .description(goalResult.get(goals.description))
                .categoryId(goalResult.get(categories.categoryId))
                .categoryName(goalResult.get(categories.cateName))
                .rule(goalResult.get(goals.rule))
                .certCycle(goalResult.get(goals.certCycle))
                .adminMemberId(goalResult.get(members.memberId))
                .adminMemberName(goalResult.get(members.name))
                .startDate(goalResult.get(goals.startDate))
                .endDate(goalResult.get(goals.endDate))
                .participants(goalResult.get(goals.participants))
                .thumbnail(goalResult.get(goals.thumbnail))
                .chatId(goalResult.get(chats.chatId))
                .members(new ArrayList<>())
                .build();

        // 참여자 정보 조회
        List<Tuple> memberResult = from(members)
                .leftJoin(members.certifications, certifications).on(certifications.goal.goalId.eq(goalId))
                .leftJoin(members.goals, goals)
                .where(goals.goalId.eq(goalId))
                .groupBy(members.memberId, members.name)
                .select(
                        goals.goalId,
                        members.memberId,
                        members.name,
                        certifications.count().coalesce(0L).as("certCnt"),
                        certifications.certDate.max().as("latestCertDate")
                )
                .orderBy(certifications.count().coalesce(0L).desc(), certifications.certDate.max().desc(), certifications.regDate.asc())
                .fetch();

        // CertificationsDTO 추가
        memberResult.forEach(tuple -> {
            dto.getMembers().add(CertificationsDTO.builder()
                    .goalId(tuple.get(goals.goalId))
                    .memberId(tuple.get(members.memberId))
                    .name(tuple.get(members.name))
                    .certCnt(tuple.get(certifications.count().coalesce(0L).as("certCnt")))
                    .build());
        });

        return dto;
    }
}
