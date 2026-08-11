package pk.masail.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import pk.masail.entity.Role;
import pk.masail.entity.User;
import pk.masail.repository.UserRepository;


@Configuration
@RequiredArgsConstructor
@Profile({"local", "docker"})
public class DataSeeder {

    @Bean
    public CommandLineRunner seed(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            userRepository.save(User.builder()
                    .name("Ayesha Khan")
                    .email("user@masail.pk")
                    .passwordHash(encoder.encode("Password123"))
                    .role(Role.USER)
                    .build());

            userRepository.save(User.builder()
                    .name("Bilal Ahmed")
                    .email("resident@masail.pk")
                    .passwordHash(encoder.encode("Password123"))
                    .role(Role.VERIFIED_RESIDENT)
                    .area("Gulshan-e-Iqbal")
                    .build());

            userRepository.save(User.builder()
                    .name("Sana Malik")
                    .email("officer@masail.pk")
                    .passwordHash(encoder.encode("Password123"))
                    .role(Role.VERIFICATION_OFFICER)
                    .build());

            userRepository.save(User.builder()
                    .name("Usman Tariq")
                    .email("field@masail.pk")
                    .passwordHash(encoder.encode("Password123"))
                    .role(Role.FIELD_OFFICER)
                    .build());

            userRepository.save(User.builder()
                    .name("Admin")
                    .email("admin@masail.pk")
                    .passwordHash(encoder.encode("Password123"))
                    .role(Role.ADMIN)
                    .build());
        };
    }
}
