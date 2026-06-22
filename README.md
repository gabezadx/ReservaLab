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


### Como executar o backend

```bash
cd backend
npm install
npm run seed
npm start
```

Antes de executar, importe o arquivo `banco.sql` no MySQL e configure o arquivo `.env`.


## Usuários de teste

| Perfil | E-mail | Senha |
|-----------|--------------------------|--------|
| Professor | professor@reservalab.com | 123456 |
| Coordenação | coordenacao@reservalab.com | 123456 |
| Administrador | admin@reservalab.com | 123456 |

## Perfis de acesso

### Professor

- Pode criar reserva de laboratório.
- Pode visualizar suas próprias reservas.
- Pode cancelar suas próprias reservas.
- Não pode aprovar, recusar ou visualizar todas as reservas.

### Coordenação

- Pode visualizar todas as reservas.
- Pode aprovar reservas.
- Pode recusar reservas.
- Pode cancelar reservas.
- Pode visualizar logs de auditoria.
- Não aparece como responsável por reserva de aula.

### Administrador

- Pode visualizar todas as reservas.
- Pode aprovar, recusar ou cancelar reservas.
- Pode gerenciar cadastros do sistema.
- Pode visualizar logs de auditoria.
- Não aparece como responsável por reserva de aula.


## AppSec / Segurança da Aplicação

O projeto possui uma base de segurança de aplicação compatível com a proposta acadêmica:

- Login obrigatório antes de acessar o sistema.
- Separação de permissões por perfil.
- Senhas não ficam armazenadas em texto puro; são salvas como hash SHA-256.
- O professor só pode cancelar reservas criadas por ele mesmo.
- Professor não consegue acessar a área administrativa.
- Administrador e coordenação não conseguem criar reserva como responsáveis por aula.
- Tentativas de acesso sem permissão são bloqueadas e registradas em auditoria.
- Os dados do sistema ficam persistidos no navegador através de `localStorage`.
