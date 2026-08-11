package pk.masail;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("local")
class MasailApplicationTests {

    @Test
    void contextLoads() {
        // Verifies the full Spring context (security, JPA, cache) wires up correctly.
    }
}
