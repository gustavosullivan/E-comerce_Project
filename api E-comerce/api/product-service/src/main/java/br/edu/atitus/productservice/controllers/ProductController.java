package br.edu.atitus.productservice.controllers;

import br.edu.atitus.productservice.clients.CurrencyClient;
import br.edu.atitus.productservice.clients.CurrencyResponse;
import br.edu.atitus.productservice.dtos.ProductDTO;
import br.edu.atitus.productservice.entities.ProductEntity;
import br.edu.atitus.productservice.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("products")
public class ProductController {

    private final ProductRepository repository;
    private final CurrencyClient currencyClient;
    private final CacheManager cacheManager;

    public ProductController(ProductRepository repository, CurrencyClient currencyClient, CacheManager cacheManager) {
        this.repository = repository;
        this.currencyClient = currencyClient;
        this.cacheManager = cacheManager;
    }

    @Value("${server.port}")
    private String port;

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(
            @PathVariable Long id,
            @RequestParam String targetCurrency) throws Exception {
        targetCurrency = targetCurrency.toUpperCase();

        ProductEntity entity = repository.findById(id)
                .orElseThrow(() -> new Exception("Product not found!"));
        Double convertedPrice;
        String environment = "Product-service running on port: " + port;
        String requestCurrency = targetCurrency;


        if (targetCurrency.equals(entity.getCurrency())) {
            convertedPrice = entity.getPrice();
        } else {
            String nameCache="ConvertedValue";
            String keyCache= entity.getCurrency() + "-" +  targetCurrency;
            Double convertedValue = cacheManager.getCache(nameCache).get(keyCache, Double.class);
            //convertedValue=null; //Para testar sem cache
            if (convertedValue == null){
                CurrencyResponse currency = currencyClient.getCurrency(entity.getCurrency(), targetCurrency);
                if (currency != null) {
                    convertedPrice = currency.conversionRate() * entity.getPrice();
                    environment = environment + " - " + currency.environment();
                    cacheManager.getCache(nameCache).put(keyCache, currency.conversionRate());
                } else {
                    convertedPrice = -1.0;
                    environment = environment + " - Currency Fallback";
                }
            } else {
                convertedPrice = convertedValue * entity.getPrice();
                environment = environment + " - Currency in cache";
            }
        }


        ProductDTO dto = new ProductDTO(
                entity.getId(),
                entity.getDescription(),
                entity.getBrand(),
                entity.getModel(),
                entity.getCurrency(),
                entity.getPrice(),
                entity.getStock(),
                convertedPrice,
                environment,
                requestCurrency
        );

        return ResponseEntity.ok(dto);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e){
        String message = e.getMessage().replace("/r/n", "");
        return ResponseEntity.badRequest().body(message);
    }

}
