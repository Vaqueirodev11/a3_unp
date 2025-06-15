package com.hmpsicoterapia.domain.entities;

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

    @Column(name = "nome_paciente", nullable = false)
    private String nomePaciente;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER) 
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
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status_tratamento", nullable = false)
    private StatusTratamento statusTratamento = StatusTratamento.EM_TRATAMENTO;
    
    @Column(name = "data_alta")
    private LocalDateTime dataAlta;
    
    @Column(name = "motivo_alta")
    private String motivoAlta;
}
