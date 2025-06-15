package com.hmpsicoterapia.application.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusTratamentoDTO {
    @NotNull(message = "O status do tratamento é obrigatório")
    @NotBlank(message = "O status do tratamento é obrigatório")
    private String status;
    
    private String motivoAlta;
}
