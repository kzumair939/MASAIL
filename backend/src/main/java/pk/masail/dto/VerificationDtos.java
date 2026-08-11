package pk.masail.dto;

import jakarta.validation.constraints.NotBlank;

public class VerificationDtos {

    public record ApplyRequest(
            @NotBlank String fullName,
            @NotBlank String cnicNumber,
            @NotBlank String email,
            @NotBlank String mobileNumber,
            @NotBlank String area,
            String society,
            String street,
            String utilityBillNumber,
            String utilityBillPhotoUrl,
            String cnicFrontPhotoUrl,
            String cnicBackPhotoUrl,
            String profilePhotoUrl
    ) {}

    public record ReviewRequest(
            @NotBlank String decision,   // APPROVE / REJECT / NEEDS_MORE_INFO
            String notes
    ) {}
}
