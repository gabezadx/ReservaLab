## ReservaLab Professor

## Sobre o Projeto

O ReservaLab Professor é um sistema web desenvolvido para gerenciar reservas de laboratórios acadêmicos. O sistema permite que professores realizem solicitações de reserva para suas aulas, enquanto a coordenação ou administração gerencia os cadastros e aprova as solicitações.

## Objetivo

Facilitar o processo de agendamento de laboratórios, evitando conflitos de horário e centralizando o gerenciamento das reservas.


## Como Executar o Projeto

### 1. Clonar o Repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

### 2. Configurar o Banco de Dados

Inicie o MySQL pelo XAMPP.

Criar o banco:

```sql
CREATE DATABASE reservalab;
```

Importar o arquivo:

```text
reservalab.sql
```

Verificar se as tabelas foram criadas:

* usuarios
* laboratorios
* reservas
* auditoria

### 3. Configurar Variáveis de Ambiente

Copie o arquivo:

```text
backend/.env.example
```

para:

```text
backend/.env
```

Exemplo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=reservalab
PORT=3000
JWT_SECRET=reservalab_secret
```

### 4. Instalar Dependências

Na pasta raiz do projeto:

```bash
npm install
```

### 5. Iniciar o Sistema

```bash
npm start
```

O servidor será iniciado em:

```text
http://localhost:3000
```

### 6. Usuários de Teste

#### Professor

* Perfil: Professor

#### Coordenação

* Perfil: Coordenação

#### Administrador

* Perfil: Administrador

### Funcionalidades Implementadas

* Login de usuários
* Controle de acesso por perfil
* Cadastro de laboratórios
* Cadastro de reservas
* Aprovação e cancelamento de reservas
* Registro de auditoria
* Persistência em banco de dados MySQL
* Senhas armazenadas com hash bcrypt



## Funcionalidades


## Professor

- Realizar reservas de laboratórios.
- Visualizar suas reservas.
- Cancelar reservas próprias.
- Consultar calendário de reservas.

## Administrador

- Cadastrar professores.
- Cadastrar laboratórios.
- Cadastrar turmas.
- Visualizar todas as reservas.
- Aprovar, recusar ou cancelar reservas.

## Regras de Negócio

- Apenas professores podem criar reservas.
- O sistema verifica automaticamente conflitos de horário.
- Uma reserva pode estar nos estados:

- Pendente
- Aprovada
- Recusada
- Cancelada

## Arquitetura

O sistema será dividido em:

- Front-end: interface para professores e administradores.
- Back-end: regras de negócio e autenticação.
- Banco de dados: armazenamento das informações.

## Modelo de Dados

Entidades principais:

- Usuário
- Professor
- Laboratório
- Turma
- Disciplina
- Reserva

## Tecnologias Utilizadas

- HTML
- CSS
- JavaScript
- MySQL
- Node.js/Express

## Requisitos Atendidos

✅ Autenticação de usuários

✅ Três perfis de acesso

✅ Banco de dados persistente

✅ Senhas com hash (bcrypt)

✅ Controle de autorização

✅ Ações bloqueadas por permissão

✅ Logs de auditoria

✅ Relatório parcial de segurança

✅ Plano inicial de backup e restauração


