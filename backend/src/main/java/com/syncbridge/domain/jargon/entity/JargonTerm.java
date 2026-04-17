package com.syncbridge.domain.jargon.entity;

import com.syncbridge.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "jargon_terms", indexes = {
    @Index(name = "idx_jargon_keyword", columnList = "keyword")
})
public class JargonTerm extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "jargon_id")
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String keyword;

    @Builder
    public JargonTerm(String keyword) {
        this.keyword = keyword;
    }
}
