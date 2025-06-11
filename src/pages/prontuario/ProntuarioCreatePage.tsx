// Arquivo: src/pages/prontuario/ProntuarioCreatePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProntuarioForm from '../../components/prontuario/ProntuarioForm';
import Alert from '../../components/ui/Alert';
import { criarProntuario } from '../../services/prontuarioService';
import { NovoProntuarioRequest, Prontuario as ProntuarioType } from '../../types/prontuario';

// Interface para o payload que será enviado à API, alinhado com ProntuarioDTO.java
interface CriarProntuarioPayload {
  paciente: NovoProntuarioRequest['paciente']; // Reutiliza o tipo aninhado de paciente
  tipoTratamento: NovoProntuarioRequest['tipoTratamento'];
  historicoMedico: string; // O backend espera uma string simples
  numeroProntuario: string;
  medicamentos?: string;
  exames?: string;
  condicoesClinicas?: string;
}

const ProntuarioCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A função agora pega os dados do formulário e os ajusta minimamente para o backend
  const handleCreateProntuario = async (formDataFromForm: NovoProntuarioRequest) => {
    setIsLoading(true);
    setError(null);

    // Transforma os dados do formulário para o formato exato esperado pelo ProntuarioDTO do backend
    const dadosParaBackend: CriarProntuarioPayload = {
      // O objeto 'paciente' aninhado agora é enviado diretamente, como o backend espera
      paciente: formDataFromForm.paciente,
      tipoTratamento: formDataFromForm.tipoTratamento,
      // O backend espera 'historicoMedico' como uma string, não um objeto
      historicoMedico: formDataFromForm.historicoMedico.descricao,
      
      // Adiciona o 'numeroProntuario' que é obrigatório no backend
      // Substitua esta linha pela sua lógica real de geração de número
      numeroProntuario: `PRONT-${Date.now()}`,

      // Campos opcionais podem ser adicionados aqui se o formulário os incluir
      medicamentos: "",
      exames: "",
      condicoesClinicas: ""
    };

    console.log("Dados enviados para o backend:", dadosParaBackend);

    try {
      // A função criarProntuario no service precisa aceitar o tipo CriarProntuarioPayload
      const novoProntuario: ProntuarioType = await criarProntuario(dadosParaBackend);
      
      console.log("Prontuário criado com sucesso:", novoProntuario);
      
      if (novoProntuario && novoProntuario.id) {
        console.log(`Redirecionando para /prontuarios/${novoProntuario.id}`);
        navigate(`/prontuarios/${novoProntuario.id}`);
      } else {
        setError("Prontuário criado, mas não foi possível obter o ID para redirecionar.");
        console.error("Resposta da API após criação não continha um ID válido:", novoProntuario);
      }
    } catch (error: any) {
      console.error('Erro ao criar prontuário:', error.response?.data || error.message);
      let errorMessage = 'Ocorreu um erro desconhecido.';
      if (error.response?.data) {
        // Lida com mensagens de erro de validação do backend
        const data = error.response.data;
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (typeof data === 'object') {
          // Concatena todos os erros de validação em uma única string
          errorMessage = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-medium">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Novo Prontuário</h1>

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
          onSubmit={handleCreateProntuario}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProntuarioCreatePage;