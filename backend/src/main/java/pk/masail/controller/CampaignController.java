package pk.masail.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pk.masail.dto.IssueDtos.DonateRequest;
import pk.masail.entity.Campaign;
import pk.masail.security.AuthenticatedUser;
import pk.masail.service.CampaignService;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping
    public Page<Campaign> list(Pageable pageable) {
        return campaignService.list(pageable);
    }

    @GetMapping("/{id}")
    public Campaign get(@PathVariable Long id) {
        return campaignService.get(id);
    }

    /** Requirement #8: recent supporters (name + amount) — already modeled, now backed by real data. */
    @GetMapping("/{id}/supporters")
    public ResponseEntity<?> supporters(@PathVariable Long id) {
        return ResponseEntity.ok(campaignService.recentSupporters(id));
    }

    @PostMapping("/{id}/donate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> donate(@PathVariable Long id,
                                     @AuthenticationPrincipal AuthenticatedUser principal,
                                     @Valid @RequestBody DonateRequest req) {
        return ResponseEntity.ok(campaignService.donate(id, principal, req));
    }
}
