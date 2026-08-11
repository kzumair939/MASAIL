package pk.masail.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Redis-backed cache layer. Different TTLs per cache region so hot,
 * rarely-changing reads (issue feed, campaign feed, area list) stay fast
 * without serving stale data on things that change often (review queue).
 */
@Configuration
@EnableCaching
public class CacheConfig {

    public static final String ISSUES_CACHE = "issues";
    public static final String ISSUE_DETAIL_CACHE = "issueDetail";
    public static final String CAMPAIGNS_CACHE = "campaigns";
    public static final String AREAS_CACHE = "areas";
    public static final String USER_PROFILE_CACHE = "userProfile";

    @Bean
    public RedisCacheManager cacheManager(RedisConnectionFactory connectionFactory, ObjectMapper objectMapper) {
        RedisCacheConfiguration base = RedisCacheConfiguration.defaultCacheConfig()
                .serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer(objectMapper)))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> perCacheConfig = new HashMap<>();
        perCacheConfig.put(ISSUES_CACHE, base.entryTtl(Duration.ofMinutes(2)));
        perCacheConfig.put(ISSUE_DETAIL_CACHE, base.entryTtl(Duration.ofMinutes(5)));
        perCacheConfig.put(CAMPAIGNS_CACHE, base.entryTtl(Duration.ofMinutes(5)));
        perCacheConfig.put(AREAS_CACHE, base.entryTtl(Duration.ofHours(12)));
        perCacheConfig.put(USER_PROFILE_CACHE, base.entryTtl(Duration.ofMinutes(10)));

        return RedisCacheManager.builder(connectionFactory)
                .cacheDefaults(base.entryTtl(Duration.ofMinutes(1)))
                .withInitialCacheConfigurations(perCacheConfig)
                .build();
    }
}
