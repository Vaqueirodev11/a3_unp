package com.hmpsicoterapia.application.dtos;

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

    private String telefone; 
    
    @Email
    @NotBlank
    private String email;

    @NotBlank private String logradouro;
    @NotBlank private String numero;
    private String complemento; 
    @NotBlank private String bairro;
    @NotBlank private String cidade;
    @NotBlank private String estado;
    @NotBlank private String cep;
}
