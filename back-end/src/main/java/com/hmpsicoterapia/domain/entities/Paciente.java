// Arquivo: back-end/src/main/java/com/hmpsicoterapia/entity/Paciente.java
package com.hmpsicoterapia.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "pacientes")
@Getter
@Setter
@NoArgsConstructor
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private LocalDate dataNascimento;
    
    @Column(unique = true, nullable = false)
    private String cpf;

    private String genero;
    private String telefone;
    private String email;

    // Dados de endereço diretamente na entidade Paciente
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;
}