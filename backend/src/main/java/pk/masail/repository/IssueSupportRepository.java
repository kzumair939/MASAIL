package pk.masail.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pk.masail.entity.IssueSupport;

import java.util.Optional;

public interface IssueSupportRepository extends JpaRepository<IssueSupport, Long> {
    Optional<IssueSupport> findByIssueIdAndUserId(Long issueId, Long userId);
    long countByIssueId(Long issueId);
    void deleteByIssueIdAndUserId(Long issueId, Long userId);
}
