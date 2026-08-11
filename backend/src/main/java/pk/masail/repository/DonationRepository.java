package pk.masail.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pk.masail.entity.Donation;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findTop10ByIssueIdOrderByDonatedAtDesc(Long issueId);
    List<Donation> findTop10ByCampaignIdOrderByDonatedAtDesc(Long campaignId);
}
