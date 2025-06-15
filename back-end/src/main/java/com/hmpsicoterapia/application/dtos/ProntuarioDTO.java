// Arquivo: back-end/src/main/java/com/hmpsicoterapia/dto/ProntuarioDTO.java
package com.hmpsicoterapia.application.dtos;

import com.hmpsicoterapia.domain.entities.StatusTratamento;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProntuarioDTO {

    @Valid // Garante que as validações dentro de PacienteDTO também sejam aplicadas
    @NotNull // Agora esta anotação será reconhecida
    private PacienteDTO paciente;
    
    // Campo necessário para satisfazer a restrição not-null no banco de dados
    @NotNull(message = "Nome do paciente é obrigatório")
    private String nome_paciente;

    @NotBlank(message = "Histórico médico é obrigatório")
    private String historicoMedico;

    private String medicamentos;
    private String exames;
    private String condicoesClinicas;

    @NotBlank(message = "Tipo de tratamento é obrigatório")
    private String tipoTratamento;

    @NotBlank(message = "Número do prontuário é obrigatório")
    private String numeroProntuario;
    
    private StatusTratamento statusTratamento;
    
    private LocalDateTime dataAlta;
    
    private String motivoAlta;
}
