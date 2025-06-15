package com.hmpsicoterapia.application.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MedicacaoDTO {
    @NotBlank(message = "O nome da medicação é obrigatório")
    private String nome;
    
    @NotBlank(message = "A dosagem é obrigatória")
    private String dosagem;
    
    @NotBlank(message = "A frequência é obrigatória")
    private String frequencia;
    
    private String observacoes;
}
