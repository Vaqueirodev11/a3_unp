package com.hmpsicoterapia.application.usecases;

import com.hmpsicoterapia.application.dtos.PacienteDTO;
import com.hmpsicoterapia.application.dtos.ProntuarioDTO;
import com.hmpsicoterapia.application.dtos.StatusTratamentoDTO;
import com.hmpsicoterapia.domain.entities.Paciente;
import com.hmpsicoterapia.domain.entities.Prontuario;
import com.hmpsicoterapia.domain.entities.StatusTratamento;
import com.hmpsicoterapia.domain.repositories.ProntuarioRepository;
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
    
        Paciente paciente = new Paciente();
        PacienteDTO pacienteDto = dto.getPaciente();
        paciente.setNome(pacienteDto.getNome());
        paciente.setDataNascimento(LocalDate.parse(pacienteDto.getDataNascimento())); 
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
        
        
        Prontuario prontuario = new Prontuario();
        prontuario.setPaciente(paciente); 
        
        if (dto.getNome_paciente() != null && !dto.getNome_paciente().isEmpty()) {
            prontuario.setNomePaciente(dto.getNome_paciente());
        } else {
            prontuario.setNomePaciente(paciente.getNome());
        }
        
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
    
    public Prontuario atualizarProntuario(Long id, ProntuarioDTO dto, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));

        Paciente paciente = prontuario.getPaciente();
        PacienteDTO pacienteDto = dto.getPaciente();
        paciente.setNome(pacienteDto.getNome());
        paciente.setDataNascimento(LocalDate.parse(pacienteDto.getDataNascimento()));
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
        
        if (dto.getNome_paciente() != null && !dto.getNome_paciente().isEmpty()) {
            prontuario.setNomePaciente(dto.getNome_paciente());
        } else {
            prontuario.setNomePaciente(paciente.getNome());
        }

        prontuario.setHistoricoMedico(dto.getHistoricoMedico());
        prontuario.setMedicamentos(dto.getMedicamentos());
        prontuario.setExames(dto.getExames());
        prontuario.setCondicoesClinicas(dto.getCondicoesClinicas());
        prontuario.setTipoTratamento(dto.getTipoTratamento());
        
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());

        return prontuarioRepository.save(prontuario);
    }

    public List<Prontuario> buscarProntuarios(String filtro) {
        return prontuarioRepository.buscarPorFiltro(filtro);
    }

    public Optional<Prontuario> buscarPorId(Long id) {
        return prontuarioRepository.findById(id);
    }
    
    public Prontuario adicionarHistoricoMedico(Long id, String descricao, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));
        
        String historicoAtual = prontuario.getHistoricoMedico();
        String dataFormatada = LocalDateTime.now().toString();
        
        String novoRegistro = String.format(
            "\n\n--- Registro adicionado em %s por %s ---\n%s",
            dataFormatada,
            usuarioResponsavel,
            descricao
        );
        
        if (historicoAtual == null || historicoAtual.trim().isEmpty()) {
            prontuario.setHistoricoMedico(novoRegistro.trim());
        } else {
            prontuario.setHistoricoMedico(historicoAtual + novoRegistro);
        }
        
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());
        
        return prontuarioRepository.save(prontuario);
    }
    
    public Prontuario adicionarMedicacao(Long id, com.hmpsicoterapia.application.dtos.MedicacaoDTO medicacaoDTO, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));
        
        String medicacoesAtuais = prontuario.getMedicamentos();
        String dataFormatada = LocalDateTime.now().toString();
        
        String novaMedicacao = String.format(
            "\n\n--- Medicação adicionada em %s por %s ---\nNome: %s\nDosagem: %s\nFrequência: %s\nObservações: %s",
            dataFormatada,
            usuarioResponsavel,
            medicacaoDTO.getNome(),
            medicacaoDTO.getDosagem(),
            medicacaoDTO.getFrequencia(),
            medicacaoDTO.getObservacoes() != null ? medicacaoDTO.getObservacoes() : "N/A"
        );
        
        if (medicacoesAtuais == null || medicacoesAtuais.trim().isEmpty()) {
            prontuario.setMedicamentos(novaMedicacao.trim());
        } else {
            prontuario.setMedicamentos(medicacoesAtuais + novaMedicacao);
        }
        
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());
        
        return prontuarioRepository.save(prontuario);
    }
    
    public Prontuario adicionarExame(Long id, com.hmpsicoterapia.application.dtos.ExameDTO exameDTO, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));
        
        String examesAtuais = prontuario.getExames();
        String dataFormatada = LocalDateTime.now().toString();
        
        String novoExame = String.format(
            "\n\n--- Exame adicionado em %s por %s ---\nNome: %s\nData: %s\nResultado: %s\nObservações: %s",
            dataFormatada,
            usuarioResponsavel,
            exameDTO.getNome(),
            exameDTO.getData(),
            exameDTO.getResultado(),
            exameDTO.getObservacoes() != null ? exameDTO.getObservacoes() : "N/A"
        );
        
        if (examesAtuais == null || examesAtuais.trim().isEmpty()) {
            prontuario.setExames(novoExame.trim());
        } else {
            prontuario.setExames(examesAtuais + novoExame);
        }
        
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());
        
        return prontuarioRepository.save(prontuario);
    }
    
    public Prontuario adicionarAnotacao(Long id, com.hmpsicoterapia.application.dtos.AnotacaoDTO anotacaoDTO, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));
        
        String anotacoesAtuais = prontuario.getCondicoesClinicas();
        String dataFormatada = LocalDateTime.now().toString();
        
        String novaAnotacao = String.format(
            "\n\n--- Anotação adicionada em %s por %s ---\n%s",
            dataFormatada,
            usuarioResponsavel,
            anotacaoDTO.getTexto()
        );
        
        if (anotacoesAtuais == null || anotacoesAtuais.trim().isEmpty()) {
            prontuario.setCondicoesClinicas(novaAnotacao.trim());
        } else {
            prontuario.setCondicoesClinicas(anotacoesAtuais + novaAnotacao);
        }
        
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());
        
        return prontuarioRepository.save(prontuario);
    }
    
    public Prontuario atualizarStatusTratamento(Long id, StatusTratamentoDTO statusDTO, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));
        
        try {
            StatusTratamento novoStatus = StatusTratamento.valueOf(statusDTO.getStatus());
            
            prontuario.setStatusTratamento(novoStatus);
            
            if (novoStatus == StatusTratamento.ALTA_MEDICA) {
                prontuario.setDataAlta(LocalDateTime.now());
                prontuario.setMotivoAlta(statusDTO.getMotivoAlta());
                
                String historicoAtual = prontuario.getHistoricoMedico();
                String dataFormatada = LocalDateTime.now().toString();
                
                String registroAlta = String.format(
                    "\n\n--- ALTA MÉDICA em %s por %s ---\nMotivo: %s",
                    dataFormatada,
                    usuarioResponsavel,
                    statusDTO.getMotivoAlta() != null ? statusDTO.getMotivoAlta() : "Não informado"
                );
                
                if (historicoAtual == null || historicoAtual.trim().isEmpty()) {
                    prontuario.setHistoricoMedico(registroAlta.trim());
                } else {
                    prontuario.setHistoricoMedico(historicoAtual + registroAlta);
                }
            }
            
            prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
            prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
            prontuario.setDataUltimaAlteracao(LocalDateTime.now());
            
            return prontuarioRepository.save(prontuario);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Status de tratamento inválido: " + statusDTO.getStatus());
        }
    }
}
