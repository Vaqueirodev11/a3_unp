package com.hmpsicoterapia.repository;

import com.hmpsicoterapia.entity.Prontuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProntuarioRepository extends JpaRepository<Prontuario, Long> {

    // Busca por nome, número ou tipo tratamento
    @Query("SELECT p FROM Prontuario p WHERE " +
            "LOWER(p.nomePaciente) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
            "LOWER(p.numeroProntuario) LIKE LOWER(CONCAT('%', :filtro, '%')) OR " +
            "LOWER(p.tipoTratamento) LIKE LOWER(CONCAT('%', :filtro, '%'))")
    List<Prontuario> buscarPorFiltro(@Param("filtro") String filtro);
}
