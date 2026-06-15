package br.edu.atitus.authservice.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ConfigSecurity {
    @Bean
        // SecurityFilterChain getFilterChain(HttpSecurity http, AuthTokenFilter
        // authTokenFilter) throws Exception {
    SecurityFilterChain getFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // .requestMatchers("/auth*","/auth/**","/swagger-ui*", "swagger-ui/**",
                        // "/v3/api-docs/**").permitAll()
                        // .requestMatchers(HttpMethod.OPTIONS).permitAll()
                        .requestMatchers("/ws**", "/ws/**").authenticated().anyRequest().permitAll())
        //.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);
        ;
        return http.build();
    }

    @Bean
    WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*");
            }
        };
    }

    @Bean
    PasswordEncoder getpPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
