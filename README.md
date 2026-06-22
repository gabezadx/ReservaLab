## ReservaLab Professor

## Sobre o Projeto

O ReservaLab Professor é um sistema web desenvolvido para gerenciar reservas de laboratórios acadêmicos. O sistema permite que professores realizem solicitações de reserva para suas aulas, enquanto a coordenação ou administração gerencia os cadastros e aprova as solicitações.

## Objetivo

Facilitar o processo de agendamento de laboratórios, evitando conflitos de horário e centralizando o gerenciamento das reservas.


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



# Relatório Parcial

## Controles Implementados

- Autenticação de usuários.
- Controle de acesso por perfil.
- Três perfis de acesso (Professor, Coordenação e Administrador).
- Senhas armazenadas com hash utilizando bcrypt.
- Persistência de dados em banco MySQL.
- Logs de auditoria.
- Controle de autorização por perfil e por dono do recurso.

## Evidências

- Login funcional com validação de credenciais.
- Bloqueio de acesso para usuários sem permissão.
- Registro de ações na tabela de auditoria.
- Reservas armazenadas no banco de dados.

## Riscos Identificados

- Ambiente executado localmente sem HTTPS.
- Chave JWT simplificada para ambiente acadêmico.
- Ausência de autenticação multifator.
- Dependência de um único banco de dados.

## Limitações

- Não possui recuperação de senha.
- Não possui autenticação em dois fatores.
- Não possui integração com sistemas institucionais.
- Não possui alta disponibilidade.


# Plano Inicial de Backup e Restauração

## Estratégia de Backup

O banco de dados deverá possuir backup diário utilizando a ferramenta mysqldump.

Exemplo:

mysqldump -u root -p reservalab > backup_reservalab.sql

## Armazenamento

Os backups poderão ser armazenados:
- Em diretório local.
- Em dispositivo externo.
- Em armazenamento em nuvem.

## Processo de Restauração

Exemplo:

mysql -u root -p reservalab < backup_reservalab.sql

## Testes de Recuperação

- Verificar a integridade dos backups.
- Realizar testes periódicos de restauração.

## Responsáveis

- Administrador do sistema.
- Equipe de desenvolvimento.

## Observação

Este plano foi elaborado para fins acadêmicos e poderá ser expandido em versões futuras.
