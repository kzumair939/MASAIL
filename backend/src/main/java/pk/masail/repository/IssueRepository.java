package pk.masail.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pk.masail.entity.Issue;
import pk.masail.entity.IssueStatus;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    Page<Issue> findByArea(String area, Pageable pageable);
    Page<Issue> findByStatus(IssueStatus status, Pageable pageable);
    Page<Issue> findByAssignedOfficerId(Long officerId, Pageable pageable);
    Page<Issue> findByReportedById(Long userId, Pageable pageable);

    /** Returns all issues that have been confirmed by an officer (excludes the given status). */
    Page<Issue> findByStatusNot(IssueStatus status, Pageable pageable);

    /** Confirmed issues filtered by area. */
    Page<Issue> findByAreaIgnoreCaseAndStatusNot(String area, IssueStatus status, Pageable pageable);
}
