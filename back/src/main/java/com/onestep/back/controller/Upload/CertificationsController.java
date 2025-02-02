package com.onestep.back.controller.Upload;

import com.onestep.back.dto.Upload.CertificationsDTO;
import com.onestep.back.dto.Upload.UploadFileDTO;
import com.onestep.back.dto.Upload.UploadResultDTO;
import com.onestep.back.service.Upload.CertificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import net.coobird.thumbnailator.Thumbnailator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;

@Log4j2
@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class CertificationsController {

    @Value("${com.onestep.upload.path}")
    private String uploadPath;

    private final CertificationService certificationService;


    // 파일 업로드
    @Tag(name = "파일 등록 post", description = "멀티파트 타입 이용해서, post 형식으로 업로드테스트 및 DB 등록")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<UploadResultDTO> upload(@ModelAttribute UploadFileDTO uploadFileDTO,
                                        @RequestParam Long goalId,
                                        @RequestParam String memberId,
                                        @RequestParam String certDate) {
        log.info("CertificationsController uploadFileDTO 내용 확인: " + uploadFileDTO);
        LocalDate date = LocalDate.parse(certDate);
        List<UploadResultDTO> resultList = new ArrayList<>();

        if (uploadFileDTO.getFiles() != null && !uploadFileDTO.getFiles().isEmpty()) {
            for (MultipartFile multipartFile : uploadFileDTO.getFiles()) {
                String originName = multipartFile.getOriginalFilename();
                String uuid = UUID.randomUUID().toString();
                String savedFileName = uuid + "_" + originName;
                log.info("파일명: " + originName + ", uuid: " + uuid);

                Path savePath = Paths.get(uploadPath, savedFileName);
                boolean image = false;
                try {
                    multipartFile.transferTo(savePath);
                    log.info("파일 저장 완료: " + savePath.toFile().getAbsolutePath());
                    // 주석 처리된 섬네일 처리 코드는 필요 시 활성화 가능
//                    if(Files.probeContentType(savePath).startsWith("image")){
//                        image = true;
//                        File thumbFile = new File(uploadPath, "s_" + savedFileName);
//                        Thumbnailator.createThumbnail(savePath.toFile(), thumbFile, 200, 200);
//                    }
                } catch (IOException e) {
                    log.error("파일 저장 실패: " + e.getMessage());
                    continue; // 저장 실패 시 해당 파일은 건너뜁니다.
                }
                log.info("controller goalId확인 : "+goalId);
                // DB에 저장할 DTO 구성 (파일 경로는 저장한 파일명)
                CertificationsDTO certDTO = CertificationsDTO.builder()
                        .goalId(goalId)
                        .memberId(memberId)
                        .certDate(date)
                        .filePath(savedFileName)
                        .build();
                try {
                    certificationService.register(certDTO);
                } catch (RuntimeException e) {
                    log.error("DB 등록 실패: " + e.getMessage());
                    // DB 등록에 실패한 경우 파일 삭제 처리 (선택사항)
                    try { Files.deleteIfExists(savePath); } catch (IOException ex) { }
                    continue;
                }

                UploadResultDTO resultDTO = UploadResultDTO.builder()
                        .uuid(uuid)
                        .fileName(originName)
                        .img(image)
                        .build();
                resultList.add(resultDTO);
            }
        }
        return resultList;
    }

    // 업로드 파일 조회 --> 파일 직접 조회
    @Tag(name = "파일 조회 get", description = "파일 시스템에서 이미지 읽기")
    @GetMapping(value = "/view/{fileName}")
    public ResponseEntity<Resource> viewFileGet(@PathVariable String fileName) {
        Resource resource = new FileSystemResource(uploadPath + File.separator + fileName);
        String resourceName = resource.getFilename();
        log.info("viewFileGet 조회 파일 이름: " + resourceName);

        HttpHeaders headers = new HttpHeaders();
        try {
            headers.add("Content-Type", Files.probeContentType(resource.getFile().toPath()));
        } catch (Exception e) {
            return new ResponseEntity<>(null, headers, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return ResponseEntity.ok().headers(headers).body(resource);
    }

    //업로드 파일 조회 --> db에 저장된 인증정보를 조회하여 dto로 반환
//    @Tag(name = "파일 조회 get", description = "DB에 저장된 정보 조회")
//    @GetMapping("/view/read")
//    public ResponseEntity<?> readCertification(@RequestParam Long goalId,
//                                               @RequestParam String memberId,
//                                               @RequestParam String certDate) {
//        LocalDate date = LocalDate.parse(certDate);
//        CertificationsDTO dto = certificationService.read(goalId, memberId, date);
//        return ResponseEntity.ok(dto);
//    }

        // 다운로드 ?
//    @Tag(name = "파일 다운로드 get", description = "파일 시스템에서 이미지 다운로드")
//    @GetMapping(value = "/download/{filename}")
//    public ResponseEntity<Resource> fileDownload(@PathVariable String filename) {
//        try {
//            Path filePath = Paths.get(uploadPath).resolve(filename).normalize();
//            log.info("fileDownload filePath: " + filePath);
//            Resource resource = new UrlResource(filePath.toUri());
//            if (!resource.exists()) {
//                return ResponseEntity.notFound().build();
//            }
//            String encodedFilename = URLEncoder.encode(resource.getFilename(), StandardCharsets.UTF_8.toString())
//                    .replaceAll("\\+", "%20");
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFilename + "\"")
//                    .body(resource);
//        } catch (Exception ex) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }
    // 인증사진 삭제 / 로그인된 본인, 방장만 삭제 가능 / 오늘만 삭제 가능
    @Tag(name = "파일 삭제 delete", description = "파일 시스템에서 이미지 삭제 및 DB에서 해당 인증 삭제")
    @DeleteMapping(value = "/delete/{filename}")
    public ResponseEntity<Map<String, Boolean>> fileDelete(@PathVariable String filename,
                                                           @RequestParam Long goalId,
                                                           @RequestParam String memberId,
                                                           @RequestParam String certDate,
                                                           @RequestParam String currentMemberId) {
        Resource resource = new FileSystemResource(uploadPath + File.separator + filename);
        Map<String, Boolean> resultMap = new HashMap<>();
        boolean fileDeleteCheck = false;
        try {
            String contentType = Files.probeContentType(resource.getFile().toPath());
            fileDeleteCheck = resource.getFile().delete();
            if (contentType.startsWith("image")) {
                File thumbFile = new File(uploadPath + File.separator, "s_" + filename);
                thumbFile.delete();
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        resultMap.put("fileDelete", fileDeleteCheck);

        // 오늘 인증만 삭제 가능 / db 삭제 처리
        LocalDate date = LocalDate.parse(certDate);
        try {
            certificationService.delete(goalId, memberId, date,currentMemberId);
            resultMap.put("dbDelete", true);
        } catch (RuntimeException e) {
            log.error("DB 삭제 실패: " + e.getMessage());
            resultMap.put("dbDelete", false);
        }
        return ResponseEntity.ok(resultMap);
    }

    //수정기능 필요? 하루 인증사진 1회 제한 후 삭제후 재업로드?
//
//    @Tag(name = "인증 수정 put", description = "DB에 저장된 인증정보 수정")
//    @PutMapping("/cert/update")
//    public ResponseEntity<String> updateCertification(@RequestBody CertificationsDTO dto) {
//        try {
//            certificationService.update(dto);
//            return ResponseEntity.ok("인증정보가 수정되었습니다.");
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
//----------------------------------------------------------------------
//    @Tag(name = "인증 삭제 delete", description = "DB에 저장된 인증정보 삭제")
//    @DeleteMapping("/cert/delete")
//    public ResponseEntity<String> deleteCertification(@RequestParam Long goalId,
//                                                      @RequestParam String memberId,
//                                                      @RequestParam String certDate,
//                                                      @RequestParam String currentMemberId){
//        LocalDate date = LocalDate.parse(certDate);
//        try {
//            certificationService.delete(goalId, memberId, date,currentMemberId);
//            return ResponseEntity.ok("인증정보가 삭제되었습니다.");
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
}
