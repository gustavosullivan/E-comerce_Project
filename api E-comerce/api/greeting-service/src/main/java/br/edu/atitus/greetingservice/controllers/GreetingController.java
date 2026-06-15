package br.edu.atitus.greetingservice.controllers;

import br.edu.atitus.greetingservice.configs.GreetingConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/greeting")
public class GreetingController {

//    @Value("${greeting-service.greeting}")
//    private String greeting;
//    @Value("${greeting-service.default-name}")
//    private String defaultName;

    private final GreetingConfig config;

    public GreetingController(GreetingConfig config) {
        this.config = config;
    }


    @GetMapping({"", "/", "/{namePath}"})
    public ResponseEntity<String> getGreeting(
            @RequestParam(required = false) String name,
            @PathVariable(required = false) String namePath
    ) {
        if (name == null) {
            name = namePath != null ? namePath : config.getDefaultName();
        }

        String retorno = String.format("%s %s!!!", config.getGreeting(), name);
        return ResponseEntity.ok(retorno);
    }
}
