package br.edu.atitus.productservice.clients;

public record CurrencyResponse(
        String sourceCurrency,
        String targetCurrency,
        Double conversionRate,
        String environment) {
}
