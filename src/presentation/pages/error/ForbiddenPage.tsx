import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Button from '../../components/ui/Button';

const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <ShieldAlert className="h-16 w-16 text-red-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Acesso Negado</h1>
        <p className="text-lg text-neutral-600 mb-8">
          Desculpe, você não tem permissão para acessar esta página ou recurso.
        </p>
        <Link to="/">
          <Button
            variant="primary"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;
