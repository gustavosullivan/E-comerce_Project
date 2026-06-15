package br.edu.atitus.currencyservice.clients;
import org.springframework.stereotype.Component;

@Component
public class BCBClientFallback implements BCBClient {
    @Override
    public BCBResponse getCotacaoBcb(String moeda, String dataCotacao) {
        // Retorna null para sinalizar que a requisição falhou e acionar o Fallback
        return null;
    }
}