// Arquivo: back-end/src/main/java/com/hmpsicoterapia/service/AdminService.java
package com.hmpsicoterapia.service;

import com.hmpsicoterapia.dto.AdminRegisterDTO;
import com.hmpsicoterapia.entity.Admin;
import com.hmpsicoterapia.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional; // <<--- ADICIONE OU VERIFIQUE ESTA IMPORTAÇÃO

@Service
public class AdminService implements UserDetailsService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("DEBUG: AdminService.loadUserByUsername chamado para email: " + email);
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("DEBUG: AdminService.loadUserByUsername - Usuário NÃO encontrado com email: " + email);
                    return new UsernameNotFoundException("Admin não encontrado com email: " + email);
                });
        System.out.println("DEBUG: AdminService.loadUserByUsername - Usuário ENCONTRADO: " + admin.getEmail() + ", Senha Hash Válida: " + (admin.getSenhaHash() != null && !admin.getSenhaHash().isEmpty()));
        if (admin.getSenhaHash() == null || admin.getSenhaHash().isEmpty()) {
            System.err.println("ERRO CRÍTICO: Senha hash está nula ou vazia para o usuário: " + email);
            throw new UsernameNotFoundException("Configuração de senha inválida para o usuário: " + email);
        }
        return new User(admin.getEmail(), admin.getSenhaHash(), new ArrayList<>());
    }

    @Transactional
    public Admin registrarAdmin(AdminRegisterDTO dto) {
        System.out.println("DEBUG: AdminService.registrarAdmin - Tentando registrar CPF: " + dto.getCpf() + ", Email: " + dto.getEmail());
        if (adminRepository.findByCpf(dto.getCpf()).isPresent()) {
            System.out.println("DEBUG: AdminService.registrarAdmin - CPF já cadastrado: " + dto.getCpf());
            throw new IllegalArgumentException("CPF já cadastrado.");
        }
        if (adminRepository.findByEmail(dto.getEmail()).isPresent()) {
            System.out.println("DEBUG: AdminService.registrarAdmin - Email já cadastrado: " + dto.getEmail());
            throw new IllegalArgumentException("Email já cadastrado.");
        }
        Admin admin = new Admin();
        admin.setCpf(dto.getCpf());
        admin.setNome(dto.getNome());
        admin.setEmail(dto.getEmail());
        admin.setSenhaHash(passwordEncoder.encode(dto.getSenha()));
        Admin adminSalvo = adminRepository.save(admin);
        System.out.println("DEBUG: AdminService.registrarAdmin - Admin salvo com ID: " + adminSalvo.getId() + " e Email: " + adminSalvo.getEmail());
        return adminSalvo;
    }

    // MÉTODO ADICIONADO/VERIFICADO PARA SUPORTE AO /me
    @Transactional(readOnly = true)
    public Optional<Admin> findByEmail(String email) {
        System.out.println("DEBUG: AdminService.findByEmail (método público) chamado para email: " + email);
        return adminRepository.findByEmail(email);
    }
    // FIM DO MÉTODO ADICIONADO/VERIFICADO

    public String getAdminGreeting() {
        return "Olá, Admin! Operação realizada pelo AdminService.";
    }

    @Transactional(readOnly = true)
    public Optional<Admin> findById(Long id) {
        return adminRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    @Transactional
    public Admin createAdmin(Admin admin) {
        if (admin.getSenhaHash() != null && !admin.getSenhaHash().isEmpty() && !admin.getSenhaHash().startsWith("$2a$")) {
            admin.setSenhaHash(passwordEncoder.encode(admin.getSenhaHash()));
        } else if (admin.getSenhaHash() == null || admin.getSenhaHash().isEmpty()){
            throw new IllegalArgumentException("Tentativa de criar admin sem senha ou com senha vazia.");
        }
        return adminRepository.save(admin);
    }

    @Transactional
    public Admin updateAdmin(Long id, Admin adminDetails) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin não encontrado com id " + id));
        admin.setNome(adminDetails.getNome());
        admin.setEmail(adminDetails.getEmail());
        return adminRepository.save(admin);
    }

    @Transactional
    public void deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin não encontrado com id " + id + ". Nenhum admin foi deletado.");
        }
        adminRepository.deleteById(id);
    }

    public boolean hasPermission(Long adminId, String permission) {
        return true;
    }
}