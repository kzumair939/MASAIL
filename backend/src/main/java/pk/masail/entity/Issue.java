package pk.masail.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 4000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueCategory category;

    private String area;
    private String society;
    private String street;

    private Double latitude;
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IssueStatus status = IssueStatus.REPORTED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by")
    private User reportedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    private String contractor;

    @Builder.Default
    private int supportCount = 0;

    @Builder.Default
    private int progress = 0;

    @Builder.Default
    private java.math.BigDecimal raisedAmount = java.math.BigDecimal.ZERO;

    @Builder.Default
    private java.math.BigDecimal targetBudget = new java.math.BigDecimal("50000");


    @Builder.Default
    private Instant reportedAt = Instant.now();

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<IssuePhoto> photos = new ArrayList<>();

    @OneToMany(mappedBy = "issue", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Donation> donations = new ArrayList<>();
}
