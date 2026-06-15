package br.edu.atitus.authservice.dtos;

import br.edu.atitus.authservice.entities.UserEntity;

public record SigninResponseDTO(UserEntity user, String token) {

}
