package pk.masail.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pk.masail.entity.IssuePhoto;
import pk.masail.entity.PhotoPhase;

import java.util.List;

public interface IssuePhotoRepository extends JpaRepository<IssuePhoto, Long> {
    List<IssuePhoto> findByIssueIdAndPhase(Long issueId, PhotoPhase phase);
}
