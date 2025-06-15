package com.hmpsicoterapia.infrastructure.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys; 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey; 
import java.nio.charset.StandardCharsets; 
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

        if (secretBytes.length < 64) { 
            System.err.println(
                    "ALERTA DE SEGURANÇA CRÍTICO: A string 'jwt.secret' configurada no application.properties tem " +
                            secretBytes.length + " bytes (" + (secretBytes.length * 8) + " bits), " +
                            "o que é MENOR que os 64 bytes (512 bits) recomendados para o algoritmo HS512. " +
                            "A biblioteca JJWT lançará uma WeakKeyException. AUMENTE O TAMANHO DA SUA jwt.secret!");
        }
    }

    public String gerarToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512) 
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
