package br.edu.atitus.currencyservice.dtos;

public record CurrencyDTO(
        String sourceCurrency,
        String targetCurrency,
        Double conversionRate,
        String environment) {
}
