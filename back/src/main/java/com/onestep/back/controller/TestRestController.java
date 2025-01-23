package com.onestep.back.controller;

import com.onestep.back.dto.TestDTO;
import com.onestep.back.service.TestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Log4j2
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestRestController {

    @Value("${com.busanit501.upload.path}")
    private String uploadPath;

    private final TestService testService;

    @GetMapping("/uploads/{fileName}")
    public Resource getFile(@PathVariable String fileName) {
        Path filePath = Paths.get(uploadPath).resolve(fileName);
        Resource resource = new FileSystemResource(filePath);
        if (resource.exists() || resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("File not found");
        }
    }
    // 목록 조회
    @PostMapping("/getTestList")
    public List<TestDTO> getTestList(@RequestBody TestDTO testDTO) {
        log.info(testDTO);
        return testService.getList(testDTO);
    }

    // 등록
    @PostMapping(value = "/registTest", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Long registTest(@ModelAttribute TestDTO testDTO) {
        log.info(testDTO);

        Path uploadDirectory = Paths.get(uploadPath);
        try {
            if (Files.notExists(uploadDirectory)) {
                Files.createDirectories(uploadDirectory); // 디렉토리가 존재하지 않으면 생성
                log.info("업로드 디렉토리 생성됨: " + uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("업로드 디렉토리 생성 실패", e);
        }

        // 파일 있으면 업로드
        if(testDTO.getFiles() != null && !testDTO.getFiles().isEmpty()) {
            testDTO.getFiles().forEach(file -> {
                String fileName = file.getOriginalFilename();
                String uuid = UUID.randomUUID().toString();
                Path savePath = Paths.get(uploadPath, uuid + "_" + fileName);

                try {
                    String contentType = file.getContentType();
                    if (contentType == null || !contentType.startsWith("image")) {
                        throw new IllegalArgumentException("Uploaded file is not an image.");
                    }

                    file.transferTo(savePath);
//                    testDTO.setFilePath(savePath.toString());
                    testDTO.setFilePath(uuid + "_" + fileName);

                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload file", e);
                } catch (IllegalArgumentException e) {
                    throw new IllegalArgumentException("Invalid file type: " + fileName, e);
                }
            });
        }

        return testService.insert(testDTO);
    }

    // 수정
    @PostMapping("/updateTest")
    public Long updateTest(@RequestBody TestDTO testDTO) {
        log.info(testDTO);
        // 파일수정
        return testService.update(testDTO);
    }

    // 삭제
    @PostMapping("/deleteTest")
    public void deleteTest(Long id) {
        // 파일삭제
        testService.delete(id);
    }
}
