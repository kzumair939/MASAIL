package pk.masail.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pk.masail.config.CacheConfig;
import pk.masail.dto.IssueDtos.*;
import pk.masail.entity.*;
import pk.masail.exception.ApiException;
import pk.masail.repository.*;
import pk.masail.security.AuthenticatedUser;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueService {

    private final IssueRepository issueRepository;
    private final IssuePhotoRepository issuePhotoRepository;
    private final IssueSupportRepository issueSupportRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    /**
     * Requirement #6: only a VERIFIED_RESIDENT (or ADMIN) may create an issue,
     * only within their own verified area, and only for the 3 resident-reportable categories.
     */
    @Transactional
    @CacheEvict(value = CacheConfig.ISSUES_CACHE, allEntries = true)
    public Issue reportIssue(AuthenticatedUser principal, CreateIssueRequest req) {
        User reporter = userRepository.findById(principal.userId())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (reporter.getRole() != Role.VERIFIED_RESIDENT && reporter.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                    "Only Verified Residents can report an issue. Apply for verification first.");
        }

        IssueCategory category;
        try {
            category = IssueCategory.valueOf(req.category());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown category: " + req.category());
        }

        if (!IssueCategory.isResidentReportable(category) && reporter.getRole() != Role.ADMIN) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                    "Residents may only report Road, Street Light, or Sewerage/Nala issues.");
        }

        if (reporter.getRole() == Role.VERIFIED_RESIDENT
                && reporter.getArea() != null
                && !reporter.getArea().equalsIgnoreCase(req.area())) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                    "You can only report issues in your verified area: " + reporter.getArea());
        }

        Issue issue = Issue.builder()
                .title(req.title())
                .description(req.description())
                .category(category)
                .area(req.area())
                .society(req.society())
                .street(req.street())
                .latitude(req.latitude())
                .longitude(req.longitude())
                .status(IssueStatus.REPORTED)
                .reportedBy(reporter)
                .build();

        issue = issueRepository.save(issue);

        if (req.beforePhotoUrls() != null) {
            for (String url : req.beforePhotoUrls()) {
                IssuePhoto photo = IssuePhoto.builder()
                        .issue(issue)
                        .phase(PhotoPhase.BEFORE)
                        .url(url)
                        .uploadedBy(reporter)
                        .build();
                issuePhotoRepository.save(photo);
            }
        }
        return issue;
    }

    @Cacheable(value = CacheConfig.ISSUES_CACHE, key = "#area + '-' + #status + '-' + #pageable.pageNumber")
    public Page<Issue> listIssues(String area, String status, Pageable pageable) {
        // When an explicit status is requested, return exactly that status (admin/officer use-case).
        if (status != null && !status.isBlank()) {
            return issueRepository.findByStatus(IssueStatus.valueOf(status), pageable);
        }
        // Public listing: only show issues that have been acted on by an officer.
        // Issues still in REPORTED state are not yet confirmed and must stay hidden.
        if (area != null && !area.isBlank()) {
            return issueRepository.findByAreaIgnoreCaseAndStatusNot(area, IssueStatus.REPORTED, pageable);
        }
        return issueRepository.findByStatusNot(IssueStatus.REPORTED, pageable);
    }

    public Issue getIssue(Long id) {
        return issueRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Issue not found"));
    }

    @Transactional
    @CacheEvict(value = CacheConfig.ISSUE_DETAIL_CACHE, key = "#issueId")
    public void toggleSupport(Long issueId, AuthenticatedUser principal) {
        Issue issue = getIssue(issueId);
        var existing = issueSupportRepository.findByIssueIdAndUserId(issueId, principal.userId());
        if (existing.isPresent()) {
            issueSupportRepository.delete(existing.get());
            issue.setSupportCount(Math.max(0, issue.getSupportCount() - 1));
        } else {
            User user = userRepository.getReferenceById(principal.userId());
            issueSupportRepository.save(IssueSupport.builder().issue(issue).user(user).build());
            issue.setSupportCount(issue.getSupportCount() + 1);
        }
        issueRepository.save(issue);
    }

    @Transactional
    @CacheEvict(value = CacheConfig.ISSUE_DETAIL_CACHE, key = "#issueId")
    public Donation donate(Long issueId, AuthenticatedUser principal, DonateRequest req) {
        Issue issue = getIssue(issueId);
        User donor = userRepository.getReferenceById(principal.userId());

        Donation donation = Donation.builder()
                .issue(issue)
                .donor(donor)
                .donorName(req.donorNameOverride() != null ? req.donorNameOverride() : donor.getName())
                .area(donor.getArea())
                .amount(req.amount())
                .build();
        donationRepository.save(donation);

        issue.setRaisedAmount(issue.getRaisedAmount().add(req.amount()));
        issueRepository.save(issue);
        return donation;
    }

    public List<Donation> recentSupporters(Long issueId) {
        return donationRepository.findTop10ByIssueIdOrderByDonatedAtDesc(issueId);
    }

    public List<IssuePhoto> photosByPhase(Long issueId, PhotoPhase phase) {
        return issuePhotoRepository.findByIssueIdAndPhase(issueId, phase);
    }

    /**
     * Requirement #7: a Field Officer uploads Before/Progress/After photos and can
     * advance the issue's status, which drives the resident-facing Process Tracker %.
     */
    @Transactional
    @CacheEvict(value = CacheConfig.ISSUE_DETAIL_CACHE, key = "#issueId")
    public Issue postProgressUpdate(Long issueId, AuthenticatedUser principal, ProgressUpdateRequest req) {
        Issue issue = getIssue(issueId);
        User officer = userRepository.getReferenceById(principal.userId());

        PhotoPhase phase;
        try {
            phase = PhotoPhase.valueOf(req.phase());
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Unknown phase: " + req.phase());
        }

        issuePhotoRepository.save(IssuePhoto.builder()
                .issue(issue)
                .phase(phase)
                .url(req.photoUrl())
                .uploadedBy(officer)
                .build());

        if (req.newStatus() != null && !req.newStatus().isBlank()) {
            IssueStatus newStatus = IssueStatus.valueOf(req.newStatus());
            issue.setStatus(newStatus);
            issue.setProgress(progressForStatus(newStatus));
            if (issue.getAssignedOfficer() == null) {
                issue.setAssignedOfficer(officer);
            }
        }
        return issueRepository.save(issue);
    }

    private int progressForStatus(IssueStatus status) {
        return switch (status) {
            case REPORTED -> 10;
            case UNDER_REVIEW -> 30;
            case ASSIGNED -> 50;
            case IN_PROGRESS -> 75;
            case RESOLVED -> 100;
            case REJECTED -> 0;
        };
    }

    public Page<Issue> assignedTo(Long officerId, Pageable pageable) {
        return issueRepository.findByAssignedOfficerId(officerId, pageable);
    }

    public IssueResponse toResponse(Issue issue) {
        return new IssueResponse(
                issue.getId(), issue.getTitle(), issue.getDescription(), issue.getCategory().name(),
                issue.getArea(), issue.getSociety(), issue.getStreet(), issue.getLatitude(), issue.getLongitude(),
                issue.getStatus().name(), issue.getProgress(), issue.getSupportCount(), issue.getRaisedAmount(),
                issue.getTargetBudget(),
                issue.getReportedBy() != null ? issue.getReportedBy().getName() : "Anonymous",
                issue.getReportedAt().toString()
        );
    }


    public List<IssueResponse> toResponseList(List<Issue> issues) {
        return issues.stream().map(this::toResponse).collect(Collectors.toList());
    }
}
