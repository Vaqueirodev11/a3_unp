# HM Psicoterapia

Sistema de gerenciamento para clínicas de psicoterapia, oferecendo funcionalidades para administração de pacientes, prontuários médicos e agendamentos.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Docker](#docker)
- [API](#api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Testes](#testes)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)

## 🔍 Visão Geral

HM Psicoterapia é uma aplicação web completa para gerenciamento de clínicas de psicoterapia. O sistema permite o cadastro e acompanhamento de pacientes, gerenciamento de prontuários médicos, histórico de tratamentos, medicações, exames e agendamento de consultas.

A aplicação foi desenvolvida seguindo os princípios de Clean Architecture e SOLID, garantindo um código modular, testável e de fácil manutenção.

## 🏗️ Arquitetura

O projeto segue a arquitetura Clean Architecture, dividida em camadas com responsabilidades bem definidas:

### Frontend (React/TypeScript)
```
src/
├── domain/                  # Regras de negócio e entidades
│   ├── entities/            # Interfaces e tipos de domínio
│   ├── repositories/        # Interfaces de repositório
│   └── usecases/            # Regras de negócio específicas
├── application/             # Lógica de aplicação
│   ├── services/            # Serviços que implementam casos de uso
│   └── state/               # Gerenciamento de estado (contexts)
├── infrastructure/          # Implementações externas
│   ├── api/                 # Adaptadores de API
│   └── http/                # Cliente HTTP
└── presentation/            # Interface do usuário
    ├── components/          # Componentes reutilizáveis
    ├── layouts/             # Layouts de página
    ├── pages/               # Páginas da aplicação
    ├── hooks/               # Hooks personalizados
    └── routes/              # Configuração de rotas
```

### Backend (Java Spring Boot)
```
back-end/src/main/java/com/hmpsicoterapia/
├── domain/                  # Regras de negócio e entidades
│   ├── entities/            # Entidades de domínio
│   ├── repositories/        # Interfaces de repositório
│   └── services/            # Interfaces de serviço
├── application/             # Lógica de aplicação
│   ├── dtos/                # Objetos de transferência de dados
│   └── usecases/            # Implementações de casos de uso
├── infrastructure/          # Implementações externas
│   ├── config/              # Configurações
│   ├── persistence/         # Implementações de repositório
│   └── security/            # Configuração de segurança
└── presentation/            # Interface com o usuário
    ├── controllers/         # Controladores REST
    └── exceptions/          # Tratamento de exceções
```

## 🛠️ Tecnologias

### Frontend
- **React**: Biblioteca JavaScript para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Vite**: Ferramenta de build rápida
- **Tailwind CSS**: Framework CSS utilitário
- **React Router**: Roteamento para React
- **Axios**: Cliente HTTP baseado em Promises

### Backend
- **Java**: Linguagem de programação
- **Spring Boot**: Framework para desenvolvimento de aplicações Java
- **Spring Security**: Segurança e autenticação
- **Spring Data JPA**: Persistência de dados
- **JWT**: Autenticação baseada em tokens
- **PostgreSQL**: Banco de dados relacional

### DevOps
- **Docker**: Containerização da aplicação
- **Docker Compose**: Orquestração de containers
- **Nginx**: Servidor web para o frontend

## ✨ Funcionalidades

### Gestão de Pacientes
- Cadastro completo de pacientes
- Histórico de atendimentos
- Dados de contato e informações pessoais

### Prontuários Médicos
- Criação e edição de prontuários
- Registro de histórico médico
- Acompanhamento de medicações
- Registro de exames
- Anotações de consultas

### Tratamentos
- Registro de tipos de tratamento
- Acompanhamento de status do tratamento
- Histórico de evolução

### Autenticação e Segurança
- Login seguro
- Autenticação baseada em JWT
- Controle de acesso baseado em perfis
- Recuperação de senha

## 📋 Pré-requisitos

### Desenvolvimento Local
#### Frontend
- Node.js (v14+)
- npm ou yarn

#### Backend
- Java JDK 11+
- Maven
- PostgreSQL

### Usando Docker
- Docker
- Docker Compose

## 🚀 Instalação

### Clonando o Repositório
```bash
git clone https://github.com/seu-usuario/hmpsicoterapia.git
cd hmpsicoterapia
```

### Instalação para Desenvolvimento Local

#### Frontend
```bash
cd front-end
npm install
```

#### Backend
```bash
cd back-end
mvn clean install
```

### Instalação com Docker
```bash
# Na raiz do projeto
docker-compose up -d
```
Isso irá construir e iniciar todos os serviços necessários (frontend, backend e banco de dados).

## ⚙️ Configuração

### Frontend
Crie um arquivo `.env` na raiz do diretório `front-end` com as seguintes variáveis:

```
VITE_API_URL=http://localhost:8080/api
```

### Backend
Configure o arquivo `application.properties` em `back-end/src/main/resources/`:

```properties
# Banco de Dados
spring.datasource.url=jdbc:postgresql://localhost:5432/hmpsicoterapia
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update

# JWT
jwt.secret=seu_segredo_jwt
jwt.expiration=86400000

# Email (para recuperação de senha)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu_email@gmail.com
spring.mail.password=sua_senha_de_app
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

## 🖥️ Uso

### Desenvolvimento Local

#### Iniciando o Backend
```bash
cd back-end
mvn spring-boot:run
```

O servidor estará disponível em `http://localhost:8080`.

#### Iniciando o Frontend
```bash
cd front-end
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### Usando Docker
Após executar `docker-compose up -d`, a aplicação estará disponível em:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080/api
- **Banco de dados PostgreSQL**: localhost:5433 (acessível via ferramentas como pgAdmin ou DBeaver)

### Acesso Inicial
- **URL**: http://localhost:5173 (desenvolvimento local) ou http://localhost (Docker)
- **Usuário Admin**: admin@hmpsicoterapia.com
- **Senha**: admin123

Recomendamos alterar a senha após o primeiro acesso.

## 🐳 Docker

O projeto está configurado para ser executado em containers Docker, facilitando a implantação e garantindo consistência entre ambientes.

### Arquivos de Configuração Docker
- `docker-compose.yml`: Orquestração dos serviços (frontend, backend, banco de dados)
- `Dockerfile.frontend`: Configuração para construir a imagem Docker do frontend
- `back-end/Dockerfile`: Configuração para construir a imagem Docker do backend
- `nginx.conf`: Configuração do Nginx para o frontend
- `.env.docker`: Variáveis de ambiente para o frontend no Docker
- `back-end/src/main/resources/application-docker.properties`: Configuração do Spring Boot para o ambiente Docker

### Comandos Úteis

#### Iniciar todos os serviços
```bash
docker-compose up -d
```

#### Parar todos os serviços
```bash
docker-compose down
```

#### Reconstruir as imagens após alterações no código
```bash
docker-compose up -d --build
```

#### Visualizar logs
```bash
docker-compose logs -f
```

Para mais detalhes sobre a configuração Docker, consulte o arquivo [README.docker.md](README.docker.md).

### Correções Recentes

#### Visualização de Anotações
Foi corrigido um problema onde as anotações de prontuário não estavam sendo exibidas corretamente. As anotações são armazenadas no campo `condicoesClinicas` do prontuário, e o componente agora está configurado para exibir esse campo na aba de anotações.

#### CPF Aleatório no Formulário de Criação
Foi corrigido um problema onde o campo CPF estava sendo preenchido automaticamente com caracteres aleatórios ao criar um novo prontuário. O campo CPF agora inicia vazio por padrão, permitindo que o usuário insira o CPF manualmente.

## 📡 API

A API REST do backend está disponível em `http://localhost:8080/api` (desenvolvimento local) ou `http://localhost/api` (Docker).

### Endpoints Principais

#### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de novo administrador
- `POST /api/auth/reset-password` - Solicitar redefinição de senha

#### Prontuários
- `GET /api/prontuarios` - Listar todos os prontuários
- `GET /api/prontuarios/{id}` - Obter prontuário específico
- `POST /api/prontuarios` - Criar novo prontuário
- `PUT /api/prontuarios/{id}` - Atualizar prontuário
- `DELETE /api/prontuarios/{id}` - Excluir prontuário

#### Pacientes
- `GET /api/pacientes` - Listar todos os pacientes
- `GET /api/pacientes/{id}` - Obter paciente específico
- `POST /api/pacientes` - Criar novo paciente
- `PUT /api/pacientes/{id}` - Atualizar paciente
- `DELETE /api/pacientes/{id}` - Excluir paciente

Para documentação completa da API, acesse `http://localhost:8080/swagger-ui.html` após iniciar o backend.

## 📂 Estrutura do Projeto

### Diretórios Principais

#### Frontend
- `src/domain/entities`: Definições de tipos e interfaces
- `src/application/services`: Serviços para comunicação com a API
- `src/application/state`: Gerenciamento de estado global
- `src/presentation/components`: Componentes React reutilizáveis
- `src/presentation/pages`: Páginas da aplicação
- `public`: Arquivos estáticos

#### Backend
- `src/main/java/com/hmpsicoterapia/domain/entities`: Entidades JPA
- `src/main/java/com/hmpsicoterapia/application/usecases`: Serviços de negócio
- `src/main/java/com/hmpsicoterapia/presentation/controllers`: Controladores REST
- `src/main/resources`: Configurações e recursos

## 🧪 Testes

### Frontend
```bash
cd front-end
npm test
```

### Backend
```bash
cd back-end
mvn test
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código

- Siga os princípios SOLID e Clean Architecture
- Mantenha a cobertura de testes
- Documente novas funcionalidades
- Siga o estilo de código do projeto

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes.
