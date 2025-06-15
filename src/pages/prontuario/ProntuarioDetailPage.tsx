
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FileEdit,
  ArrowLeft,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  FilePlus,
  FileText,
  Activity,
  Pill,
  FileImage,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Textarea from '../../components/ui/Textarea';
import Input from '../../components/ui/Input';
import { 
  buscarProntuarioPorId, 
  adicionarHistoricoMedico,
  adicionarMedicacao,
  adicionarExame,
  adicionarAnotacao,
  atualizarStatusTratamento
} from '../../services/prontuarioService';
import { Prontuario, TipoTratamento, StatusTratamento } from '../../types/prontuario';

// Schemas de validação para os diferentes tipos de registros
const novoRegistroSchema = z.object({
  descricao: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
});

const novaMedicacaoSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  dosagem: z.string().min(2, 'A dosagem deve ser informada'),
  frequencia: z.string().min(2, 'A frequência deve ser informada'),
  dataInicio: z.string().min(8, 'A data de início deve ser informada'),
  dataFim: z.string().optional(),
  observacoes: z.string().optional(),
});

const novoExameSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  data: z.string().min(8, 'A data deve ser informada'),
  resultado: z.string().min(2, 'O resultado deve ser informado'),
  observacoes: z.string().optional(),
});

const novaAnotacaoSchema = z.object({
  texto: z.string().min(10, 'O texto deve ter pelo menos 10 caracteres'),
});

type NovoRegistroFormData = z.infer<typeof novoRegistroSchema>;
type NovaMedicacaoFormData = z.infer<typeof novaMedicacaoSchema>;
type NovoExameFormData = z.infer<typeof novoExameSchema>;
type NovaAnotacaoFormData = z.infer<typeof novaAnotacaoSchema>;

const ProntuarioDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'historico' | 'medicacoes' | 'exames' | 'anotacoes'>('historico');
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);
  const [showMedicacaoModal, setShowMedicacaoModal] = useState(false);
  const [showExameModal, setShowExameModal] = useState(false);
  const [showAnotacaoModal, setShowAnotacaoModal] = useState(false);
  const [showStatusTratamentoModal, setShowStatusTratamentoModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Configuração dos formulários
  const historicoForm = useForm<NovoRegistroFormData>({
    resolver: zodResolver(novoRegistroSchema),
    defaultValues: { descricao: '' },
  });
  
  const medicacaoForm = useForm<NovaMedicacaoFormData>({
    resolver: zodResolver(novaMedicacaoSchema),
    defaultValues: { 
      nome: '', 
      dosagem: '', 
      frequencia: '', 
      dataInicio: new Date().toISOString().split('T')[0], 
      dataFim: '',
      observacoes: '' 
    },
  });
  
  const exameForm = useForm<NovoExameFormData>({
    resolver: zodResolver(novoExameSchema),
    defaultValues: { nome: '', data: '', resultado: '', observacoes: '' },
  });
  
  const anotacaoForm = useForm<NovaAnotacaoFormData>({
    resolver: zodResolver(novaAnotacaoSchema),
    defaultValues: { texto: '' },
  });
  
  // Formulário para atualizar o status do tratamento
  const statusTratamentoSchema = z.object({
    status: z.string().min(1, 'O status é obrigatório'),
    motivoAlta: z.string().optional(),
  }).refine((data) => {
    // Se o status for ALTA_MEDICA, o motivo é obrigatório
    if (data.status === StatusTratamento.ALTA_MEDICA) {
      return data.motivoAlta && data.motivoAlta.length >= 10;
    }
    return true;
  }, {
    message: 'O motivo da alta é obrigatório e deve ter pelo menos 10 caracteres',
    path: ['motivoAlta'], // Caminho do campo que falhou na validação
  });
  
  type StatusTratamentoFormData = z.infer<typeof statusTratamentoSchema>;
  
  const statusTratamentoForm = useForm<StatusTratamentoFormData>({
    resolver: zodResolver(statusTratamentoSchema),
    defaultValues: { 
      status: StatusTratamento.EM_TRATAMENTO,
      motivoAlta: '' 
    },
  });
  
  // Observa mudanças no campo status para validar o campo motivoAlta
  useEffect(() => {
    const subscription = statusTratamentoForm.watch((value, { name }) => {
      if (name === 'status') {
        statusTratamentoForm.trigger('motivoAlta');
      }
    });
    return () => subscription.unsubscribe();
  }, [statusTratamentoForm]);

  useEffect(() => {
    const fetchProntuario = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await buscarProntuarioPorId(id);
        setProntuario(result);
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        console.error('Erro ao buscar prontuário:', err);
        setError(err.response?.data?.message || 'Erro ao buscar dados do prontuário. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProntuario();
  }, [id]);

  const formatData = (dataString: string) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  const renderTipoTratamento = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      [TipoTratamento.TERAPIA_INDIVIDUAL]: 'Terapia Individual',
      [TipoTratamento.TERAPIA_CASAL]: 'Terapia de Casal',
      [TipoTratamento.TERAPIA_GRUPO]: 'Terapia de Grupo',
      [TipoTratamento.TERAPIA_FAMILIAR]: 'Terapia Familiar',
      [TipoTratamento.OUTRO]: 'Outro',
    };
    return tipos[tipo] || tipo;
  };
  
  const renderStatusTratamento = (status?: StatusTratamento) => {
    if (!status) return 'Em Tratamento';
    
    const statusMap: { [key in StatusTratamento]: { label: string; color: string; icon: React.ReactNode } } = {
      [StatusTratamento.EM_TRATAMENTO]: { 
        label: 'Em Tratamento', 
        color: 'text-blue-600 bg-blue-50', 
        icon: <Activity className="h-4 w-4 mr-1" /> 
      },
      [StatusTratamento.ALTA_MEDICA]: { 
        label: 'Alta Médica', 
        color: 'text-green-600 bg-green-50', 
        icon: <CheckCircle className="h-4 w-4 mr-1" /> 
      },
      [StatusTratamento.ABANDONOU_TRATAMENTO]: { 
        label: 'Abandonou Tratamento', 
        color: 'text-orange-600 bg-orange-50', 
        icon: <AlertCircle className="h-4 w-4 mr-1" /> 
      },
      [StatusTratamento.TRANSFERIDO]: { 
        label: 'Transferido', 
        color: 'text-purple-600 bg-purple-50', 
        icon: <ArrowLeft className="h-4 w-4 mr-1" /> 
      }
    };
    
    const { label, color, icon } = statusMap[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {icon}
        {label}
      </span>
    );
  };

  // Funções renderGenero e renderStatus não podem mais ser usadas como antes
  // pois o objeto 'prontuario' não tem as propriedades 'paciente' ou 'status'
  
  if (isLoading) {
    return (
      <div className="container-medium">
        <div className="text-center py-12">
          {/* Skeleton loading */}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container-medium">
        <Alert type="error" title="Erro ao carregar prontuário" message={error} />
        <div className="mt-4">
          <Link to="/prontuarios">
            <Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Voltar para a lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  if (!prontuario) {
    return (
      <div className="container-medium">
        <Alert type="warning" title="Prontuário não encontrado" message="O prontuário solicitado não foi encontrado." />
        <div className="mt-4">
          <Link to="/prontuarios">
            <Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Voltar para a lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Simplificando as abas para exibir o conteúdo como String, conforme vem do backend
  const renderContentAsString = (title: string, content: string | undefined | null, icon: React.ReactNode) => {
    if (!content || content.trim() === "") {
      return (
        <div className="bg-neutral-50 rounded-lg p-6 text-center">
          {icon}
          <h3 className="text-lg font-medium text-neutral-700 mb-2">{title}</h3>
          <p className="text-neutral-500 mb-4">Sem registros.</p>
        </div>
      );
    }
    return (
      <Card>
        <h2 className="text-lg font-medium text-neutral-900 mb-4">{title}</h2>
        <p className="text-neutral-700 whitespace-pre-line">{content}</p>
      </Card>
    );
  };
  
  return (
    <div className="container-medium">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="flex items-center mb-2">
            <Link to="/prontuarios" className="text-neutral-500 hover:text-neutral-700 mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-bold text-neutral-900">
              Prontuário #{prontuario.numeroProntuario}
            </h1>
          </div>
          <div className="flex items-center">
            <div className="text-neutral-500 text-sm mr-4">
              <span className="mr-1">Iniciado em:</span>
              <span className="font-medium">{formatData(prontuario.dataCriacao)}</span>
            </div>
            <div className="text-neutral-500 text-sm">
              <span className="mr-1">Status:</span>
              {renderStatusTratamento(prontuario.statusTratamento)}
            </div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link to={`/prontuarios/${prontuario.id}/editar`}>
            <Button variant="primary" leftIcon={<FileEdit className="h-4 w-4" />}>
              Editar Prontuário
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Dados do Paciente</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 text-neutral-400 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-neutral-900">{prontuario.nomePaciente}</h3>
                <p className="text-sm text-neutral-500">
                  <span className="font-medium">CPF:</span> {prontuario.paciente?.cpf || 'Não informado'}
                </p>
                <p className="text-sm text-neutral-500">
                  <span className="font-medium">Data de Nascimento:</span> {prontuario.paciente?.dataNascimento ? formatData(prontuario.paciente.dataNascimento) : 'Não informada'}
                </p>
                <p className="text-sm text-neutral-500">
                  <span className="font-medium">Gênero:</span> {prontuario.paciente?.genero || 'Não informado'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-neutral-400 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Contato</h3>
                <p className="text-sm text-neutral-500">
                  <span className="font-medium">Telefone:</span> {prontuario.paciente?.telefone || 'Não informado'}
                </p>
                <p className="text-sm text-neutral-500">
                  <span className="font-medium">Email:</span> {prontuario.paciente?.email ? (
                    <a href={`mailto:${prontuario.paciente.email}`} className="text-primary-600 hover:underline flex items-center">
                      {prontuario.paciente.email}
                      <Mail className="h-3 w-3 ml-1" />
                    </a>
                  ) : 'Não informado'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-neutral-400 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Endereço</h3>
                <p className="text-sm text-neutral-500">
                  {prontuario.paciente?.logradouro ? (
                    <>
                      {prontuario.paciente.logradouro}, {prontuario.paciente.numero}
                      {prontuario.paciente.complemento && `, ${prontuario.paciente.complemento}`}
                    </>
                  ) : 'Logradouro não informado'}
                </p>
                <p className="text-sm text-neutral-500">
                  {prontuario.paciente?.bairro ? (
                    <>
                      {prontuario.paciente.bairro}, {prontuario.paciente.cidade} - {prontuario.paciente.estado}
                    </>
                  ) : 'Bairro não informado'}
                </p>
                <p className="text-sm text-neutral-500">
                  <span className="font-medium">CEP:</span> {prontuario.paciente?.cep || 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Informações do Tratamento</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-neutral-400 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Tipo de Tratamento</h3>
                <p className="text-sm text-neutral-500">
                  {renderTipoTratamento(prontuario.tipoTratamento)}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-neutral-400 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-neutral-900">Datas</h3>
                <p className="text-sm text-neutral-500">
                  <span className="font-medium">Início:</span> {formatData(prontuario.dataCriacao)}
                </p>
                <p className="text-sm text-neutral-500">
                  <span className="font-medium">Última atualização:</span> {formatData(prontuario.dataUltimaAtualizacao)}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-200 space-y-2">
            <Button 
              variant="secondary" 
              size="sm" 
              leftIcon={<FilePlus className="h-4 w-4" />} 
              fullWidth
              onClick={() => {
                // Abre o modal correspondente à aba ativa
                switch (activeTab) {
                  case 'historico':
                    setShowHistoricoModal(true);
                    break;
                  case 'medicacoes':
                    setShowMedicacaoModal(true);
                    break;
                  case 'exames':
                    setShowExameModal(true);
                    break;
                  case 'anotacoes':
                    setShowAnotacaoModal(true);
                    break;
                }
              }}
            >
              Adicionar Registro
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm" 
              leftIcon={<CheckCircle className="h-4 w-4" />} 
              fullWidth
              onClick={() => {
                // Inicializa o formulário com o status atual
                statusTratamentoForm.reset({
                  status: prontuario.statusTratamento || StatusTratamento.EM_TRATAMENTO,
                  motivoAlta: prontuario.motivoAlta || ''
                });
                setShowStatusTratamentoModal(true);
              }}
            >
              Atualizar Status
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Abas de Navegação */}
      <div className="mb-6">
        <div className="border-b border-neutral-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'historico'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('historico')}
            >
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Histórico Médico
              </div>
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'medicacoes'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('medicacoes')}
            >
              <div className="flex items-center">
                <Pill className="h-4 w-4 mr-2" />
                Medicações
              </div>
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'exames'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('exames')}
            >
              <div className="flex items-center">
                <FileImage className="h-4 w-4 mr-2" />
                Exames
              </div>
            </button>
            <button
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'anotacoes'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
              onClick={() => setActiveTab('anotacoes')}
            >
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                Anotações
              </div>
            </button>
          </nav>
        </div>
      </div>
      
      {/* Conteúdo das Abas Corrigido */}
      <div className="animate-fade-in">
        {activeTab === 'historico' && renderContentAsString("Histórico Médico", prontuario.historicoMedico, <Activity className="h-12 w-12 text-neutral-400 mx-auto mb-4" />)}
        {activeTab === 'medicacoes' && renderContentAsString("Medicações", prontuario.medicamentos, <Pill className="h-12 w-12 text-neutral-400 mx-auto mb-4" />)}
        {activeTab === 'exames' && renderContentAsString("Exames", prontuario.exames, <FileImage className="h-12 w-12 text-neutral-400 mx-auto mb-4" />)}
        {activeTab === 'anotacoes' && renderContentAsString("Anotações", prontuario.condicoesClinicas, <MessageSquare className="h-12 w-12 text-neutral-400 mx-auto mb-4" />)}
      </div>
      
      {/* Modal para adicionar novo registro de histórico médico */}
      {showHistoricoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-900">Adicionar Histórico Médico</h2>
                <button 
                  onClick={() => {
                    setShowHistoricoModal(false);
                    historicoForm.reset();
                    setSuccessMessage(null);
                  }}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {successMessage && (
                <Alert 
                  type="success" 
                  message={successMessage} 
                  className="mb-4"
                  onClose={() => setSuccessMessage(null)}
                />
              )}
              
              <form onSubmit={historicoForm.handleSubmit(async (data) => {
                if (!id) return;
                setIsSaving(true);
                try {
                  await adicionarHistoricoMedico(id, { descricao: data.descricao });
                  setSuccessMessage('Histórico médico adicionado com sucesso!');
                  historicoForm.reset();
                  
                  // Atualiza os dados do prontuário
                  const updatedProntuario = await buscarProntuarioPorId(id);
                  setProntuario(updatedProntuario);
                  
                  // Fecha o modal após 2 segundos
                  setTimeout(() => {
                    setShowHistoricoModal(false);
                    setSuccessMessage(null);
                  }, 2000);
                } catch (error: unknown) {
                  const err = error as { response?: { data?: { message?: string } } };
                  setError(err.response?.data?.message || 'Erro ao adicionar histórico médico. Tente novamente.');
                } finally {
                  setIsSaving(false);
                }
              })}>
                <Textarea
                  label="Descrição"
                  placeholder="Descreva o novo registro médico..."
                  rows={5}
                  {...historicoForm.register('descricao')}
                  error={historicoForm.formState.errors.descricao?.message}
                  required
                />
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowHistoricoModal(false);
                      historicoForm.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para adicionar nova medicação */}
      {showMedicacaoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-900">Adicionar Medicação</h2>
                <button 
                  onClick={() => {
                    setShowMedicacaoModal(false);
                    medicacaoForm.reset();
                    setSuccessMessage(null);
                  }}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {successMessage && (
                <Alert 
                  type="success" 
                  message={successMessage} 
                  className="mb-4"
                  onClose={() => setSuccessMessage(null)}
                />
              )}
              
              <form onSubmit={medicacaoForm.handleSubmit(async (data) => {
                if (!id) return;
                setIsSaving(true);
                try {
                  await adicionarMedicacao(id, data);
                  setSuccessMessage('Medicação adicionada com sucesso!');
                  medicacaoForm.reset();
                  
                  // Atualiza os dados do prontuário
                  const updatedProntuario = await buscarProntuarioPorId(id);
                  setProntuario(updatedProntuario);
                  
                  // Fecha o modal após 2 segundos
                  setTimeout(() => {
                    setShowMedicacaoModal(false);
                    setSuccessMessage(null);
                  }, 2000);
                } catch (error: unknown) {
                  const err = error as { response?: { data?: { message?: string } } };
                  setError(err.response?.data?.message || 'Erro ao adicionar medicação. Tente novamente.');
                } finally {
                  setIsSaving(false);
                }
              })}>
                <div className="space-y-4">
                  <Input
                    label="Nome da Medicação"
                    placeholder="Ex: Paracetamol"
                    {...medicacaoForm.register('nome')}
                    error={medicacaoForm.formState.errors.nome?.message}
                    required
                  />
                  
                  <Input
                    label="Dosagem"
                    placeholder="Ex: 500mg"
                    {...medicacaoForm.register('dosagem')}
                    error={medicacaoForm.formState.errors.dosagem?.message}
                    required
                  />
                  
                  <Input
                    label="Frequência"
                    placeholder="Ex: 8 em 8 horas"
                    {...medicacaoForm.register('frequencia')}
                    error={medicacaoForm.formState.errors.frequencia?.message}
                    required
                  />
                  
                  <Input
                    label="Data de Início"
                    type="date"
                    {...medicacaoForm.register('dataInicio')}
                    error={medicacaoForm.formState.errors.dataInicio?.message}
                    required
                  />
                  
                  <Input
                    label="Data de Término (opcional)"
                    type="date"
                    {...medicacaoForm.register('dataFim')}
                    error={medicacaoForm.formState.errors.dataFim?.message}
                  />
                  
                  <Textarea
                    label="Observações"
                    placeholder="Observações adicionais sobre a medicação..."
                    rows={3}
                    {...medicacaoForm.register('observacoes')}
                    error={medicacaoForm.formState.errors.observacoes?.message}
                  />
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowMedicacaoModal(false);
                      medicacaoForm.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para adicionar novo exame */}
      {showExameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-900">Adicionar Exame</h2>
                <button 
                  onClick={() => {
                    setShowExameModal(false);
                    exameForm.reset();
                    setSuccessMessage(null);
                  }}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {successMessage && (
                <Alert 
                  type="success" 
                  message={successMessage} 
                  className="mb-4"
                  onClose={() => setSuccessMessage(null)}
                />
              )}
              
              <form onSubmit={exameForm.handleSubmit(async (data) => {
                if (!id) return;
                setIsSaving(true);
                try {
                  await adicionarExame(id, data);
                  setSuccessMessage('Exame adicionado com sucesso!');
                  exameForm.reset();
                  
                  // Atualiza os dados do prontuário
                  const updatedProntuario = await buscarProntuarioPorId(id);
                  setProntuario(updatedProntuario);
                  
                  // Fecha o modal após 2 segundos
                  setTimeout(() => {
                    setShowExameModal(false);
                    setSuccessMessage(null);
                  }, 2000);
                } catch (error: unknown) {
                  const err = error as { response?: { data?: { message?: string } } };
                  setError(err.response?.data?.message || 'Erro ao adicionar exame. Tente novamente.');
                } finally {
                  setIsSaving(false);
                }
              })}>
                <div className="space-y-4">
                  <Input
                    label="Nome do Exame"
                    placeholder="Ex: Hemograma Completo"
                    {...exameForm.register('nome')}
                    error={exameForm.formState.errors.nome?.message}
                    required
                  />
                  
                  <Input
                    label="Data do Exame"
                    type="date"
                    {...exameForm.register('data')}
                    error={exameForm.formState.errors.data?.message}
                    required
                  />
                  
                  <Textarea
                    label="Resultado"
                    placeholder="Descreva o resultado do exame..."
                    rows={3}
                    {...exameForm.register('resultado')}
                    error={exameForm.formState.errors.resultado?.message}
                    required
                  />
                  
                  <Textarea
                    label="Observações"
                    placeholder="Observações adicionais sobre o exame..."
                    rows={3}
                    {...exameForm.register('observacoes')}
                    error={exameForm.formState.errors.observacoes?.message}
                  />
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowExameModal(false);
                      exameForm.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para adicionar nova anotação */}
      {showAnotacaoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-900">Adicionar Anotação</h2>
                <button 
                  onClick={() => {
                    setShowAnotacaoModal(false);
                    anotacaoForm.reset();
                    setSuccessMessage(null);
                  }}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {successMessage && (
                <Alert 
                  type="success" 
                  message={successMessage} 
                  className="mb-4"
                  onClose={() => setSuccessMessage(null)}
                />
              )}
              
              <form onSubmit={anotacaoForm.handleSubmit(async (data) => {
                if (!id) return;
                setIsSaving(true);
                try {
                  await adicionarAnotacao(id, data);
                  setSuccessMessage('Anotação adicionada com sucesso!');
                  anotacaoForm.reset();
                  
                  // Atualiza os dados do prontuário
                  const updatedProntuario = await buscarProntuarioPorId(id);
                  setProntuario(updatedProntuario);
                  
                  // Fecha o modal após 2 segundos
                  setTimeout(() => {
                    setShowAnotacaoModal(false);
                    setSuccessMessage(null);
                  }, 2000);
                } catch (error: unknown) {
                  const err = error as { response?: { data?: { message?: string } } };
                  setError(err.response?.data?.message || 'Erro ao adicionar anotação. Tente novamente.');
                } finally {
                  setIsSaving(false);
                }
              })}>
                <Textarea
                  label="Texto da Anotação"
                  placeholder="Digite sua anotação..."
                  rows={5}
                  {...anotacaoForm.register('texto')}
                  error={anotacaoForm.formState.errors.texto?.message}
                  required
                />
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowAnotacaoModal(false);
                      anotacaoForm.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para atualizar o status do tratamento */}
      {showStatusTratamentoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-900">Atualizar Status do Tratamento</h2>
                <button 
                  onClick={() => {
                    setShowStatusTratamentoModal(false);
                    statusTratamentoForm.reset();
                    setSuccessMessage(null);
                  }}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {successMessage && (
                <Alert 
                  type="success" 
                  message={successMessage} 
                  className="mb-4"
                  onClose={() => setSuccessMessage(null)}
                />
              )}
              
              {error && (
                <Alert 
                  type="error" 
                  message={error} 
                  className="mb-4"
                  onClose={() => setError(null)}
                />
              )}
              
              <form onSubmit={(e) => {
                console.log('Form submitted');
                statusTratamentoForm.handleSubmit(async (data: StatusTratamentoFormData) => {
                  console.log('Form handler called with data:', data);
                  if (!id) return;
                  setIsSaving(true);
                  try {
                    console.log('Enviando dados para atualizar status:', {
                      id,
                      status: data.status,
                      motivoAlta: data.motivoAlta
                    });
                  
                  await atualizarStatusTratamento(
                    id, 
                    data.status as StatusTratamento, 
                    data.motivoAlta
                  );
                  setSuccessMessage('Status do tratamento atualizado com sucesso!');
                  
                  // Atualiza os dados do prontuário
                  const updatedProntuario = await buscarProntuarioPorId(id);
                  setProntuario(updatedProntuario);
                  
                  // Fecha o modal após 2 segundos
                  setTimeout(() => {
                    setShowStatusTratamentoModal(false);
                    setSuccessMessage(null);
                  }, 2000);
                  } catch (error: unknown) {
                    console.error('Erro completo:', error);
                    const err = error as { response?: { data?: { message?: string } }; message?: string };
                    setError(err.response?.data?.message || err.message || 'Erro ao atualizar status do tratamento. Tente novamente.');
                  } finally {
                    setIsSaving(false);
                  }
                })(e);
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Status do Tratamento
                    </label>
                    <select
                      className="w-full rounded-md border border-neutral-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      {...statusTratamentoForm.register('status')}
                    >
                      <option value={StatusTratamento.EM_TRATAMENTO}>Em Tratamento</option>
                      <option value={StatusTratamento.ALTA_MEDICA}>Alta Médica</option>
                      <option value={StatusTratamento.ABANDONOU_TRATAMENTO}>Abandonou Tratamento</option>
                      <option value={StatusTratamento.TRANSFERIDO}>Transferido</option>
                    </select>
                    {statusTratamentoForm.formState.errors.status && (
                      <p className="mt-1 text-sm text-red-600">
                        {statusTratamentoForm.formState.errors.status.message}
                      </p>
                    )}
                  </div>
                  
                  {statusTratamentoForm.watch('status') === StatusTratamento.ALTA_MEDICA && (
                    <Textarea
                      label="Motivo da Alta"
                      placeholder="Descreva o motivo da alta médica..."
                      rows={3}
                      {...statusTratamentoForm.register('motivoAlta')}
                      error={statusTratamentoForm.formState.errors.motivoAlta?.message?.toString()}
                      required
                    />
                  )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowStatusTratamentoModal(false);
                      statusTratamentoForm.reset();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                  >
                    Salvar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProntuarioDetailPage;
