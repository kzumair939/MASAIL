package pk.masail.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pk.masail.entity.VerificationApplication;
import pk.masail.entity.VerificationStatus;

import java.util.Optional;

public interface VerificationApplicationRepository extends JpaRepository<VerificationApplication, Long> {
    Page<VerificationApplication> findByStatus(VerificationStatus status, Pageable pageable);
    Optional<VerificationApplication> findTopByUserIdOrderBySubmittedAtDesc(Long userId);
}
