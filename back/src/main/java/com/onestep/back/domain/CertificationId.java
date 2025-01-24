package com.onestep.back.domain;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
public class CertificationId implements Serializable {

    private Long goal;
    private String member;
    private LocalDate certDate;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CertificationId that = (CertificationId) o;
        return Objects.equals(goal, that.goal) &&
                Objects.equals(member, that.member) &&
                Objects.equals(certDate, that.certDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(goal, member, certDate);
    }
}
