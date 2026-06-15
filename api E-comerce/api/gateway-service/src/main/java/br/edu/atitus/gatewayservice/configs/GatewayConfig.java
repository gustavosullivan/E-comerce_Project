package br.edu.atitus.gatewayservice.configs;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class GatewayConfig {

    @Bean
    RouteLocator getGatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route(p -> p
                        .path("/get")
                        .filters(f -> f
                                .addRequestHeader("X-User-Name", "Teste"))
                        .uri("http://httpbin.org"))
                .route(p -> p
                        .path("/products/**")
                        .uri("lb://product-service"))
                .route(p -> p
                        .path("/currency/**")
                        .uri("lb://currency-service"))
                .route(p -> p
                        .path("/auth/**")
                        .uri("lb://auth-service"))
                .build();
    }
}
