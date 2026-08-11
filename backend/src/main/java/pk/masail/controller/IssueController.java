package pk.masail.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pk.masail.dto.IssueDtos.*;
import pk.masail.entity.Issue;
import pk.masail.entity.IssuePhoto;
import pk.masail.entity.PhotoPhase;
import pk.masail.security.AuthenticatedUser;
import pk.masail.service.IssueService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
public class IssueController {

    private final IssueService issueService;

    @GetMapping
    public Page<IssueResponse> list(@RequestParam(required = false) String area,
                                     @RequestParam(required = false) String status,
                                     Pageable pageable) {
        return issueService.listIssues(area, status, pageable).map(issueService::toResponse);
    }

    @GetMapping("/{id}")
    public IssueResponse get(@PathVariable Long id) {
        return issueService.toResponse(issueService.getIssue(id));
    }

    @GetMapping("/{id}/photos")
    public Map<String, List<String>> photos(@PathVariable Long id) {
        return Map.of(
                "before", urls(issueService.photosByPhase(id, PhotoPhase.BEFORE)),
                "progress", urls(issueService.photosByPhase(id, PhotoPhase.PROGRESS)),
                "after", urls(issueService.photosByPhase(id, PhotoPhase.AFTER))
        );
    }

    private List<String> urls(List<IssuePhoto> photos) {
        return photos.stream().map(IssuePhoto::getUrl).toList();
    }

    /** Requirement #6: only VERIFIED_RESIDENT / ADMIN can create — enforced again in the service layer. */
    @PostMapping
    @PreAuthorize("hasAnyRole('VERIFIED_RESIDENT','ADMIN')")
    public ResponseEntity<IssueResponse> report(@AuthenticationPrincipal AuthenticatedUser principal,
                                                 @Valid @RequestBody CreateIssueRequest req) {
        Issue issue = issueService.reportIssue(principal, req);
        return ResponseEntity.ok(issueService.toResponse(issue));
    }

    /** Requirement #1: any logged-in user can vote/support. */
    @PostMapping("/{id}/support")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> support(@PathVariable Long id, @AuthenticationPrincipal AuthenticatedUser principal) {
        issueService.toggleSupport(id, principal);
        return ResponseEntity.noContent().build();
    }

    /** Requirement #1: any logged-in user can donate to an issue. */
    @PostMapping("/{id}/donate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> donate(@PathVariable Long id,
                                     @AuthenticationPrincipal AuthenticatedUser principal,
                                     @Valid @RequestBody DonateRequest req) {
        return ResponseEntity.ok(issueService.donate(id, principal, req));
    }

    @GetMapping("/{id}/supporters")
    public ResponseEntity<?> supporters(@PathVariable Long id) {
        return ResponseEntity.ok(issueService.recentSupporters(id));
    }

    /** Requirement #7: Field Officer posts a progress update / photo / status change. */
    @PostMapping("/{id}/progress")
    @PreAuthorize("hasAnyRole('FIELD_OFFICER','ADMIN')")
    public ResponseEntity<IssueResponse> progress(@PathVariable Long id,
                                                   @AuthenticationPrincipal AuthenticatedUser principal,
                                                   @Valid @RequestBody ProgressUpdateRequest req) {
        return ResponseEntity.ok(issueService.toResponse(issueService.postProgressUpdate(id, principal, req)));
    }
}
