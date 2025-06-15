export interface Paciente {
  id: string;
  nome: string;
  dataNascimento: string;
  cpf: string;
  genero: Genero;
  telefone: string;
  email: string;
  endereco: Endereco;
  createdAt: string;
  updatedAt: string;
}

export interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export enum Genero {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
  OUTRO = 'OUTRO',
  NAO_INFORMADO = 'NAO_INFORMADO'
}

export enum TipoTratamento {
  TERAPIA_INDIVIDUAL = 'TERAPIA_INDIVIDUAL',
  TERAPIA_CASAL = 'TERAPIA_CASAL',
  TERAPIA_GRUPO = 'TERAPIA_GRUPO',
  TERAPIA_FAMILIAR = 'TERAPIA_FAMILIAR',
  OUTRO = 'OUTRO'
}

export enum StatusTratamento {
  EM_TRATAMENTO = 'EM_TRATAMENTO',
  ALTA_MEDICA = 'ALTA_MEDICA',
  ABANDONOU_TRATAMENTO = 'ABANDONOU_TRATAMENTO',
  TRANSFERIDO = 'TRANSFERIDO'
}

export enum StatusProntuario {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  ARQUIVADO = 'ARQUIVADO'
}

export interface HistoricoMedico {
  id: string;
  data: string;
  descricao: string;
  responsavel: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medicacao {
  id: string;
  nome: string;
  dosagem: string;
  frequencia: string;
  dataInicio: string;
  dataFim?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exame {
  id: string;
  nome: string;
  data: string;
  resultado: string;
  arquivo?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Anotacao {
  id: string;
  data: string;
  texto: string;
  responsavel: string;
  createdAt: string;
  updatedAt: string;
}

// *** INTERFACE PRONTUARIO CORRIGIDA ***
export interface Prontuario {
  id: number; // O backend envia um Long, que corresponde a um number no JS/TS
  
  // Estrutura "achatada" para corresponder à entidade Prontuario.java
  nomePaciente: string;
  historicoMedico: string; // Backend envia como String
  medicamentos: string;    // Backend envia como String
  exames: string;          // Backend envia como String
  condicoesClinicas: string; // Backend envia como String
  tipoTratamento: string;  // O enum do TS corresponderá a este valor de string
  numeroProntuario: string;
  dataCriacao: string;     // Corresponde a createdAt/dataInicio
  dataUltimaAtualizacao: string; // Corresponde a updatedAt
  ultimaAlteracaoPor: string;
  dataUltimaAlteracao: string;
  statusTratamento?: StatusTratamento; // Status do tratamento (em tratamento, alta médica, etc.)
  dataAlta?: string;       // Data da alta médica (se aplicável)
  motivoAlta?: string;     // Motivo da alta médica (se aplicável)
  
  // Adicionando a propriedade paciente para corresponder à relação OneToOne no backend
  paciente?: {
    id?: number;
    nome?: string;
    dataNascimento?: string;
    cpf?: string;
    genero?: string;
    telefone?: string;
    email?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
  };
  
  // status: StatusProntuario; // Removido pois não existe no backend
}


// Interfaces para requisições e busca podem precisar de ajustes também
export interface BuscaProntuarioParams {
  termo?: string;
  numeroProntuario?: string;
  nomePaciente?: string;
  tipoTratamento?: TipoTratamento;
  status?: StatusProntuario;
  pagina: number;
  tamanho: number;
}

export interface ResultadoBusca {
  content: Prontuario[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  }
}

export interface NovoProntuarioRequest {
  paciente: {
    nome: string;
    dataNascimento: string;
    cpf: string;
    genero: Genero;
    telefone: string;
    email: string;
    endereco: {
      logradouro: string;
      numero: string;
      complemento?: string;
      bairro: string;
      cidade: string;
      estado: string;
      cep: string;
    }
  };
  tipoTratamento: TipoTratamento;
  historicoMedico: {
    descricao: string;
  };
}
