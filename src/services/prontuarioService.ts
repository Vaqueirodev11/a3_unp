// Arquivo: src/services/prontuarioService.ts
import api from './api';
import { 
  BuscaProntuarioParams, 
  NovoProntuarioRequest, 
  Prontuario, 
  ResultadoBusca 
} from '../types/prontuario';

// Interface para o payload de criação/atualização, alinhada com o ProntuarioDTO do backend
export interface ProntuarioPayload {
  paciente: NovoProntuarioRequest['paciente']; // Objeto paciente aninhado
  tipoTratamento: string;
  historicoMedico: string; // String simples
  numeroProntuario: string;
  medicamentos?: string;
  exames?: string;
  condicoesClinicas?: string;
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
    throw error;
  }
};

export const buscarProntuarioPorId = async (id: string): Promise<Prontuario> => {
  try {
    const response = await api.get(`/prontuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// CORRIGIDO: A função agora espera o payload com a estrutura correta (aninhada)
export const criarProntuario = async (dados: ProntuarioPayload): Promise<Prontuario> => {
  try {
    const response = await api.post('/prontuarios', dados);
    return response.data;
  } catch (error) {
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
    throw error;
  }
};

export const adicionarHistoricoMedico = async (prontuarioId: string, dados: { descricao: string }) => {
  try {
    const response = await api.post(`/prontuarios/${prontuarioId}/historico-medico`, dados);
    return response.data;
  } catch (error) {
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
    throw error;
  }
};

export const mudarStatusProntuario = async (prontuarioId: string, status: string) => {
  try {
    const response = await api.patch(`/prontuarios/${prontuarioId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};