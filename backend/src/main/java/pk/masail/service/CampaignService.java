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
import pk.masail.dto.IssueDtos.DonateRequest;
import pk.masail.entity.Campaign;
import pk.masail.entity.CampaignStatus;
import pk.masail.entity.Donation;
import pk.masail.entity.User;
import pk.masail.exception.ApiException;
import pk.masail.repository.CampaignRepository;
import pk.masail.repository.DonationRepository;
import pk.masail.repository.UserRepository;
import pk.masail.security.AuthenticatedUser;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    @Cacheable(value = CacheConfig.CAMPAIGNS_CACHE, key = "#pageable.pageNumber")
    public Page<Campaign> list(Pageable pageable) {
        return campaignRepository.findAll(pageable);
    }

    public Campaign get(Long id) {
        return campaignRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Campaign not found"));
    }

    @Transactional
    @CacheEvict(value = CacheConfig.CAMPAIGNS_CACHE, allEntries = true)
    public Donation donate(Long campaignId, AuthenticatedUser principal, DonateRequest req) {
        Campaign campaign = get(campaignId);
        User donor = userRepository.getReferenceById(principal.userId());

        Donation donation = Donation.builder()
                .campaign(campaign)
                .donor(donor)
                .donorName(req.donorNameOverride() != null ? req.donorNameOverride() : donor.getName())
                .area(donor.getArea())
                .amount(req.amount())
                .build();
        donationRepository.save(donation);

        campaign.setRaisedAmount(campaign.getRaisedAmount().add(req.amount()));
        if (campaign.getRaisedAmount().compareTo(campaign.getGoalAmount()) >= 0) {
            campaign.setStatus(CampaignStatus.FUNDED);
        }
        campaignRepository.save(campaign);
        return donation;
    }

    public List<Donation> recentSupporters(Long campaignId) {
        return donationRepository.findTop10ByCampaignIdOrderByDonatedAtDesc(campaignId);
    }
}
