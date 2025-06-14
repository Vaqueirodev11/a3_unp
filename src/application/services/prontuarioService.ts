// Arquivo: src/services/prontuarioService.ts
import api from './api';
import { 
  BuscaProntuarioParams, 
  Prontuario, 
  ResultadoBusca,
  StatusTratamento
} from '../types/prontuario';

// Interface para o payload de criação/atualização, alinhada com o ProntuarioDTO do backend
export interface ProntuarioPayload {
  // Paciente com estrutura achatada (sem o objeto endereco aninhado)
  paciente: {
    nome: string;
    dataNascimento: string;
    cpf: string;
    genero: string;
    telefone: string;
    email: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  tipoTratamento: string;
  historicoMedico: string; // String simples
  numeroProntuario: string;
  medicamentos?: string;
  exames?: string;
  condicoesClinicas?: string;
  nome_paciente: string; // Campo necessário para satisfazer a restrição not-null no banco de dados
}

// A função buscarProntuarios volta a esperar um objeto ResultadoBusca,
// que é o padrão ideal para lidar com paginação.
export const buscarProntuarios = async (params: BuscaProntuarioParams): Promise<ResultadoBusca> => {
  try {
    const response = await api.get('/prontuarios', { params });
    // Se o backend não retornar a estrutura de paginação, você precisará adaptar aqui.
    // Ex: return { content: response.data, pageable: { ...valores padrão } }
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar prontuários:', error);
    throw error;
  }
};

export const buscarProntuarioPorId = async (id: string): Promise<Prontuario> => {
  try {
    const response = await api.get(`/prontuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar prontuário ${id}:`, error);
    throw error;
  }
};

// CORRIGIDO: A função agora espera o payload com a estrutura correta (aninhada)
export const criarProntuario = async (dados: ProntuarioPayload): Promise<Prontuario> => {
  try {
    const response = await api.post('/prontuarios', dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar prontuário:', error);
    throw error;
  }
};

// CORRIGIDO: A função agora espera o payload com a estrutura correta (aninhada)
// Usamos Partial<ProntuarioPayload> para permitir atualizações parciais
export const atualizarProntuario = async (id: string, dados: Partial<ProntuarioPayload>): Promise<Prontuario> => {
  try {
    const response = await api.put(`/prontuarios/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar prontuário ${id}:`, error);
    throw error;
  }
};

export const adicionarHistoricoMedico = async (prontuarioId: string, dados: { descricao: string }) => {
  try {
    const response = await api.post(`/prontuarios/${prontuarioId}/historico-medico`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar histórico médico:', error);
    throw error;
  }
};

export const adicionarMedicacao = async (prontuarioId: string, dados: {
  nome: string;
  dosagem: string;
  frequencia: string;
  dataInicio: string;
  dataFim?: string;
  observacoes?: string;
}) => {
  try {
    const response = await api.post(`/prontuarios/${prontuarioId}/medicacoes`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar medicação:', error);
    throw error;
  }
};

export const adicionarExame = async (prontuarioId: string, dados: {
  nome: string;
  data: string;
  resultado: string;
  observacoes?: string;
  arquivo?: File;
}) => {
  try {
    // Se tiver arquivo, usa FormData
    if (dados.arquivo) {
      const formData = new FormData();
      formData.append('nome', dados.nome);
      formData.append('data', dados.data);
      formData.append('resultado', dados.resultado);
      
      if (dados.observacoes) {
        formData.append('observacoes', dados.observacoes);
      }
      
      formData.append('arquivo', dados.arquivo);
      
      const response = await api.post(`/prontuarios/${prontuarioId}/exames`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Sem arquivo, usa JSON normal
      const response = await api.post(`/prontuarios/${prontuarioId}/exames`, dados);
      return response.data;
    }
  } catch (error) {
    console.error('Erro ao adicionar exame:', error);
    throw error;
  }
};

export const adicionarAnotacao = async (prontuarioId: string, dados: {
  texto: string;
}) => {
  try {
    const response = await api.post(`/prontuarios/${prontuarioId}/anotacoes`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar anotação:', error);
    throw error;
  }
};

export const mudarStatusProntuario = async (prontuarioId: string, status: string) => {
  try {
    const response = await api.patch(`/prontuarios/${prontuarioId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Erro ao mudar status do prontuário:', error);
    throw error;
  }
};

/**
 * Atualiza o status do tratamento do prontuário
 * @param prontuarioId ID do prontuário
 * @param status Novo status do tratamento
 * @param motivoAlta Motivo da alta (obrigatório se status for ALTA_MEDICA)
 * @returns Prontuário atualizado
 */
export const atualizarStatusTratamento = async (
  prontuarioId: string, 
  status: StatusTratamento, 
  motivoAlta?: string
) => {
  try {
    const payload: { status: string; motivoAlta?: string } = {
      status: status // O enum já é uma string no TypeScript
    };
    
    // Se o status for ALTA_MEDICA, o motivo é obrigatório
    if (status === StatusTratamento.ALTA_MEDICA) {
      if (!motivoAlta) {
        throw new Error('O motivo da alta é obrigatório para alta médica');
      }
      payload.motivoAlta = motivoAlta;
    }
    
    console.log('Enviando requisição para atualizar status:', {
      url: `/prontuarios/${prontuarioId}/status-tratamento`,
      payload
    });
    
    const response = await api.patch(`/prontuarios/${prontuarioId}/status-tratamento`, payload);
    console.log('Resposta da atualização de status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao atualizar status do tratamento:', error);
    throw error;
  }
};
