package br.edu.atitus.currencyservice.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import io.github.resilience4j.retry.annotation.Retry;

// Nome e Fallback EXATOS exigidos pela avaliação
@FeignClient(name = "bcb-client", url = "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata", fallback = BCBClientFallback.class)
public interface BCBClient {

    @GetMapping(value = "/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='{moeda}'&@dataCotacao='{dataCotacao}'&$format=json")
    @Retry(name = "bcb-client") // Ativa o Retry do Resilience4j
    BCBResponse getCotacaoBcb(@PathVariable("moeda") String moeda, @PathVariable("dataCotacao") String dataCotacao);
}