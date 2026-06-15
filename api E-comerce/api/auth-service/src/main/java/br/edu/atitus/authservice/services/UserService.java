package br.edu.atitus.authservice.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.atitus.authservice.components.Validator;
import br.edu.atitus.authservice.entities.UserEntity;
import br.edu.atitus.authservice.repositories.UserRepository;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository userRepository, PasswordEncoder encoder) {
        super();
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    private void validate(UserEntity user) throws Exception {
        if (user.getName() == null || user.getName().isEmpty())
            throw new Exception("Nome informado inválido");
        if (user.getEmail() == null || user.getEmail().isEmpty() || !Validator.validateEmail(user.getEmail()))
            throw new Exception("E-mail informado inválido");
        if (user.getPassword() == null || user.getPassword().isEmpty())
            throw new Exception("Senha informada inválida");

        if (user.getId() != null) {
            if (userRepository.existsByEmailAndIdNot(user.getEmail(), user.getId()))
                throw new Exception("Já existe usuário com este e-mail");
        } else {
            if (userRepository.existsByEmail(user.getEmail()))
                throw new Exception("Já existe usuário com este e-mail");
        }
        // TODO validar se usuário tem permissão para o tipo escolhido
    }

    private void format(UserEntity user) throws Exception {
        user.setPassword(encoder.encode(user.getPassword()));
    }

    @Transactional
    public UserEntity save(UserEntity user) throws Exception {
        if (user == null)
            throw new Exception("Objeto nulo");
        validate(user);
        format(user);
        return userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com este e-mail"));
        return user;
    }
}
