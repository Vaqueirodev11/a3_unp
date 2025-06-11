// Arquivo: back-end/src/main/java/com/hmpsicoterapia/dto/ProntuarioDTO.java
package com.hmpsicoterapia.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull; // <<--- ADICIONE ESTA LINHA DE IMPORTAÇÃO
import lombok.Data;

@Data
public class ProntuarioDTO {

    @Valid // Garante que as validações dentro de PacienteDTO também sejam aplicadas
    @NotNull // Agora esta anotação será reconhecida
    private PacienteDTO paciente;

    @NotBlank(message = "Histórico médico é obrigatório")
    private String historicoMedico;

    private String medicamentos;
    private String exames;
    private String condicoesClinicas;

    @NotBlank(message = "Tipo de tratamento é obrigatório")
    private String tipoTratamento;

    @NotBlank(message = "Número do prontuário é obrigatório")
    private String numeroProntuario;
}