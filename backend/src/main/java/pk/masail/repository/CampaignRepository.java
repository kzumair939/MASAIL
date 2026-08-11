package pk.masail.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import pk.masail.entity.Campaign;

public interface CampaignRepository extends JpaRepository<Campaign, Long> {
    Page<Campaign> findAll(Pageable pageable);
}
