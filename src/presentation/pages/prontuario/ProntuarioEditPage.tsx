// Arquivo: src/pages/prontuario/ProntuarioEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProntuarioForm from '../../components/prontuario/ProntuarioForm';
import Alert from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { buscarProntuarioPorId, atualizarProntuario } from '../../services/prontuarioService';
// As interfaces são usadas para definir os tipos de dados
import { Prontuario, NovoProntuarioRequest, Genero } from '../../types/prontuario';

// Interface para os dados que serão enviados ao backend, alinhada com ProntuarioDTO.java
interface ProntuarioDataForBackend {
  nomePaciente: string;
  historicoMedico: string;
  medicamentos?: string;
  exames?: string;
  condicoesClinicas?: string;
  tipoTratamento: string;
  numeroProntuario: string;
}

const ProntuarioEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        setError(
          error.response?.data?.message || 'Erro ao buscar dados do prontuário. Tente novamente mais tarde.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProntuario();
  }, [id]);
  
  // CORRIGIDO: Mapeia o prontuário "achatado" para o formato aninhado que o ProntuarioForm espera
  const mapProntuarioToFormData = (prontuarioData: Prontuario): NovoProntuarioRequest => {
    return {
      paciente: {
        nome: prontuarioData.nomePaciente, // Mapeia do campo 'achatado'
        // ATENÇÃO: Os campos abaixo não são fornecidos pelo backend na entidade Prontuario.
        // Eles serão preenchidos com valores vazios/padrão.
        // Para preenchê-los corretamente, o backend precisaria ser ajustado.
        dataNascimento: '', 
        cpf: '',
        genero: Genero.NAO_INFORMADO,
        telefone: '',
        email: '',
        endereco: {
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          estado: '',
          cep: '',
        }
      },
      tipoTratamento: prontuarioData.tipoTratamento as any, // Converte a string para o tipo enum
      historicoMedico: {
        // Mapeia a string 'historicoMedico' do backend para o objeto esperado pelo formulário
        descricao: prontuarioData.historicoMedico || "Sem histórico médico registrado"
      }
    };
  };
  
  // CORRIGIDO: Transforma os dados do formulário de volta para o formato "achatado" antes de enviar
  const handleUpdateProntuario = async (formDataFromForm: NovoProntuarioRequest) => {
    if (!id || !prontuario) return;
    
    setIsSaving(true);
    setError(null);

    // Transforma para o formato do ProntuarioDTO do backend
    const dadosParaBackend: ProntuarioDataForBackend = {
        nomePaciente: formDataFromForm.paciente.nome,
        tipoTratamento: formDataFromForm.tipoTratamento,
        historicoMedico: formDataFromForm.historicoMedico.descricao,
        numeroProntuario: prontuario.numeroProntuario, // Usa o número do prontuário original
        // Você pode mapear os outros campos do formulário para os campos do DTO aqui se eles existirem
        medicamentos: prontuario.medicamentos,
        exames: prontuario.exames,
        condicoesClinicas: prontuario.condicoesClinicas,
    };
    
    try {
      // O service 'atualizarProntuario' espera Partial<NovoProntuarioRequest>, mas vamos enviar o formato correto
      await atualizarProntuario(id, dadosParaBackend as any);
      // Redireciona para a página de detalhes após salvar
      navigate(`/prontuarios/${id}`); 
    } catch (error: any) {
      console.error('Erro ao atualizar prontuário:', error);
      setError(
        error.response?.data?.message || 'Erro ao atualizar prontuário. Tente novamente mais tarde.'
      );
    } finally {
        setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container-medium">
        <div className="text-center py-12">
            {/* Skeleton Loading UI */}
        </div>
      </div>
    );
  }
  
  if (error && !prontuario) {
    return (
      <div className="container-medium">
        <Alert type="error" title="Erro ao carregar prontuário" message={error} />
        {/* ... botão de voltar ... */}
      </div>
    );
  }
  
  if (!prontuario) {
    return (
      <div className="container-medium">
        <Alert type="warning" title="Prontuário não encontrado" message="O prontuário solicitado não foi encontrado." />
        {/* ... botão de voltar ... */}
      </div>
    );
  }
  
  return (
    <div className="container-medium">
      <div className="flex items-center mb-6">
        <Link to={`/prontuarios/${id}`} className="text-neutral-500 hover:text-neutral-700 mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900">
          Editar Prontuário #{prontuario.numeroProntuario}
        </h1>
      </div>
      
      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
          onClose={() => setError(null)}
        />
      )}
      
      <div className="card">
        <ProntuarioForm
          onSubmit={handleUpdateProntuario}
          initialData={mapProntuarioToFormData(prontuario)} // Usa a função de mapeamento corrigida
          isLoading={isSaving}
        />
      </div>
    </div>
  );
};

export default ProntuarioEditPage;