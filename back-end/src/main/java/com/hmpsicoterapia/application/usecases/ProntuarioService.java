// Arquivo: back-end/src/main/java/com/hmpsicoterapia/service/ProntuarioService.java
package com.hmpsicoterapia.service;

import com.hmpsicoterapia.dto.PacienteDTO;
import com.hmpsicoterapia.dto.ProntuarioDTO;
import com.hmpsicoterapia.dto.StatusTratamentoDTO;
import com.hmpsicoterapia.entity.Paciente;
import com.hmpsicoterapia.entity.Prontuario;
import com.hmpsicoterapia.entity.StatusTratamento;
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
        
        // Adiciona o nome do paciente para satisfazer a restrição not-null no banco de dados
        // Primeiro tenta usar o campo nome_paciente do DTO, se disponível
        if (dto.getNome_paciente() != null && !dto.getNome_paciente().isEmpty()) {
            prontuario.setNomePaciente(dto.getNome_paciente());
        } else {
            // Caso contrário, usa o nome do paciente
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
    
    // O método de atualização também precisará ser ajustado de forma similar
    public Prontuario atualizarProntuario(Long id, ProntuarioDTO dto, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));

        // Atualizar dados do Paciente
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
        
        // Atualiza o nome do paciente no prontuário
        // Primeiro tenta usar o campo nome_paciente do DTO, se disponível
        if (dto.getNome_paciente() != null && !dto.getNome_paciente().isEmpty()) {
            prontuario.setNomePaciente(dto.getNome_paciente());
        } else {
            // Caso contrário, usa o nome do paciente
            prontuario.setNomePaciente(paciente.getNome());
        }

        // Atualizar dados do Prontuário
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
        // Esta busca por filtro precisará ser ajustada para buscar no nome do paciente aninhado
        // Ex: "p.paciente.nome" em vez de "p.nomePaciente"
        return prontuarioRepository.buscarPorFiltro(filtro);
    }

    public Optional<Prontuario> buscarPorId(Long id) {
        return prontuarioRepository.findById(id);
    }
    
    /**
     * Adiciona um novo registro ao histórico médico do prontuário
     * @param id ID do prontuário
     * @param descricao Descrição do novo registro
     * @param usuarioResponsavel Nome do usuário responsável pela adição
     * @return Prontuário atualizado
     */
    public Prontuario adicionarHistoricoMedico(Long id, String descricao, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));
        
        // Adiciona a nova descrição ao histórico médico existente
        String historicoAtual = prontuario.getHistoricoMedico();
        String dataFormatada = LocalDateTime.now().toString();
        
        // Formata o novo registro com data e usuário responsável
        String novoRegistro = String.format(
            "\n\n--- Registro adicionado em %s por %s ---\n%s",
            dataFormatada,
            usuarioResponsavel,
            descricao
        );
        
        // Se o histórico atual estiver vazio, não adiciona quebras de linha extras
        if (historicoAtual == null || historicoAtual.trim().isEmpty()) {
            prontuario.setHistoricoMedico(novoRegistro.trim());
        } else {
            prontuario.setHistoricoMedico(historicoAtual + novoRegistro);
        }
        
        // Atualiza as datas de modificação
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());
        
        return prontuarioRepository.save(prontuario);
    }
    
    /**
     * Adiciona uma nova medicação ao prontuário
     * @param id ID do prontuário
     * @param medicacaoDTO Dados da medicação
     * @param usuarioResponsavel Nome do usuário responsável pela adição
     * @return Prontuário atualizado
     */
    public Prontuario adicionarMedicacao(Long id, com.hmpsicoterapia.dto.MedicacaoDTO medicacaoDTO, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));
        
        // Adiciona a nova medicação às medicações existentes
        String medicacoesAtuais = prontuario.getMedicamentos();
        String dataFormatada = LocalDateTime.now().toString();
        
        // Formata a nova medicação com data e usuário responsável
        String novaMedicacao = String.format(
            "\n\n--- Medicação adicionada em %s por %s ---\nNome: %s\nDosagem: %s\nFrequência: %s\nObservações: %s",
            dataFormatada,
            usuarioResponsavel,
            medicacaoDTO.getNome(),
            medicacaoDTO.getDosagem(),
            medicacaoDTO.getFrequencia(),
            medicacaoDTO.getObservacoes() != null ? medicacaoDTO.getObservacoes() : "N/A"
        );
        
        // Se as medicações atuais estiverem vazias, não adiciona quebras de linha extras
        if (medicacoesAtuais == null || medicacoesAtuais.trim().isEmpty()) {
            prontuario.setMedicamentos(novaMedicacao.trim());
        } else {
            prontuario.setMedicamentos(medicacoesAtuais + novaMedicacao);
        }
        
        // Atualiza as datas de modificação
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());
        
        return prontuarioRepository.save(prontuario);
    }
    
    /**
     * Adiciona um novo exame ao prontuário
     * @param id ID do prontuário
     * @param exameDTO Dados do exame
     * @param usuarioResponsavel Nome do usuário responsável pela adição
     * @return Prontuário atualizado
     */
    public Prontuario adicionarExame(Long id, com.hmpsicoterapia.dto.ExameDTO exameDTO, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));
        
        // Adiciona o novo exame aos exames existentes
        String examesAtuais = prontuario.getExames();
        String dataFormatada = LocalDateTime.now().toString();
        
        // Formata o novo exame com data e usuário responsável
        String novoExame = String.format(
            "\n\n--- Exame adicionado em %s por %s ---\nNome: %s\nData: %s\nResultado: %s\nObservações: %s",
            dataFormatada,
            usuarioResponsavel,
            exameDTO.getNome(),
            exameDTO.getData(),
            exameDTO.getResultado(),
            exameDTO.getObservacoes() != null ? exameDTO.getObservacoes() : "N/A"
        );
        
        // Se os exames atuais estiverem vazios, não adiciona quebras de linha extras
        if (examesAtuais == null || examesAtuais.trim().isEmpty()) {
            prontuario.setExames(novoExame.trim());
        } else {
            prontuario.setExames(examesAtuais + novoExame);
        }
        
        // Atualiza as datas de modificação
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());
        
        return prontuarioRepository.save(prontuario);
    }
    
    /**
     * Adiciona uma nova anotação ao prontuário
     * @param id ID do prontuário
     * @param anotacaoDTO Dados da anotação
     * @param usuarioResponsavel Nome do usuário responsável pela adição
     * @return Prontuário atualizado
     */
    public Prontuario adicionarAnotacao(Long id, com.hmpsicoterapia.dto.AnotacaoDTO anotacaoDTO, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));
        
        // Adiciona a nova anotação às anotações existentes
        // Como não temos um campo específico para anotações no modelo atual, vamos usar o campo condicoesClinicas
        String anotacoesAtuais = prontuario.getCondicoesClinicas();
        String dataFormatada = LocalDateTime.now().toString();
        
        // Formata a nova anotação com data e usuário responsável
        String novaAnotacao = String.format(
            "\n\n--- Anotação adicionada em %s por %s ---\n%s",
            dataFormatada,
            usuarioResponsavel,
            anotacaoDTO.getTexto()
        );
        
        // Se as anotações atuais estiverem vazias, não adiciona quebras de linha extras
        if (anotacoesAtuais == null || anotacoesAtuais.trim().isEmpty()) {
            prontuario.setCondicoesClinicas(novaAnotacao.trim());
        } else {
            prontuario.setCondicoesClinicas(anotacoesAtuais + novaAnotacao);
        }
        
        // Atualiza as datas de modificação
        prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
        prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
        prontuario.setDataUltimaAlteracao(LocalDateTime.now());
        
        return prontuarioRepository.save(prontuario);
    }
    
    /**
     * Atualiza o status do tratamento do prontuário
     * @param id ID do prontuário
     * @param statusDTO DTO com o novo status e motivo (se aplicável)
     * @param usuarioResponsavel Nome do usuário responsável pela alteração
     * @return Prontuário atualizado
     */
    public Prontuario atualizarStatusTratamento(Long id, StatusTratamentoDTO statusDTO, String usuarioResponsavel) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Prontuário não encontrado"));
        
        try {
            // Converte a string do status para o enum
            StatusTratamento novoStatus = StatusTratamento.valueOf(statusDTO.getStatus());
            
            // Atualiza o status do tratamento
            prontuario.setStatusTratamento(novoStatus);
            
            // Se o status for ALTA_MEDICA, registra a data da alta e o motivo
            if (novoStatus == StatusTratamento.ALTA_MEDICA) {
                prontuario.setDataAlta(LocalDateTime.now());
                prontuario.setMotivoAlta(statusDTO.getMotivoAlta());
                
                // Adiciona um registro no histórico médico sobre a alta
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
            
            // Atualiza as datas de modificação
            prontuario.setDataUltimaAtualizacao(LocalDateTime.now());
            prontuario.setUltimaAlteracaoPor(usuarioResponsavel);
            prontuario.setDataUltimaAlteracao(LocalDateTime.now());
            
            return prontuarioRepository.save(prontuario);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Status de tratamento inválido: " + statusDTO.getStatus());
        }
    }
}
