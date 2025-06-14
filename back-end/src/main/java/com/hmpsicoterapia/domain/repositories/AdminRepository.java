package com.hmpsicoterapia.repository;

import com.hmpsicoterapia.entity.Admin; // Certifique-se que está usando a entidade JPA correta
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Método para buscar Admin pelo email (útil para login)
    Optional<Admin> findByEmail(String email);

    // Método para buscar Admin pelo CPF (útil para verificar duplicidade no registro)
    Optional<Admin> findByCpf(String cpf);
}