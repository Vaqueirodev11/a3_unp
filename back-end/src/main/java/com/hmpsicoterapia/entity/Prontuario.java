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

    @Column(nullable = false)
    private String nomePaciente;

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

    @Column(nullable = false)
    private String numeroProntuario;

    @Column(nullable = false)
    private LocalDateTime dataCriacao;

    @Column(nullable = false)
    private LocalDateTime dataUltimaAtualizacao;

    // Auditoria básica
    @Column(nullable = false)
    private String ultimaAlteracaoPor;

    @Column(nullable = false)
    private LocalDateTime dataUltimaAlteracao;
}
