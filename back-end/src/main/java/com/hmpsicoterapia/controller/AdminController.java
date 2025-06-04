package com.hmpsicoterapia.controller;

import com.hmpsicoterapia.dto.AdminRegisterDTO;
import com.hmpsicoterapia.entity.Admin;
import com.hmpsicoterapia.security.JwtTokenProvider;
import com.hmpsicoterapia.service.AdminService; // Seu AdminService
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus; // Importar HttpStatus
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication; // Importar Authentication
import org.springframework.security.core.AuthenticationException;
// import org.springframework.security.core.context.SecurityContextHolder; // Geralmente não necessário setar manualmente aqui
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor // Se você usa Lombok para injeção de construtor
public class AdminController {

    private final AdminService adminService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    // Se não estiver usando @RequiredArgsConstructor, defina o construtor:
    /*
    public AdminController(AdminService adminService, 
                           JwtTokenProvider jwtTokenProvider, 
                           AuthenticationManager authenticationManager) {
        this.adminService = adminService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }
    */

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@Valid @RequestBody AdminRegisterDTO dto) {
        // O AdminService.registrarAdmin já tem logs de DEBUG
        Admin admin = adminService.registrarAdmin(dto); // Chama o AdminService
        // Não é ideal retornar a entidade Admin completa aqui, especialmente com a senha hash.
        // Uma mensagem de sucesso ou um DTO de resposta sem dados sensíveis é melhor.
        return ResponseEntity.ok("Administrador registrado com sucesso");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("DEBUG: AdminController.login - Recebida requisição de login para email: " + loginRequest.getEmail());

            // Cria o token de autenticação para ser processado pelo AuthenticationManager
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha());

            System.out.println("DEBUG: AdminController.login - Tentando autenticar com AuthenticationManager...");
            // O AuthenticationManager tentará autenticar. Se falhar, lança AuthenticationException.
            // Se bem-sucedido, retorna um objeto Authentication totalmente populado.
            Authentication authentication = authenticationManager.authenticate(authenticationToken);

            // Se a autenticação for bem-sucedida, o Spring Security (ProviderManager) normalmente
            // já configura o SecurityContextHolder se a chamada for feita através da cadeia de filtros.
            // Como esta é uma chamada programática, configurar o contexto aqui pode ser redundante se
            // o objetivo principal é apenas gerar um token JWT. Para consistência com o JwtTokenFilter,
            // que *lê* do SecurityContextHolder, pode ser útil, mas não é estritamente necessário
            // apenas para a geração do token se o `authentication` objeto já estiver completo.
            // SecurityContextHolder.getContext().setAuthentication(authentication);

            System.out.println("DEBUG: AdminController.login - Autenticação BEM-SUCEDIDA para: " + authentication.getName());

            // Gera o token JWT usando o principal do objeto Authentication autenticado (geralmente o email/username)
            String token = jwtTokenProvider.gerarToken(authentication.getName());
            System.out.println("DEBUG: AdminController.login - Token JWT gerado com sucesso.");

            return ResponseEntity.ok(new JwtResponse(token));

        } catch (AuthenticationException e) {
            // Este bloco captura falhas de autenticação esperadas (ex: BadCredentialsException)
            System.err.println("!!!!!!!!!!!! AdminController.login - FALHA NA AUTENTICAÇÃO !!!!!!!!!!!!");
            System.err.println("Tipo da Exceção de Autenticação: " + e.getClass().getName());
            System.err.println("Mensagem da Exceção de Autenticação: " + e.getMessage());
            // Logar a stack trace completa da AuthenticationException para análise detalhada
            e.printStackTrace(System.err);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos");

        } catch (Exception e) {
            // Este bloco captura quaisquer outras exceções inesperadas que possam ocorrer
            System.err.println("!!!!!!!!!!!! AdminController.login - ERRO INTERNO INESPERADO DURANTE O LOGIN !!!!!!!!!!!!");
            System.err.println("Tipo da Exceção Inesperada: " + e.getClass().getName());
            System.err.println("Mensagem da Exceção Inesperada: " + e.getMessage());
            e.printStackTrace(System.err); // Loga a stack trace completa
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno no servidor durante o processo de login.");
        }
    }

    // Classe interna para o corpo da requisição de login
    // (Pode ser movida para um pacote DTO se preferir)
    public static class LoginRequest {
        private String email;
        private String senha;

        public String getEmail() {
            return email;
        }
        public void setEmail(String email) {
            this.email = email;
        }
        public String getSenha() {
            return senha;
        }
        public void setSenha(String senha) {
            this.senha = senha;
        }
    }

    // Classe interna para a resposta JWT
    // (Pode ser movida para um pacote DTO se preferir)
    public static class JwtResponse {
        private String token;

        public JwtResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
        public void setToken(String token) {
            this.token = token;
        }
    }
}