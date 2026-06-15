package br.edu.atitus.authservice.controllers;

import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.authservice.components.JwtUtil;
import br.edu.atitus.authservice.dtos.SigninDTO;
import br.edu.atitus.authservice.dtos.SigninResponseDTO;
import br.edu.atitus.authservice.dtos.SignupDTO;
import br.edu.atitus.authservice.entities.UserEntity;
import br.edu.atitus.authservice.entities.UserType;
import br.edu.atitus.authservice.services.UserService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private UserService service;
    private final AuthenticationConfiguration authConfig;

    public AuthController(UserService service, AuthenticationConfiguration authConfig) {
        super();
        this.service = service;
        this.authConfig = authConfig;
    }

    private UserEntity convertDTO2Entity(SignupDTO dto) {
        var user = new UserEntity();
        BeanUtils.copyProperties(dto, user);
        return user;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserEntity> signup(@RequestBody SignupDTO dto) throws Exception {
        var user = convertDTO2Entity(dto);
        user.setType(UserType.Common);
        service.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/signin")
    public ResponseEntity<SigninResponseDTO> PostSignin(@RequestBody SigninDTO signin) throws AuthenticationException, Exception {
        authConfig.getAuthenticationManager()
                .authenticate(new UsernamePasswordAuthenticationToken(signin.email(), signin.password()));
        UserEntity user = (UserEntity) service.loadUserByUsername(signin.email());
        SigninResponseDTO response = new SigninResponseDTO(user, JwtUtil.generateToken(user.getEmail(), user.getId(), user.getType()));
        return ResponseEntity.ok(response);

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        String cleanMessage = e.getMessage().replaceAll("[\\r\\n]", " ");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(cleanMessage);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleException(AuthenticationException e) {
        String cleanMessage = e.getMessage().replaceAll("[\\r\\n]", " ");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(cleanMessage);
    }
}