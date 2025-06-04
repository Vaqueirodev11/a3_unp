package com.hmpsicoterapia.security;

// Mantenha os imports existentes (UserDetailsService, JwtTokenProvider, etc.)
import com.hmpsicoterapia.service.AdminService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService; // Nosso AdminService

    @Autowired
    public JwtTokenFilter(JwtTokenProvider jwtTokenProvider,
                          @Lazy UserDetailsService userDetailsService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Pular processamento de token JWT para endpoints públicos de autenticação
        if ("/api/admin/login".equals(path) || "/api/admin/register".equals(path)) {
            System.out.println("DEBUG: JwtTokenFilter - Bypass para o path público: " + path);
            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("DEBUG: JwtTokenFilter - Processando path: " + path);
        String token = extractToken(request);

        if (token != null && jwtTokenProvider.validarToken(token)) {
            try {
                String userEmail = jwtTokenProvider.getEmailDoToken(token);
                System.out.println("DEBUG: JwtTokenFilter - Email extraído do token: " + userEmail);
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail); // Chama AdminService

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
                System.out.println("DEBUG: JwtTokenFilter - Token validado e contexto de segurança configurado para: " + userEmail);
            } catch (Exception e) {
                System.err.println("DEBUG: JwtTokenFilter - Erro ao processar token JWT: " + e.getClass().getName() + " - " + e.getMessage());
                SecurityContextHolder.clearContext();
            }
        } else {
            if (token == null) {
                System.out.println("DEBUG: JwtTokenFilter - Nenhum token JWT encontrado no cabeçalho Authorization para o path: " + path);
            } else {
                System.out.println("DEBUG: JwtTokenFilter - Token JWT inválido para o path: " + path);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}