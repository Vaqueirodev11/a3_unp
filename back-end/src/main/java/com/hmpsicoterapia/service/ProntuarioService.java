package com.hmpsicoterapia.service;

import com.hmpsicoterapia.dto.ProntuarioDTO;
import com.hmpsicoterapia.entity.Prontuario;
import com.hmpsicoterapia.repository.ProntuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;

    public Prontuario criarProntuario(ProntuarioDTO dto, String usuarioResponsavel) {
        Prontuario p = new Prontuario();
        p.setNomePaciente(dto.getNomePaciente());
        p.setHistoricoMedico(dto.getHistoricoMedico());
        p.setMedicamentos(dto.getMedicamentos());
        p.setExames(dto.getExames());
        p.setCondicoesClinicas(dto.getCondicoesClinicas());
        p.setTipoTratamento(dto.getTipoTratamento());
        p.setNumeroProntuario(dto.getNumeroProntuario());
        p.setDataCriacao(LocalDateTime.now());
        p.setDataUltimaAtualizacao(LocalDateTime.now());
        p.setUltimaAlteracaoPor(usuarioResponsavel);
        p.setDataUltimaAlteracao(LocalDateTime.now());
        return prontuarioRepository.save(p);
    }

    public List<Prontuario> buscarProntuarios(String filtro) {
        return prontuarioRepository.buscarPorFiltro(filtro);
    }

    public Optional<Prontuario> buscarPorId(Long id) {
        return prontuarioRepository.findById(id);
    }

    public Prontuario atualizarProntuario(Long id, ProntuarioDTO dto, String usuarioResponsavel) {
        Prontuario p = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));

        p.setNomePaciente(dto.getNomePaciente());
        p.setHistoricoMedico(dto.getHistoricoMedico());
        p.setMedicamentos(dto.getMedicamentos());
        p.setExames(dto.getExames());
        p.setCondicoesClinicas(dto.getCondicoesClinicas());
        p.setTipoTratamento(dto.getTipoTratamento());
        p.setNumeroProntuario(dto.getNumeroProntuario());
        p.setDataUltimaAtualizacao(LocalDateTime.now());
        p.setUltimaAlteracaoPor(usuarioResponsavel);
        p.setDataUltimaAlteracao(LocalDateTime.now());
        return prontuarioRepository.save(p);
    }
}
