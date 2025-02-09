package com.onestep.back.controller.upload;

import com.onestep.back.dto.member.MemberDTO;
import com.onestep.back.dto.upload.CertificationsDTO;
import com.onestep.back.service.goal.GoalDtlService;
import com.onestep.back.service.upload.CertificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Log4j2
@RestController
@RequestMapping("/cert")
@RequiredArgsConstructor
public class CertificationsController {

    @Value("${com.onestep.upload.path}")
    private String uploadPath;

    private final CertificationService certificationService;
    private final GoalDtlService goalDtlService;

    @GetMapping("/{goalId}")
    public List<MemberDTO> getCertifications(@PathVariable Long goalId) {
        List<MemberDTO> result = certificationService.Alllist(goalId);

        return result;
    }

    @Tag(name = "파일 등록 post", description = "멀티파트 타입 이용해서, 단일 파일 업로드 및 DB 등록")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(
            @RequestParam MultipartFile file,
            @RequestParam Long goalId,
            @RequestParam String memberId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate certDate) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "파일이 없습니다."));
        }

        String originName = file.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        String savedFileName = uuid + "_" + originName;
        Path savePath = Paths.get(uploadPath, savedFileName);
        boolean image = false;

        try {
            file.transferTo(savePath);
            log.info("파일 저장 완료: {}", savePath.toFile().getAbsolutePath());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("errorType", "FILE_SAVE_ERROR", "message", "파일 저장 중 오류 발생"));
        }

        // DB 저장용 DTO 생성
        CertificationsDTO certDTO = CertificationsDTO.builder()
                .goalId(goalId)
                .memberId(memberId)
                .certDate(certDate)
                .filePath(savedFileName)
                .build();

        try {
            certificationService.register(certDTO);
        } catch (RuntimeException e) {
            try {
                Files.deleteIfExists(savePath);
            } catch (IOException ex) {
                log.error("파일 삭제 실패: {}", ex.getMessage());
            }

            String errorMessage = e.getMessage();
            String errorType = "UNKNOWN_ERROR";
            if (errorMessage.contains("인증일은 인증 주기에 맞지 않습니다.")) {
                errorType = "CERT_CYCLE_ERROR";
            } else if (errorMessage.contains("이미 해당 날짜에 인증이 등록되어 있습니다.")) {
                errorType = "DUPLICATE_CERTIFICATION";
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("errorType", errorType, "message", errorMessage));
        }

        CertificationsDTO responseDto = CertificationsDTO.builder()
                .uuid(uuid)
                .fileName(originName)
                .img(image)
                .build();

        return ResponseEntity.ok(responseDto);
    }

    @Tag(name = "파일 삭제 delete", description = "파일 시스템에서 이미지 삭제 및 DB에서 해당 인증 삭제")
    @DeleteMapping(value = "/delete/{filename}")
    public ResponseEntity<Map<String, Boolean>> fileDelete(
            @PathVariable("filename") String filename,
            @RequestParam Long goalId,
            @RequestParam String memberId,
            @RequestParam String certDate,
            @RequestParam String currentMemberId) {

        Resource resource = new FileSystemResource(uploadPath + File.separator + filename);
        Map<String, Boolean> resultMap = new HashMap<>();
        boolean fileDeleteCheck = false;

        try {
            Path filePath = Paths.get(uploadPath, filename);

            // 파일이 실제 존재하는지 체크
            if (!Files.exists(filePath)) {
                log.warn("🚨 파일이 존재하지 않습니다: {}", filename);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            //  파일 삭제
            fileDeleteCheck = Files.deleteIfExists(filePath);
            resultMap.put("fileDelete", fileDeleteCheck);

        } catch (Exception e) {
            log.error("🚨 파일 삭제 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }

        //  오늘 인증만 삭제 가능 → DB에서 삭제 처리
        LocalDate date = LocalDate.parse(certDate);
        try {
            certificationService.delete(goalId, memberId, date, currentMemberId);
            resultMap.put("dbDelete", true);

        } catch (RuntimeException e) {
            log.error("🚨 DB 삭제 실패: {}", e.getMessage());
            resultMap.put("dbDelete", false);
        }

        return ResponseEntity.ok(resultMap);
    }

}
