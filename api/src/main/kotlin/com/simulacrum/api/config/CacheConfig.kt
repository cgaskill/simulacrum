package com.simulacrum.api.config

import org.ehcache.config.builders.CacheConfigurationBuilder
import org.ehcache.config.builders.ExpiryPolicyBuilder
import org.ehcache.config.builders.ResourcePoolsBuilder
import org.ehcache.jsr107.Eh107Configuration
import org.springframework.boot.autoconfigure.AutoConfigureBefore
import org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Duration


@EnableCaching(proxyTargetClass = true)
@Configuration
@AutoConfigureBefore(value = [CacheAutoConfiguration::class])
class CacheConfig {

    @Bean
    fun cacheConfigurationCustomizer(): JCacheManagerCustomizer {
        return JCacheManagerCustomizer {
            it.createCache("buckets", createBucketsCacheConfiguration())
        }
    }

    private fun createBucketsCacheConfiguration(): javax.cache.configuration.Configuration<Any, Any> {
        return Eh107Configuration.fromEhcacheCacheConfiguration<Any, Any>(
                CacheConfigurationBuilder.newCacheConfigurationBuilder<Any, Any>(
                        Any::class.java,
                        Any::class.java,
                        ResourcePoolsBuilder.heap(100)
                ).withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(3600)))
        )
    }
}
