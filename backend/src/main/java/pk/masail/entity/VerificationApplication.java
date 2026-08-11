package pk.masail.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "verification_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String cnicNumber;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String mobileNumber;

    @Column(nullable = false)
    private String area;

    private String society;
    private String street;

    private String utilityBillNumber;
    private String utilityBillPhotoUrl;
    private String cnicFrontPhotoUrl;
    private String cnicBackPhotoUrl;
    private String profilePhotoUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus status = VerificationStatus.SUBMITTED;

    @Column(length = 2000)
    private String officerNotes;

    @Column(length = 2000)
    private String rejectionReason;

    @Builder.Default
    private Instant submittedAt = Instant.now();

    private Instant reviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;
}
