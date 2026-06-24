## ReservaLab Professor

## Sobre o Projeto

O ReservaLab Professor é um sistema web desenvolvido para gerenciar reservas de laboratórios acadêmicos. O sistema permite que professores realizem solicitações de reserva para suas aulas, enquanto a coordenação ou administração gerencia os cadastros e aprova as solicitações.

## Objetivo

Facilitar o processo de agendamento de laboratórios, evitando conflitos de horário e centralizando o gerenciamento das reservas.


## Como executar localmente

1. Baixe ou clone o projeto.
2. Abra a pasta do projeto no VS Code.
3. Abra o arquivo `index.html` no navegador.
4. Faça login com um dos usuários de teste.

Também é possível usar a extensão **Live Server** do VS Code.


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


