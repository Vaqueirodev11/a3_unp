// Arquivo: src/components/prontuario/ProntuarioForm.tsx
import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Genero, TipoTratamento, NovoProntuarioRequest } from '../../types/prontuario';
import { ChevronRight, ChevronLeft, Save, User, Phone, Mail, MapPin, Calendar } from 'lucide-react';

// Validador de CPF (função auxiliar com lógica restaurada)
const validarCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
};

// Gerador de CPF aleatório para testes
const gerarCPFAleatorio = () => {
  const num1 = Math.floor(Math.random() * 999);
  const num2 = Math.floor(Math.random() * 999);
  const num3 = Math.floor(Math.random() * 99);
  
  let cpf = `${num1.toString().padStart(3, '0')}${num2.toString().padStart(3, '0')}${num3.toString().padStart(2, '0')}`;
  
  // Calcula o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  const dv1 = resto === 10 || resto === 11 ? 0 : resto;
  
  // Adiciona o primeiro dígito verificador
  cpf += dv1;
  
  // Calcula o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  const dv2 = resto === 10 || resto === 11 ? 0 : resto;
  
  // Adiciona o segundo dígito verificador
  cpf += dv2;
  
  return cpf;
};

// Validador de telefone (função auxiliar com lógica restaurada)
const validarTelefone = (telefone: string) => {
  return /^\d{10,11}$/.test(telefone.replace(/[^\d]/g, ''));
};

// Validador de CEP (função auxiliar com lógica restaurada)
const validarCEP = (cep: string) => {
  return /^\d{8}$/.test(cep.replace(/[^\d]/g, ''));
};

// Schema de validação com Zod.
const prontuarioSchema = z.object({
  paciente: z.object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    dataNascimento: z.string().refine(val => val && !isNaN(Date.parse(val)), {
      message: 'Data de nascimento inválida',
    }),
    cpf: z.string().refine(validarCPF, { message: 'CPF inválido' }),
    genero: z.nativeEnum(Genero, { errorMap: () => ({ message: 'Selecione um gênero' }) }),
    telefone: z.string().refine(validarTelefone, { message: 'Telefone inválido (10 ou 11 dígitos)' }),
    email: z.string().email('Email inválido'),
    endereco: z.object({
      logradouro: z.string().min(3, 'Logradouro inválido'),
      numero: z.string().min(1, 'Número é obrigatório'),
      complemento: z.string().optional(),
      bairro: z.string().min(2, 'Bairro inválido'),
      cidade: z.string().min(2, 'Cidade inválida'),
      estado: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
      cep: z.string().refine(validarCEP, { message: 'CEP inválido (8 dígitos)' }),
    }),
  }),
  tipoTratamento: z.nativeEnum(TipoTratamento, { errorMap: () => ({ message: 'Selecione um tipo de tratamento' }) }),
  historicoMedico: z.object({
    descricao: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  }),
});

type ProntuarioFormData = z.infer<typeof prontuarioSchema>;

// --- Componentes das Etapas do Formulário ---

const DadosPacienteStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<ProntuarioFormData>();
  const generoOptions = [
    { value: Genero.MASCULINO, label: 'Masculino' },
    { value: Genero.FEMININO, label: 'Feminino' },
    { value: Genero.OUTRO, label: 'Outro' },
    { value: Genero.NAO_INFORMADO, label: 'Não informado' },
  ];
  
  return (
    <div className="animate-fade-in">
      <h3 className="mb-4 text-lg font-medium text-neutral-900">Dados do Paciente</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nome Completo" placeholder="Nome completo do paciente" leftAddon={<User className="h-5 w-5" />} {...register('paciente.nome')} error={errors.paciente?.nome?.message} required />
        <Input label="Data de Nascimento" type="date" leftAddon={<Calendar className="h-5 w-5" />} {...register('paciente.dataNascimento')} error={errors.paciente?.dataNascimento?.message} required />
        <Input label="CPF" placeholder="000.000.000-00" helperText="Digite apenas os números" {...register('paciente.cpf')} error={errors.paciente?.cpf?.message} required />
        <Select label="Gênero" options={generoOptions} {...register('paciente.genero')} error={errors.paciente?.genero?.message} required />
        <Input label="Telefone" placeholder="(00) 00000-0000" leftAddon={<Phone className="h-5 w-5" />} {...register('paciente.telefone')} error={errors.paciente?.telefone?.message} required />
        <Input label="Email" type="email" placeholder="email@exemplo.com" leftAddon={<Mail className="h-5 w-5" />} {...register('paciente.email')} error={errors.paciente?.email?.message} required />
      </div>
      <h4 className="mt-6 mb-4 text-base font-medium text-neutral-900">Endereço</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="CEP" placeholder="00000-000" helperText="Digite apenas os números" leftAddon={<MapPin className="h-5 w-5" />} {...register('paciente.endereco.cep')} error={errors.paciente?.endereco?.cep?.message} required />
        <Input label="Logradouro" placeholder="Rua, Avenida, etc." {...register('paciente.endereco.logradouro')} error={errors.paciente?.endereco?.logradouro?.message} required />
        <Input label="Número" placeholder="Número" {...register('paciente.endereco.numero')} error={errors.paciente?.endereco?.numero?.message} required />
        <Input label="Complemento" placeholder="Apartamento, bloco, etc." {...register('paciente.endereco.complemento')} error={errors.paciente?.endereco?.complemento?.message} />
        <Input label="Bairro" placeholder="Bairro" {...register('paciente.endereco.bairro')} error={errors.paciente?.endereco?.bairro?.message} required />
        <Input label="Cidade" placeholder="Cidade" {...register('paciente.endereco.cidade')} error={errors.paciente?.endereco?.cidade?.message} required />
        <Input label="Estado" placeholder="UF" maxLength={2} {...register('paciente.endereco.estado')} error={errors.paciente?.endereco?.estado?.message} required />
      </div>
    </div>
  );
};

const InformacoesTratamentoStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<ProntuarioFormData>();
  const tipoTratamentoOptions = [
    { value: TipoTratamento.TERAPIA_INDIVIDUAL, label: 'Terapia Individual' },
    { value: TipoTratamento.TERAPIA_CASAL, label: 'Terapia de Casal' },
    { value: TipoTratamento.TERAPIA_GRUPO, label: 'Terapia de Grupo' },
    { value: TipoTratamento.TERAPIA_FAMILIAR, label: 'Terapia Familiar' },
    { value: TipoTratamento.OUTRO, label: 'Outro' },
  ];
  
  return (
    <div className="animate-fade-in">
      <h3 className="mb-4 text-lg font-medium text-neutral-900">Informações de Tratamento</h3>
      <div className="grid grid-cols-1 gap-4">
        <Select label="Tipo de Tratamento" options={tipoTratamentoOptions} {...register('tipoTratamento')} error={errors.tipoTratamento?.message} required />
        <Textarea label="Histórico Médico Inicial" placeholder="Descreva o histórico médico inicial do paciente..." rows={6} {...register('historicoMedico.descricao')} error={errors.historicoMedico?.descricao?.message} required />
      </div>
    </div>
  );
};


// --- Componente Principal do Formulário ---

interface ProntuarioFormProps {
  onSubmit: (data: NovoProntuarioRequest) => void;
  initialData?: NovoProntuarioRequest;
  isLoading?: boolean;
}

const ProntuarioForm: React.FC<ProntuarioFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const methods = useForm<ProntuarioFormData>({
    resolver: zodResolver(prontuarioSchema),
    defaultValues: initialData || {
      paciente: {
        nome: '', dataNascimento: '', cpf: gerarCPFAleatorio(), genero: Genero.NAO_INFORMADO,
        telefone: '', email: '',
        endereco: {
          logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '',
        },
      },
      tipoTratamento: TipoTratamento.TERAPIA_INDIVIDUAL,
      historicoMedico: { descricao: '' },
    },
  });
  
  const steps = [
    { title: 'Dados do Paciente', component: <DadosPacienteStep /> },
    { title: 'Informações de Tratamento', component: <InformacoesTratamentoStep /> },
  ];
  
  const nextStep = async () => {
    // Validate all fields in the current step
    const isValid = currentStep === 0 
      ? await methods.trigger(['paciente']) 
      : await methods.trigger(['tipoTratamento', 'historicoMedico']);
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log("Validação falhou. Erros:", methods.formState.errors);
    }
  };
  
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleFormSubmit = methods.handleSubmit((data) => {
    const { endereco, nome, ...pacienteRest } = data.paciente;
    const paciente = { ...pacienteRest, ...endereco, nome };
    // Inclua nome_paciente no payload, pois o backend ainda espera este campo
    const payload = { 
      ...data, 
      paciente,
      nome_paciente: nome // Campo necessário para satisfazer a restrição not-null no banco de dados
    };
    // Use type assertion to handle the type mismatch
    onSubmit(payload as unknown as NovoProntuarioRequest);
  });
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit}>
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? 'bg-primary-600 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
                    {index + 1}
                  </div>
                  <span className={`mt-2 text-sm ${index <= currentStep ? 'text-primary-600 font-medium' : 'text-neutral-500'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && <div className={`flex-1 h-1 mx-4 ${index < currentStep ? 'bg-primary-600' : 'bg-neutral-200'}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
        
        {/* Conteúdo da Etapa Atual */}
        <div className="mb-8">
          {steps[currentStep].component}
        </div>
        
        {/* Botões de Navegação */}
        <div className="flex justify-between pt-4 border-t border-neutral-200">
          <Button type="button" variant="secondary" onClick={prevStep} disabled={currentStep === 0} leftIcon={<ChevronLeft className="h-4 w-4" />}>
            Anterior
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button type="button" variant="primary" onClick={nextStep} rightIcon={<ChevronRight className="h-4 w-4" />}>
              Próximo
            </Button>
          ) : (
            <Button type="submit" variant="success" isLoading={isLoading} leftIcon={<Save className="h-4 w-4" />}>
              Salvar Prontuário
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default ProntuarioForm;
