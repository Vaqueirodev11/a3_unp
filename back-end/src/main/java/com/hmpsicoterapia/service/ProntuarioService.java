// Arquivo: back-end/src/main/java/com/hmpsicoterapia/service/ProntuarioService.java
package com.hmpsicoterapia.service;

import com.hmpsicoterapia.dto.PacienteDTO;
import com.hmpsicoterapia.dto.ProntuarioDTO;
import com.hmpsicoterapia.entity.Paciente;
import com.hmpsicoterapia.entity.Prontuario;
import com.hmpsicoterapia.repository.ProntuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;

    public Prontuario criarProntuario(ProntuarioDTO dto, String usuarioResponsavel) {
        // Mapear PacienteDTO para a entidade Paciente
        Paciente paciente = new Paciente();
        PacienteDTO pacienteDto = dto.getPaciente();
        paciente.setNome(pacienteDto.getNome());
        paciente.setDataNascimento(LocalDate.parse(pacienteDto.getDataNascimento())); // Converte String para LocalDate
        paciente.setCpf(pacienteDto.getCpf());
        paciente.setGenero(pacienteDto.getGenero());
        paciente.setTelefone(pacienteDto.getTelefone());
        paciente.setEmail(pacienteDto.getEmail());
        paciente.setLogradouro(pacienteDto.getLogradouro());
        paciente.setNumero(pacienteDto.getNumero());
        paciente.setComplemento(pacienteDto.getComplemento());
        paciente.setBairro(pacienteDto.getBairro());
        paciente.setCidade(pacienteDto.getCidade());
        paciente.setEstado(pacienteDto.getEstado());
        paciente.setCep(pacienteDto.getCep());
        
        // Criar o Prontuário e associar o Paciente
        Prontuario prontuario = new Prontuario();
        prontuario.setPaciente(paciente); // Associa o objeto paciente
        
        prontuario.setHistoricoMedico(dto.getHistoricoMedico());
        prontuario.setMedicamentos(dto.getMedicamentos());
        prontuario.setExames(dto.getExames());
        prontuario.setCondicoesClinicas(dto.getCondicoesClinicas());
        prontuario.setTipoTratamento(dto.getTipoTratamento());
        prontuario.setNumeroProntuario(dto.getNumeroProntuario());
        prontuario.setDataCriacao(LocalDateTime.now());
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());
        
        return prontuarioRepository.save(prontuario);
    }
    
    // O método de atualização também precisará ser ajustado de forma similar
    public Prontuario atualizarProntuario(Long id, ProntuarioDTO dto, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));

        // Atualizar dados do Paciente
        Paciente paciente = prontuario.getPaciente();
        PacienteDTO pacienteDto = dto.getPaciente();
        paciente.setNome(pacienteDto.getNome());
        // ... (mapear e atualizar todos os outros campos do paciente)

        // Atualizar dados do Prontuário
        prontuario.setHistoricoMedico(dto.getHistoricoMedico());
        // ... (mapear e atualizar todos os outros campos do prontuário)
        
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());

        return prontuarioRepository.save(prontuario);
    }

    public List<Prontuario> buscarProntuarios(String filtro) {
        // Esta busca por filtro precisará ser ajustada para buscar no nome do paciente aninhado
        // Ex: "p.paciente.nome" em vez de "p.nomePaciente"
        return prontuarioRepository.buscarPorFiltro(filtro);
    }

    public Optional<Prontuario> buscarPorId(Long id) {
        return prontuarioRepository.findById(id);
    }
}