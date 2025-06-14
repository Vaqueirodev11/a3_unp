// Arquivo: src/pages/prontuario/ProntuarioListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import ProntuarioSearchForm from '../../components/prontuario/ProntuarioSearchForm';
import ProntuarioTable from '../../components/prontuario/ProntuarioTable';
import { buscarProntuarios } from '../../services/prontuarioService';
// Remova ResultadoBusca se não for mais necessário aqui, ou mantenha se usar para outros tipos
import { BuscaProntuarioParams, Prontuario /*, ResultadoBusca */ } from '../../types/prontuario';

const ProntuarioListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<BuscaProntuarioParams>({
    pagina: 0, // O backend não usa paginação atualmente, mas mantemos para consistência futura
    tamanho: 10, // O backend não usa paginação atualmente
  });

  // Alterado para esperar um array de Prontuario ou null
  const [listaDeProntuarios, setListaDeProntuarios] = useState<Prontuario[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar prontuários quando a página carregar ou quando os parâmetros de busca mudarem
  useEffect(() => {
    const fetchProntuarios = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // buscarProntuarios agora retorna Promise<Prontuario[]>
        const result: Prontuario[] = await buscarProntuarios(searchParams);
        setListaDeProntuarios(result);
        // Adicione este console.log para verificar os dados recebidos:
        console.log("Dados recebidos da API de prontuários:", result);
      } catch (error: any) {
        console.error('Erro ao buscar prontuários:', error);
        setError(
          error.response?.data?.message || 'Erro ao buscar prontuários. Tente novamente mais tarde.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProntuarios();
  }, [searchParams]);

  // Manipula a busca de prontuários
  const handleSearch = (formData: any) => {
    setSearchParams({
      ...searchParams,
      pagina: 0, // Reset para a primeira página (relevante se o backend implementar paginação)
      termo: formData.termo || undefined,
      numeroProntuario: formData.numeroProntuario || undefined,
      tipoTratamento: formData.tipoTratamento || undefined,
      status: formData.status || undefined,
    });
  };

  // Manipula a mudança de página
  const handlePageChange = (page: number) => {
    // Esta função só terá efeito real na busca de dados se o backend implementar paginação
    // e usar o parâmetro 'pagina'.
    setSearchParams({
      ...searchParams,
      pagina: page - 1, // API espera paginação base 0
    });
  };

  return (
    <div className="container-wide">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4 md:mb-0">Prontuários</h1>
        <Link to="/prontuarios/novo">
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Novo Prontuário
          </Button>
        </Link>
      </div>

      <ProntuarioSearchForm onSearch={handleSearch} isLoading={isLoading} />

      {error && (
        <Alert
          type="error"
          message={error}
          className="mb-6"
          onClose={() => setError(null)}
        />
      )}

      <ProntuarioTable
        prontuarios={listaDeProntuarios || []} // Passa a lista diretamente
        // totalItems é o tamanho da lista atual, já que o backend não está paginando
        totalItems={listaDeProntuarios?.length || 0}
        // Se o backend não pagina, currentPage e pageSize aqui são mais para a UI da tabela,
        // não para buscar fatias diferentes do backend.
        currentPage={(searchParams.pagina || 0) + 1}
        pageSize={searchParams.tamanho}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProntuarioListPage;