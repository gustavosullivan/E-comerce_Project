package br.edu.atitus.currencyservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients // Ativa o OpenFeign
@EnableCaching      // Ativa o Cache Caffeine
public class CurrencyServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(CurrencyServiceApplication.class, args);
    }
}