package com.hmpsicoterapia.domain.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "admins")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 11)
    @NotBlank(message = "CPF obrigatório")
    private String cpf;

    @Column(nullable = false)
    @NotBlank(message = "Nome obrigatório")
    private String nome;

    @Column(unique = true, nullable = false)
    @Email(message = "Email inválido")
    private String email;

    @Column(nullable = false)
    private String senhaHash;
}
