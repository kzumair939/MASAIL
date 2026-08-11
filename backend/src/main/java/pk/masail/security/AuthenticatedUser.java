package pk.masail.security;

public record AuthenticatedUser(Long userId, String email, String role) {}
