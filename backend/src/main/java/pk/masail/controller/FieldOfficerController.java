package pk.masail.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pk.masail.dto.IssueDtos.IssueResponse;
import pk.masail.security.AuthenticatedUser;
import pk.masail.service.IssueService;

/** Requirement #7: Field Officer's own "Assigned Projects" list. */
@RestController
@RequestMapping("/api/field")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('FIELD_OFFICER','ADMIN')")
public class FieldOfficerController {

    private final IssueService issueService;

    @GetMapping("/assigned-projects")
    public Page<IssueResponse> assigned(@AuthenticationPrincipal AuthenticatedUser principal, Pageable pageable) {
        return issueService.assignedTo(principal.userId(), pageable).map(issueService::toResponse);
    }
}
