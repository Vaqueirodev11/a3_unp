package com.hmpsicoterapia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProntuarioDTO {
    @NotBlank(message = "Nome do paciente é obrigatório")
    private String nomePaciente;

    private String historicoMedico;
    private String medicamentos;
    private String exames;
    private String condicoesClinicas;

    @NotBlank(message = "Tipo de tratamento é obrigatório")
    private String tipoTratamento;

    @NotBlank(message = "Número do prontuário é obrigatório")
    private String numeroProntuario;
}
