package com.onestep.back.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "members")
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Members extends BaseEntity {
    @Id
    @Column(name = "member_id", length = 20)
    private String memberId;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "birth")
    private LocalDate birth;

    @Column(name = "sex", length = 10)
    private String sex;

    @Column(name = "social")
    private boolean social;

    @ManyToMany(mappedBy = "members", fetch = FetchType.LAZY)
    private List<Goals> goals;

    @ManyToMany
    @JoinTable(name = "chats_members",
            joinColumns = @JoinColumn(name = "member_id"),
            inverseJoinColumns = @JoinColumn(name = "chat_id"))
    private List<Chats> chats;

    @OneToMany(mappedBy = "adminMember", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Goals> delGoals;

    @OneToMany(mappedBy = "member", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certifications> certifications;
}
