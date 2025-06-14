package com.hmpsicoterapia.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnotacaoDTO {
    @NotBlank(message = "O texto da anotação é obrigatório")
    private String texto;
}
