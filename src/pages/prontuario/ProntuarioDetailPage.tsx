// Arquivo: src/pages/prontuario/ProntuarioDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileEdit,
  ArrowLeft,
  Calendar,
  User,
  // Removido Phone, Mail, MapPin, pois os dados não estão disponíveis
  FilePlus,
  FileText,
  Activity,
  Pill,
  FileImage,
  MessageSquare
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { buscarProntuarioPorId } from '../../services/prontuarioService';
import { Prontuario, TipoTratamento, StatusProntuario, Genero } from '../../types/prontuario';

const ProntuarioDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'historico' | 'medicacoes' | 'exames' | 'anotacoes'>('historico');

  useEffect(() => {
    const fetchProntuario = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await buscarProntuarioPorId(id);
        setProntuario(result);
      } catch (error: any) {
        console.error('Erro ao buscar prontuário:', error);
        setError(error.response?.data?.message || 'Erro ao buscar dados do prontuário. Tente novamente mais tarde.');
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
            {/* REMOVIDO: Status não existe no backend */}
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
                {/* ALTERAÇÃO: Usando `nomePaciente` diretamente */}
                <h3 className="text-sm font-medium text-neutral-900">{prontuario.nomePaciente}</h3>
                {/* REMOVIDO: Gênero e data de nascimento não estão disponíveis no objeto prontuario */}
              </div>
            </div>
            {/* REMOVIDO: Seções de Contato e Endereço, pois os dados não são fornecidos pelo backend */}
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
          <div className="mt-6 pt-4 border-t border-neutral-200">
            {/* Este botão pode ser adaptado para uma modal de adição de registro genérico */}
            <Button variant="secondary" size="sm" leftIcon={<FilePlus className="h-4 w-4" />} fullWidth>
              Adicionar Registro
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Abas de Navegação */}
      <div className="mb-6">
        <div className="border-b border-neutral-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            {/* ... botões de navegação das abas ... */}
          </nav>
        </div>
      </div>
      
      {/* Conteúdo das Abas Corrigido */}
      <div className="animate-fade-in">
        {activeTab === 'historico' && renderContentAsString("Histórico Médico", prontuario.historicoMedico, <Activity className="h-12 w-12 text-neutral-400 mx-auto mb-4" />)}
        {activeTab === 'medicacoes' && renderContentAsString("Medicações", prontuario.medicamentos, <Pill className="h-12 w-12 text-neutral-400 mx-auto mb-4" />)}
        {activeTab === 'exames' && renderContentAsString("Exames", prontuario.exames, <FileImage className="h-12 w-12 text-neutral-400 mx-auto mb-4" />)}
        {activeTab === 'anotacoes' && renderContentAsString("Anotações", undefined, <MessageSquare className="h-12 w-12 text-neutral-400 mx-auto mb-4" />)}
      </div>
    </div>
  );
};

export default ProntuarioDetailPage;