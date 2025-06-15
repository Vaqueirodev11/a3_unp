package com.hmpsicoterapia.application.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HistoricoMedicoDTO {
    @NotBlank(message = "A descrição é obrigatória")
    private String descricao;
}
