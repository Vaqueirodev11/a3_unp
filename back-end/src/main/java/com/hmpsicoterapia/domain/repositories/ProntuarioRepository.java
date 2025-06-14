// Arquivo: back-end/src/main/java/com/hmpsicoterapia/repository/ProntuarioRepository.java
package com.hmpsicoterapia.repository;

import com.hmpsicoterapia.entity.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {

    // CORREÇÃO: A busca por nome agora aponta para p.paciente.nome
    @Query("SELECT p FROM Prontuario p WHERE " +
            "LOWER(p.paciente.nome) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " + // <<--- MUDANÇA AQUI
            "LOWER(p.numeroProntuario) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
            "LOWER(p.tipoTratamento) LIKE LOWER(CONCAT('%', :filtro, '%'))")
    List<Prontuario> buscarPorFiltro(@Param("filtro") String filtro);
}