package com.hmpsicoterapia.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys; // Importar Keys da biblioteca jjwt
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey; // Importar SecretKey do javax.crypto
import java.nio.charset.StandardCharsets; // Importar StandardCharsets para conversão de string para bytes
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expiration;

    public JwtTokenProvider(@Value("${jwt.secret}") String secretString,
                            @Value("${jwt.expiration}") long expiration) {

        byte[] secretBytes = secretString.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(secretBytes);
        this.expiration = expiration;

        // Validação do tamanho da chave no momento da criação do bean
        // O algoritmo HS512 requer uma chave de pelo menos 512 bits (64 bytes).
        if (secretBytes.length < 64) { // Checa o tamanho da string original em bytes
            System.err.println(
                    "ALERTA DE SEGURANÇA CRÍTICO: A string 'jwt.secret' configurada no application.properties tem " +
                            secretBytes.length + " bytes (" + (secretBytes.length * 8) + " bits), " +
                            "o que é MENOR que os 64 bytes (512 bits) recomendados para o algoritmo HS512. " +
                            "A biblioteca JJWT lançará uma WeakKeyException. AUMENTE O TAMANHO DA SUA jwt.secret!");
            // Em um cenário real, você poderia lançar uma exceção aqui para impedir a inicialização com uma chave fraca.
            // throw new IllegalArgumentException("A chave JWT configurada ('jwt.secret') é muito curta para o algoritmo HS512!");
        }
    }

    public String gerarToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512) // Usa a SecretKey e o algoritmo
                .compact();
    }

    public String getEmailDoToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException ex) {
            System.err.println("DEBUG: JwtTokenProvider - Token JWT malformado: " + ex.getMessage());
        } catch (ExpiredJwtException ex) {
            System.err.println("DEBUG: JwtTokenProvider - Token JWT expirado: " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.err.println("DEBUG: JwtTokenProvider - Token JWT não suportado: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.err.println("DEBUG: JwtTokenProvider - Argumento JWT ilegal: " + ex.getMessage());
        } catch (io.jsonwebtoken.security.SecurityException ex) {
            System.err.println("DEBUG: JwtTokenProvider - Falha de segurança JWT (ex: assinatura inválida ou chave fraca): " + ex.getMessage());
        }
        return false;
    }
}