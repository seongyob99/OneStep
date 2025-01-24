package com.onestep.back.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Test extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 20)
    private String name;
    @Column(nullable = false, name = "chk_type")
    private boolean chkType;
    @Column(nullable = false)
    private LocalDate birth;
    @Column(length = 50)
    private String address;
    @Column(length = 500, name = "file_path")
    private String filePath;
}
