package br.edu.atitus.productservice.dtos;

public record ProductRequestDTO(
        String name,
        String description,
        String brand,
        String model,
        String currency,
        Double price,
        Integer stock
) {
}
