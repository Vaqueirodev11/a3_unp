// Arquivo: src/components/prontuario/ProntuarioTable.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye, Edit, FileText } from 'lucide-react';
import Button from '../ui/Button';
import { Prontuario, StatusProntuario, TipoTratamento } from '../../types/prontuario';

interface ProntuarioTableProps {
  prontuarios: Prontuario[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const ProntuarioTable: React.FC<ProntuarioTableProps> = ({
  prontuarios,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  isLoading = false,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const formatData = (dataString: string) => {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  const renderTipoTratamento = (tipo: string) => { // Alterado para aceitar string
    const tipos: { [key: string]: string } = { // Chave do tipo string
      [TipoTratamento.TERAPIA_INDIVIDUAL]: 'Terapia Individual',
      [TipoTratamento.TERAPIA_CASAL]: 'Terapia de Casal',
      [TipoTratamento.TERAPIA_GRUPO]: 'Terapia de Grupo',
      [TipoTratamento.TERAPIA_FAMILIAR]: 'Terapia Familiar',
      [TipoTratamento.OUTRO]: 'Outro',
    };
    return tipos[tipo] || tipo;
  };

  // Esta função não pode mais ser usada como antes, pois 'status' não existe no objeto Prontuario do backend.
  // A coluna foi removida da tabela.
  /*
  const renderStatus = (status: StatusProntuario) => {
    const statusClasses = {
      [StatusProntuario.ATIVO]: 'bg-success-100 text-success-800',
      [StatusProntuario.INATIVO]: 'bg-neutral-100 text-neutral-800',
      [StatusProntuario.ARQUIVADO]: 'bg-warning-100 text-warning-800',
    };
    const statusLabels = {
      [StatusProntuario.ATIVO]: 'Ativo',
      [StatusProntuario.INATIVO]: 'Inativo',
      [StatusProntuario.ARQUIVADO]: 'Arquivado',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };
  */

  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Prontuário
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Paciente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Início
              </th>
              {/* REMOVIDA: Coluna Status */}
              {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Status
              </th> */}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-neutral-500">
                  Carregando prontuários...
                </td>
              </tr>
            ) : prontuarios.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-neutral-500">
                  Nenhum prontuário encontrado
                </td>
              </tr>
            ) : (
              prontuarios.map((prontuario) => (
                <tr key={prontuario.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-neutral-400 mr-2" />
                      <span className="text-neutral-900 font-medium">
                        {prontuario.numeroProntuario}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* ALTERAÇÃO AQUI: Acessando 'nomePaciente' diretamente */}
                    <div className="text-sm text-neutral-900">{prontuario.nomePaciente}</div>
                    {/* REMOVIDO: O CPF não está disponível no objeto Prontuario vindo do backend */}
                    {/* <div className="text-xs text-neutral-500">CPF: {prontuario.paciente.cpf}</div> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    {renderTipoTratamento(prontuario.tipoTratamento)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    {/* Usando 'dataCriacao' que vem do backend, pois 'dataInicio' não existe */}
                    {formatData(prontuario.dataCriacao)} 
                  </td>
                  {/* REMOVIDA: Célula do Status */}
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatus(prontuario.status)}
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/prontuarios/${prontuario.id}`}>
                        <Button variant="secondary" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                          Ver
                        </Button>
                      </Link>
                      <Link to={`/prontuarios/${prontuario.id}/editar`}>
                        <Button variant="primary" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
                          Editar
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* A seção de paginação permanece, mas sua utilidade dependerá da implementação no backend */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-neutral-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-700">
                Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalItems)}
                </span>{' '}
                de <span className="font-medium">{totalItems}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paginação">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-neutral-300 text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span className="sr-only">Próxima</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProntuarioTable;