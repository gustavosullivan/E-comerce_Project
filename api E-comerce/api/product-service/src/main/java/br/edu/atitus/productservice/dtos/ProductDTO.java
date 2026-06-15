package br.edu.atitus.productservice.dtos;

public record ProductDTO(
        Long id,
        String description,
        String brand,
        String model,
        String currency,
        Double price,
        Integer stock,
        Double convertedPrice,
        String environment,
        String requestCurrency
) {
}
