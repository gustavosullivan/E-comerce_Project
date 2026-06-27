package br.edu.atitus.productservice.controllers;

import br.edu.atitus.productservice.clients.CurrencyClient;
import br.edu.atitus.productservice.clients.CurrencyResponse;
import br.edu.atitus.productservice.dtos.ProductDTO;
import br.edu.atitus.productservice.dtos.ProductRequestDTO;
import br.edu.atitus.productservice.entities.ProductEntity;
import br.edu.atitus.productservice.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getProducts(
            @RequestParam(defaultValue = "BRL") String targetCurrency) {
        String currency = targetCurrency.toUpperCase();
        List<ProductDTO> products = repository.findAll()
                .stream()
                .map(entity -> convertEntityToDTO(entity, currency))
                .toList();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(
            @PathVariable Long id,
            @RequestParam String targetCurrency) throws Exception {
        targetCurrency = targetCurrency.toUpperCase();

        ProductEntity entity = repository.findById(id)
                .orElseThrow(() -> new Exception("Product not found!"));
        return ResponseEntity.ok(convertEntityToDTO(entity, targetCurrency));
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductRequestDTO request) throws Exception {
        ProductEntity entity = new ProductEntity();
        applyRequestToEntity(entity, request);
        ProductEntity saved = repository.save(entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertEntityToDTO(saved, saved.getCurrency()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequestDTO request) throws Exception {
        ProductEntity entity = repository.findById(id)
                .orElseThrow(() -> new Exception("Product not found!"));
        applyRequestToEntity(entity, request);
        ProductEntity saved = repository.save(entity);
        return ResponseEntity.ok(convertEntityToDTO(saved, saved.getCurrency()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) throws Exception {
        if (!repository.existsById(id)) {
            throw new Exception("Product not found!");
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ProductDTO convertEntityToDTO(ProductEntity entity, String targetCurrency) {
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


        return new ProductDTO(
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
    }

    private void applyRequestToEntity(ProductEntity entity, ProductRequestDTO request) throws Exception {
        if (request == null) {
            throw new Exception("Product data is required!");
        }

        String name = normalize(request.name());
        String description = normalize(request.description());
        String brand = normalize(request.brand());
        String model = normalize(request.model());
        String currency = normalize(request.currency());

        entity.setDescription(firstNonBlank(description, name, entity.getDescription(), "Produto"));
        entity.setBrand(firstNonBlank(brand, name, entity.getBrand(), "Bugiganga"));
        entity.setModel(firstNonBlank(model, name, entity.getModel(), entity.getDescription()));
        entity.setCurrency(firstNonBlank(currency, entity.getCurrency(), "BRL").toUpperCase());

        if (request.price() != null) {
            if (request.price() < 0) {
                throw new Exception("Product price must be positive!");
            }
            entity.setPrice(request.price());
        } else if (entity.getPrice() == null) {
            throw new Exception("Product price is required!");
        }

        if (request.stock() != null) {
            if (request.stock() < 0) {
                throw new Exception("Product stock must be positive!");
            }
            entity.setStock(request.stock());
        } else if (entity.getStock() == null) {
            entity.setStock(0);
        }
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            String normalized = normalize(value);
            if (normalized != null) {
                return normalized;
            }
        }
        return null;
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e){
        String message = e.getMessage().replace("/r/n", "");
        return ResponseEntity.badRequest().body(message);
    }

}
