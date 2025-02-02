package com.onestep.back.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "goals")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Goals extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "goal_id")
    private Long goalId;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Categories category;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "rule", nullable = false)
    private String rule;

    @Column(name = "cert_cycle", nullable = false)
    private Long certCycle;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Members adminMember;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "participants")
    private Long participants;

    @ManyToMany
    @JoinTable(
            name = "goals_members",
            joinColumns = @JoinColumn(name = "goal_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id")
    )
    private List<Members> members;

    @OneToMany(mappedBy = "goal", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certifications> certifications;

    @OneToOne(mappedBy = "goal", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Chats chat;

    @Column(name = "thumbnail")  // 📌 썸네일 파일명 추가
    private String thumbnail;
}
