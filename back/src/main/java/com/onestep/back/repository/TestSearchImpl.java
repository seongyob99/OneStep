package com.onestep.back.repository;

import com.onestep.back.domain.QTest;
import com.onestep.back.domain.Test;
import com.onestep.back.dto.TestDTO;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;

public class TestSearchImpl extends QuerydslRepositorySupport implements TestSearch {

    public TestSearchImpl() {
        super(Test.class);
    }

    // 목록 조회
    @Override
    public List<Test> getList(TestDTO testDTO) {
        QTest test = QTest.test;
        BooleanBuilder builder = new BooleanBuilder();
        // 검색조건
        if(testDTO.getSrhName() != null && !testDTO.getSrhName().isEmpty()) {
            builder.and(test.name.contains(testDTO.getSrhName()));
        }
        if(testDTO.isSrhChkType()) {
            builder.and(test.chkType.isTrue());
        }
        if(testDTO.getSrhStrBirth() != null && testDTO.getSrhEndBirth() != null) {
            builder.and(test.birth.between(testDTO.getSrhStrBirth(), testDTO.getSrhEndBirth()));
        }
        if(testDTO.getSrhAddress() != null && !testDTO.getSrhAddress().isEmpty()) {
            builder.and(test.address.contains(testDTO.getSrhAddress()));
        }
        // 쿼리
        JPQLQuery<Test> query = from(test)
                .where(builder)
                .orderBy(test.name.asc(), test.id.desc());

        return query.fetch();
    }
}
