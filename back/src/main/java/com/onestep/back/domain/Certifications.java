package com.onestep.back.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "certifications")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(CertificationId.class)
public class Certifications extends BaseEntity {
    @Id
    @ManyToOne
    @JoinColumn(name = "goal_id")
    private Goals goal;

    @Id
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Members member;

    @Id
    @Column(name = "cert_date")
    private LocalDate certDate;

    @Column(name = "file_path")
    private String filePath;
}
