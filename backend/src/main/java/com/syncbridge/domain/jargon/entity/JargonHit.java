package com.syncbridge.domain.jargon.entity;

import com.syncbridge.domain.user.entity.Role;
import com.syncbridge.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Table(name = "jargon_hits")
public class JargonHit extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hit_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jargon_id", nullable = false)
    private JargonTerm jargonTerm;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private Role userRole;

    @Column(name = "user_id")
    private Long userId;

    @Builder
    public JargonHit(JargonTerm jargonTerm, Role userRole, Long userId) {
        this.jargonTerm = jargonTerm;
        this.userRole = userRole;
        this.userId = userId;
    }
}
