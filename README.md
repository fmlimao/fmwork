# FM Work

Este projeto vai ser a nova versão do FM Work, que é um sistema de gestão para pequenas empresas.

A ideia é ter um sistema pronto para poder usar com qualquer cliente (inquilino) e que possa ser usado em qualquer lugar. Ou seja, com apenas uma instalação, vários clientes podem usar o sistema.

Usaremos Node.js + Express + MySQL no backend. E no frontend vamos usar o bom e velho Bootstrap.

O sistema vai ser dividido em 3 partes:

1. Site para apresentar e vender o serviço.
2. Painel de controle para o cliente.
3. API para o cliente se comunicar com o sistema.

Abaixo vou listar as principais funcionalidades:

- Rate Limit para consumo da API
- Multi Idioma
- Controle de inquilinos
- Controle de acesso por privilégios
- Base se usuários compartilhada (pessoas podem ter acesso a vários inquilinos)
- Gerenciamento de arquivos usando Google Cloud Storage

E iniciaremos com os seguintes módulos:

- Tarefas
- Calendário
- Rondas de serviço

# Fases de desenvolvimento

### Legenda
- ✅ Implementado
- 🚧 Em desenvolvimento
- ⏳ Pendente
- ❌ Removido/Descontinuado

## Fase 1 - API

### ⏳ Cadastro de Usuários

Os usuários terão um cadastro inicial (como um perfil geral). E poderá ter vários logins o sistema (email e senha, google, facebook, etc).

Usuários poderão ser associados a quantos inquilinos forem necessário. E seus privilégios serão definidos por inquilino.

### ⏳ Cadastro de Inquilinos

Os inquilinos serão cadastrados pelo sistema. E poderão ter vários usuários associados a eles.

O primeiro inquilino será o próprio sistema. E os demais serão os seus clientes.

### ⏳ Cadastro de Tarefas

Esse módulo apareceu por uma necessidade de uma contabilidade.

Por conta disso, teremos um cadastro de clientes. Também teremos o cadastro de carteiras de clientes. Aí sim poderemos ter tarefas associadas aos usuários, aos clientes e as carteiras.