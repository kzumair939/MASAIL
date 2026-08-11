package pk.masail.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pk.masail.dto.VerificationDtos.*;
import pk.masail.entity.VerificationApplication;
import pk.masail.security.AuthenticatedUser;
import pk.masail.service.VerificationService;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    /** Requirement #3/#4: a User applies to become a Verified Resident. */
    @PostMapping("/apply")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VerificationApplication> apply(@AuthenticationPrincipal AuthenticatedUser principal,
                                                           @Valid @RequestBody ApplyRequest req) {
        return ResponseEntity.ok(verificationService.apply(principal, req));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VerificationApplication> mine(@AuthenticationPrincipal AuthenticatedUser principal) {
        return ResponseEntity.ok(verificationService.myLatestApplication(principal.userId()));
    }

    /** Requirement #5: Verification Officer review queue + decision. */
    @GetMapping("/review-queue")
    @PreAuthorize("hasAnyRole('VERIFICATION_OFFICER','ADMIN')")
    public Page<VerificationApplication> queue(Pageable pageable) {
        return verificationService.queue(pageable);
    }

    @GetMapping("/review-queue/{id}")
    @PreAuthorize("hasAnyRole('VERIFICATION_OFFICER','ADMIN')")
    public VerificationApplication getOne(@PathVariable Long id) {
        return verificationService.getApplication(id);
    }

    @PostMapping("/review-queue/{id}/review")
    @PreAuthorize("hasAnyRole('VERIFICATION_OFFICER','ADMIN')")
    public ResponseEntity<VerificationApplication> review(@PathVariable Long id,
                                                            @AuthenticationPrincipal AuthenticatedUser principal,
                                                            @Valid @RequestBody ReviewRequest req) {
        return ResponseEntity.ok(verificationService.review(id, principal, req));
    }
}
