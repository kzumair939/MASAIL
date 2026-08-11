package pk.masail.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.masail.dto.VerificationDtos.*;
import pk.masail.entity.Role;
import pk.masail.entity.User;
import pk.masail.entity.VerificationApplication;
import pk.masail.entity.VerificationStatus;
import pk.masail.exception.ApiException;
import pk.masail.repository.UserRepository;
import pk.masail.repository.VerificationApplicationRepository;
import pk.masail.security.AuthenticatedUser;

/**
 * Requirements #3, #4, #5: a User applies to become a Verified Resident;
 * a Verification Officer reviews the application and, on approval,
 * the account is upgraded and the applicant's area is locked in.
 */
@Service
@RequiredArgsConstructor
public class VerificationService {

    private final VerificationApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Transactional
    public VerificationApplication apply(AuthenticatedUser principal, ApplyRequest req) {
        User user = userRepository.findById(principal.userId())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (user.getRole() == Role.VERIFIED_RESIDENT) {
            throw new ApiException(HttpStatus.CONFLICT, "You are already a Verified Resident");
        }

        VerificationApplication application = VerificationApplication.builder()
                .user(user)
                .fullName(req.fullName())
                .cnicNumber(req.cnicNumber())
                .email(req.email())
                .mobileNumber(req.mobileNumber())
                .area(req.area())
                .society(req.society())
                .street(req.street())
                .utilityBillNumber(req.utilityBillNumber())
                .utilityBillPhotoUrl(req.utilityBillPhotoUrl())
                .cnicFrontPhotoUrl(req.cnicFrontPhotoUrl())
                .cnicBackPhotoUrl(req.cnicBackPhotoUrl())
                .profilePhotoUrl(req.profilePhotoUrl())
                .status(VerificationStatus.SUBMITTED)
                .build();

        return applicationRepository.save(application);
    }

    public VerificationApplication myLatestApplication(Long userId) {
        return applicationRepository.findTopByUserIdOrderBySubmittedAtDesc(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "No verification application found"));
    }

    public Page<VerificationApplication> queue(Pageable pageable) {
        return applicationRepository.findByStatus(VerificationStatus.SUBMITTED, pageable);
    }

    public VerificationApplication getApplication(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Application not found"));
    }

    @Transactional
    public VerificationApplication review(Long applicationId, AuthenticatedUser officerPrincipal, ReviewRequest req) {
        VerificationApplication application = getApplication(applicationId);
        User officer = userRepository.getReferenceById(officerPrincipal.userId());

        application.setReviewedBy(officer);
        application.setReviewedAt(java.time.Instant.now());
        application.setOfficerNotes(req.notes());

        switch (req.decision().toUpperCase()) {
            case "APPROVE" -> {
                application.setStatus(VerificationStatus.APPROVED);
                User applicant = application.getUser();
                applicant.setRole(Role.VERIFIED_RESIDENT);
                applicant.setArea(application.getArea());
                userRepository.save(applicant);
            }
            case "REJECT" -> {
                application.setStatus(VerificationStatus.REJECTED);
                application.setRejectionReason(req.notes());
            }
            case "NEEDS_MORE_INFO" -> application.setStatus(VerificationStatus.NEEDS_MORE_INFO);
            default -> throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown decision: " + req.decision());
        }

        return applicationRepository.save(application);
    }
}
