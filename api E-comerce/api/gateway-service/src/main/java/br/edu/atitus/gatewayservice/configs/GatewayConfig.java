package br.edu.atitus.gatewayservice.configs;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.List;


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
                        .uri("http://127.0.0.1:8000"))
                .route(p -> p
                        .path("/currency/**")
                        .uri("http://127.0.0.1:8001"))
                .route(p -> p
                        .path("/auth/**")
                        .uri("http://127.0.0.1:8900"))
                .build();
    }

    @Bean
    WebFilter corsHeaderFilter() {
        return (ServerWebExchange exchange, WebFilterChain chain) -> {
            String origin = exchange.getRequest().getHeaders().getOrigin();
            String allowedOrigin = origin != null ? origin : "*";

            if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
                var headers = exchange.getResponse().getHeaders();
                headers.setAccessControlAllowOrigin(allowedOrigin);
                headers.setAccessControlAllowMethods(List.of(
                        HttpMethod.GET,
                        HttpMethod.POST,
                        HttpMethod.PUT,
                        HttpMethod.DELETE,
                        HttpMethod.OPTIONS
                ));
                headers.setAccessControlAllowHeaders(List.of(
                        HttpHeaders.CONTENT_TYPE,
                        HttpHeaders.AUTHORIZATION,
                        HttpHeaders.ACCEPT,
                        HttpHeaders.ORIGIN
                ));
                headers.setAccessControlExposeHeaders(List.of(HttpHeaders.AUTHORIZATION));
                exchange.getResponse().setStatusCode(HttpStatus.OK);
                return exchange.getResponse().setComplete();
            }

            exchange.getResponse().beforeCommit(() -> {
                var headers = exchange.getResponse().getHeaders();
                headers.setAccessControlAllowOrigin(allowedOrigin);
                headers.setAccessControlAllowMethods(List.of(
                        HttpMethod.GET,
                        HttpMethod.POST,
                        HttpMethod.PUT,
                        HttpMethod.DELETE,
                        HttpMethod.OPTIONS
                ));
                headers.setAccessControlAllowHeaders(List.of(
                        HttpHeaders.CONTENT_TYPE,
                        HttpHeaders.AUTHORIZATION,
                        HttpHeaders.ACCEPT,
                        HttpHeaders.ORIGIN
                ));
                headers.setAccessControlExposeHeaders(List.of(HttpHeaders.AUTHORIZATION));
                return Mono.empty();
            });

            return chain.filter(exchange);
        };
    }
}
