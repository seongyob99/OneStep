package com.onestep.back.repository;

import com.onestep.back.domain.Test;
import com.onestep.back.dto.TestDTO;

import java.util.List;

public interface TestSearch {

    List<Test> getList(TestDTO testDTO);
}
