package com.hmpsicoterapia.config;

import com.hmpsicoterapia.security.JwtTokenFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider; // Importar
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtTokenFilter jwtTokenFilter;
    // Não precisamos injetar o PasswordEncoder diretamente aqui se ele for usado apenas no DaoAuthenticationProvider
    // private final PasswordEncoder passwordEncoder; // Pode ser removido se não usado em outro lugar nesta classe

    public SecurityConfig(@Lazy UserDetailsService userDetailsService, JwtTokenFilter jwtTokenFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtTokenFilter = jwtTokenFilter;
        // this.passwordEncoder = passwordEncoder; // Pode ser removido
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Define explicitamente o DaoAuthenticationProvider
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // Usa o UserDetailsService injetado (AdminService)
        authProvider.setPasswordEncoder(passwordEncoder());   // Usa o PasswordEncoder bean definido acima
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        // Este AuthenticationManager deve pegar automaticamente o DaoAuthenticationProvider definido como bean.
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/admin/register", "/api/admin/login").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        // Adiciona explicitamente o provider ao HttpSecurity se o anterior não funcionar
        // Isso é mais comum em configurações sem o AuthenticationConfiguration do Spring Boot 3+
        // http.authenticationProvider(authenticationProvider());


        return http.build();
    }
}