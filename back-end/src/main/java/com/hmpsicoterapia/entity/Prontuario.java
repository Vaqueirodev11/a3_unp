// Arquivo: back-end/src/main/java/com/hmpsicoterapia/entity/Prontuario.java
package com.hmpsicoterapia.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prontuarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Prontuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // REMOVE o campo 'nomePaciente'
    // @Column(nullable = false)
    // private String nomePaciente;

    // ADICIONA a relação com a entidade Paciente
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER) // Cascade.ALL salva/atualiza o paciente junto com o prontuário. EAGER carrega o paciente junto.
    @JoinColumn(name = "paciente_id", referencedColumnName = "id", nullable = false)
    private Paciente paciente;

    @Column(length = 4000)
    private String historicoMedico;

    @Column(length = 2000)
    private String medicamentos;

    @Column(length = 2000)
    private String exames;

    @Column(length = 2000)
    private String condicoesClinicas;

    @Column(nullable = false)
    private String tipoTratamento;

    @Column(nullable = false, unique = true)
    private String numeroProntuario;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    @Column(nullable = false)
    private LocalDateTime dataUltimaAtualizacao;

    @Column(nullable = false)
    private String ultimaAlteracaoPor;

    @Column(nullable = false)
    private LocalDateTime dataUltimaAlteracao;
}