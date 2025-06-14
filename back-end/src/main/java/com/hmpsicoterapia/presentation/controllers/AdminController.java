package com.hmpsicoterapia.presentation.controllers;

import com.hmpsicoterapia.application.dtos.AdminRegisterDTO;
import com.hmpsicoterapia.domain.entities.Admin;
import com.hmpsicoterapia.infrastructure.security.JwtTokenProvider;
import com.hmpsicoterapia.application.usecases.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;     
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional; 

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@Valid @RequestBody AdminRegisterDTO dto) {
        Admin admin = adminService.registrarAdmin(dto);
        return ResponseEntity.ok("Administrador registrado com sucesso. ID: " + admin.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("DEBUG: AdminController.login - Recebida requisição de login para email: " + loginRequest.getEmail());
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getSenha());
            System.out.println("DEBUG: AdminController.login - Tentando autenticar com AuthenticationManager...");
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            System.out.println("DEBUG: AdminController.login - Autenticação BEM-SUCEDIDA para: " + authentication.getName());
            String token = jwtTokenProvider.gerarToken(authentication.getName());
            System.out.println("DEBUG: AdminController.login - Token JWT gerado com sucesso.");
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (AuthenticationException e) {
            System.err.println("!!!!!!!!!!!! AdminController.login - FALHA NA AUTENTICAÇÃO !!!!!!!!!!!!");
            System.err.println("Tipo da Exceção de Autenticação: " + e.getClass().getName());
            System.err.println("Mensagem da Exceção de Autenticação: " + e.getMessage());
            e.printStackTrace(System.err);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha inválidos");
        } catch (Exception e) {
            System.err.println("!!!!!!!!!!!! AdminController.login - ERRO INTERNO INESPERADO DURANTE O LOGIN !!!!!!!!!!!!");
            System.err.println("Tipo da Exceção Inesperada: " + e.getClass().getName());
            System.err.println("Mensagem da Exceção Inesperada: " + e.getMessage());
            e.printStackTrace(System.err);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro interno no servidor durante o processo de login.");
        }
    }

    // NOVO ENDPOINT ADICIONADO
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentAdmin(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado para buscar dados próprios.");
        }
        String email = userDetails.getUsername();
        Optional<Admin> adminOptional = adminService.findByEmail(email);

        if (adminOptional.isPresent()) {
            Admin admin = adminOptional.get();
            return ResponseEntity.ok(admin); 
        } else {
            // Isso seria muito estranho, pois o token é baseado no e-mail de um usuário existente.
            System.err.println("ERRO: Admin com email " + email + " do token não encontrado no banco de dados.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin associado ao token não encontrado.");
        }
    }
    
    @PostMapping("/password-reset-request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email é obrigatório");
        }
        
        String token = adminService.generatePasswordResetToken(email);
        
        return ResponseEntity.ok("Se o email estiver cadastrado, você receberá instruções para redefinir sua senha.");
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        if (request.getToken() == null || request.getSenha() == null || request.getConfirmarSenha() == null) {
            return ResponseEntity.badRequest().body("Token e nova senha são obrigatórios");
        }
        
        if (!request.getSenha().equals(request.getConfirmarSenha())) {
            return ResponseEntity.badRequest().body("As senhas não coincidem");
        }
        
        boolean success = adminService.resetPassword(request.getToken(), request.getSenha());
        
        if (success) {
            return ResponseEntity.ok("Senha redefinida com sucesso");
        } else {
            return ResponseEntity.badRequest().body("Token inválido ou expirado");
        }
    }

    public static class LoginRequest {
        private String email;
        private String senha;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
    }

    public static class JwtResponse {
        private String token;
        public JwtResponse(String token) { this.token = token; }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }
    
    public static class ResetPasswordRequest {
        private String token;
        private String senha;
        private String confirmarSenha;
        
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getSenha() { return senha; }
        public void setSenha(String senha) { this.senha = senha; }
        public String getConfirmarSenha() { return confirmarSenha; }
        public void setConfirmarSenha(String confirmarSenha) { this.confirmarSenha = confirmarSenha; }
    }

    // public static class AdminResponseDTO {
    //     private Long id;
    //     private String nome;
    //     private String email;
    //     private String cpf;
    //     private String role; // Adicionar se tiver papéis/roles
    //     // Construtor, Getters, Setters
    //     public AdminResponseDTO(Long id, String nome, String email, String cpf, String role) {
    //         this.id = id;
    //         this.nome = nome;
    //         this.email = email;
    //         this.cpf = cpf;
    //         this.role = role;
    //     }
    //     // getters
    // }
}
