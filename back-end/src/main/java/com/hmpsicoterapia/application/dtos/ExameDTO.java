package com.hmpsicoterapia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ExameDTO {
    @NotBlank(message = "O nome do exame é obrigatório")
    private String nome;
    
    @NotBlank(message = "A data do exame é obrigatória")
    private String data;
    
    @NotBlank(message = "O resultado do exame é obrigatório")
    private String resultado;
    
    private String observacoes;
}
