// Arquivo: back-end/src/main/java/com/hmpsicoterapia/dto/PacienteDTO.java
package com.hmpsicoterapia.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class PacienteDTO {
    @NotBlank
    private String nome;

    @NotNull
    private String dataNascimento;

    @NotBlank
    private String cpf;

    @NotBlank
    private String genero;

    // Se este campo fosse opcional, você removeria o @NotBlank
    private String telefone; // Exemplo de campo opcional
    
    @Email
    @NotBlank
    private String email;

    @NotBlank private String logradouro;
    @NotBlank private String numero;
    private String complemento; // Já é opcional no seu código
    @NotBlank private String bairro;
    @NotBlank private String cidade;
    @NotBlank private String estado;
    @NotBlank private String cep;
}