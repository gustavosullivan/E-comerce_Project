package br.edu.atitus.currencyservice.controllers;

import br.edu.atitus.currencyservice.clients.BCBClient;
import br.edu.atitus.currencyservice.clients.BCBResponse;
import br.edu.atitus.currencyservice.dtos.CurrencyDTO;
import br.edu.atitus.currencyservice.entities.CurrencyEntity;
import br.edu.atitus.currencyservice.repositories.CurrencyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/currency")
public class CurrencyController {

    @Autowired
    private Environment environment;

    @Autowired
    private CurrencyRepository currencyRepository;

    @Autowired
    private BCBClient bcbClient;

    @Autowired
    private CacheManager cacheManager;

    @GetMapping("/convert")
    public ResponseEntity<CurrencyDTO> getCurrency(
            @RequestParam String source,
            @RequestParam String target) {

        // Busca usando o método que realmente existe no repositório
        CurrencyEntity currencyEntity = currencyRepository.findBySourceCurrencyAndTargetCurrency(source, target)
                .orElseThrow(() -> new RuntimeException("Currency not found"));

        String port = environment.getProperty("local.server.port");
        String dataFixaCotacao = "05-14-2026";
        String nameCache = "bcb-currency";
        Double cotacaoBcb = null;

        var cacheInfo = cacheManager.getCache(nameCache).get(source);

        if (cacheInfo != null) {
            cotacaoBcb = (Double) cacheInfo.get();
            port += " - BCB in cache";
        } else {
            BCBResponse response = bcbClient.getCotacaoBcb(source, dataFixaCotacao);

            if (response != null && response.getValue() != null && !response.getValue().isEmpty()) {
                cotacaoBcb = response.getValue().get(0).getCotacaoVenda();
                cacheManager.getCache(nameCache).put(source, cotacaoBcb);
            } else {
                port += " - BCB Fallback";
            }
        }

        Double finalRate = (cotacaoBcb != null) ? cotacaoBcb : currencyEntity.getConversionRate();

        // Usa o DTO para retornar os dados para evitar erros de set em propriedades que não existem na Entity
        CurrencyDTO dto = new CurrencyDTO(source, target, finalRate, port);

        return ResponseEntity.ok(dto);
    }
}