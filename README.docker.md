# Docker Setup for HM Psicoterapia EMR

Este documento contém instruções para executar o projeto HM Psicoterapia EMR usando Docker.

## Requisitos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Estrutura de Arquivos Docker

- `Dockerfile.frontend`: Configuração para construir a imagem Docker do frontend
- `back-end/Dockerfile`: Configuração para construir a imagem Docker do backend
- `docker-compose.yml`: Configuração para orquestrar todos os serviços
- `nginx.conf`: Configuração do Nginx para o frontend
- `.env.docker`: Variáveis de ambiente para o frontend no Docker
- `back-end/src/main/resources/application-docker.properties`: Configuração do Spring Boot para o ambiente Docker

## Como Executar

1. Certifique-se de que o Docker e o Docker Compose estão instalados e em execução no seu sistema.

2. Na raiz do projeto, execute o seguinte comando para construir e iniciar todos os serviços:

   ```bash
   docker-compose up -d
   ```

   Este comando irá:
   - Construir as imagens do frontend e backend
   - Iniciar um container PostgreSQL
   - Iniciar os serviços de frontend e backend
   - Configurar a rede entre os serviços

3. Após a inicialização (pode levar alguns minutos na primeira vez), acesse:
   - Frontend: http://localhost
   - Backend API: http://localhost:8080/api
   - Banco de dados PostgreSQL: localhost:5433 (acessível via ferramentas como pgAdmin ou DBeaver)

## Parando os Serviços

Para parar todos os serviços, execute:

```bash
docker-compose down
```

Para parar e remover volumes (isso apagará os dados do banco de dados), execute:

```bash
docker-compose down -v
```

## Reconstruindo as Imagens

Se você fizer alterações no código e precisar reconstruir as imagens, execute:

```bash
docker-compose up -d --build
```

## Visualizando Logs

Para ver os logs de todos os serviços:

```bash
docker-compose logs -f
```

Para ver os logs de um serviço específico:

```bash
docker-compose logs -f [service_name]
```

Onde `[service_name]` pode ser `frontend`, `backend` ou `postgres`.

## Solução de Problemas

### Configuração da API URL

O frontend está configurado para acessar o backend através do caminho relativo `/api`. Isso é definido no arquivo `.env.docker` que é copiado para `.env` durante o build da imagem do frontend.

Se você estiver enfrentando problemas de conexão entre o frontend e o backend, verifique:

1. O arquivo `.env.docker` deve conter:
   ```
   VITE_API_URL=/api
   ```

2. O arquivo `docker-compose.yml` não deve sobrescrever esta variável de ambiente.

3. O arquivo `nginx.conf` deve estar configurado para fazer proxy das requisições para `/api` para o serviço backend:
   ```
   location /api/ {
       proxy_pass http://backend:8080/api/;
       ...
   }
   ```

### Problema com Anotações de Prontuário

Se as anotações de prontuário não estiverem sendo exibidas corretamente, verifique o arquivo `src/pages/prontuario/ProntuarioDetailPage.tsx`. As anotações são armazenadas no campo `condicoesClinicas` do prontuário, e o componente deve estar configurado para exibir esse campo na aba de anotações:

```tsx
{activeTab === 'anotacoes' && renderContentAsString("Anotações", prontuario.condicoesClinicas, <MessageSquare className="h-12 w-12 text-neutral-400 mx-auto mb-4" />)}
```

Se estiver usando `undefined` em vez de `prontuario.condicoesClinicas`, as anotações não serão exibidas mesmo que tenham sido salvas corretamente.

### Problema com CPF Aleatório no Formulário de Criação de Prontuário

Se o campo CPF estiver sendo preenchido automaticamente com caracteres aleatórios ao criar um novo prontuário, verifique o arquivo `src/components/prontuario/ProntuarioForm.tsx`. O campo CPF deve estar vazio por padrão:

```tsx
defaultValues: initialData || {
  paciente: {
    nome: '', dataNascimento: '', cpf: '', genero: Genero.NAO_INFORMADO,
    // ...
  },
  // ...
},
```

Se estiver usando uma função como `gerarCPFAleatorio()` para preencher o campo CPF, remova essa função para que o campo fique vazio por padrão.

### Banco de Dados

Se você estiver tendo problemas com o banco de dados, pode resetá-lo removendo o volume:

```bash
docker-compose down -v
docker-compose up -d
```

### Portas em Uso

Se alguma porta já estiver em uso (80, 8080, 5432), você pode modificar o arquivo `docker-compose.yml` para usar portas diferentes.

### Permissões

Em sistemas Linux, pode haver problemas de permissão com volumes. Nesse caso, execute os comandos com `sudo`.
