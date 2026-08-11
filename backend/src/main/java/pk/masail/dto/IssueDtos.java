package pk.masail.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class IssueDtos {

    public record CreateIssueRequest(
            @NotBlank String title,
            @NotBlank String description,
            @NotNull String category,
            @NotBlank String area,
            String society,
            @NotBlank String street,
            Double latitude,
            Double longitude,
            List<String> beforePhotoUrls
    ) {}

    public record IssueResponse(
            Long id,
            String title,
            String description,
            String category,
            String area,
            String society,
            String street,
            Double latitude,
            Double longitude,
            String status,
            int progress,
            int supportCount,
            BigDecimal raisedAmount,
            BigDecimal targetBudget,
            String reportedByName,
            String reportedAt
    ) {}


    public record DonateRequest(
            @NotNull BigDecimal amount,
            String donorNameOverride
    ) {}

    public record ProgressUpdateRequest(
            @NotNull String phase,      // BEFORE / PROGRESS / AFTER
            @NotBlank String photoUrl,
            String note,
            String newStatus            // optional status transition
    ) {}
}
