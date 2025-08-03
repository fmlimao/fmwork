/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: Código HTTP da resposta
 *         error:
 *           type: boolean
 *           description: Indica se houve erro na requisição
 *         messages:
 *           type: array
 *           items:
 *             type: string
 *             description: Mensagem de erro ou sucesso
 *       example:
 *         code: 200
 *         error: false
 *         messages: []
 *
 *     NotFoundErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             code:
 *               type: integer
 *               default: 404
 *             error:
 *               type: boolean
 *               default: true
 *           example:
 *             code: 404
 *             error: true
 *             messages: ["Recurso não encontrado."]
 *
 *     ValidationErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             code:
 *               type: integer
 *               default: 400
 *             error:
 *               type: boolean
 *               default: true
 *             messages:
 *               type: array
 *               items:
 *                 type: string
 *               default: ["Verifique todos os campos."]
 *             form:
 *               type: object
 *               description: Formulário de erro com os campos que falharam na validação
 *           example:
 *             code: 400
 *             error: true
 *             messages: ["Verifique todos os campos."]
 *             form: {}
 *
 *     InvalidCredentialsResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             code:
 *               type: integer
 *               default: 401
 *             error:
 *               type: boolean
 *               default: true
 *           example:
 *             code: 401
 *             error: true
 *             messages: ["Credenciais inválidas"]
 *
 *     UnauthorizedErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             code:
 *               type: integer
 *               default: 401
 *             error:
 *               type: boolean
 *               default: true
 *             errorCodes:
 *               type: array
 *               items:
 *                 type: string
 *               description: Códigos de erro para identificação do problema
 *             errorCodeDetails:
 *               type: array
 *               items:
 *                 type: string
 *               description: Detalhes técnicos do erro
 *           example:
 *             code: 401
 *             error: true
 *             errorCodes: ["INVALID_TOKEN"]
 *             errorCodeDetails: ["invalid token"]
 *             messages: ["Token inválido."]
 *
 *     InternalServerErrorResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             code:
 *               type: integer
 *               default: 500
 *             error:
 *               type: boolean
 *               default: true
 *             messages:
 *               type: array
 *               items:
 *                 type: string
 *               default: ["Erro interno. Por favor, tente novamente."]
 *           example:
 *             code: 500
 *             error: true
 *             messages: ["Erro interno. Por favor, tente novamente."]
 *
 *     AuthResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             content:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token JWT para autenticação
 *           example:
 *             code: 200
 *             error: false
 *             content:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     EntityResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             content:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Dados da entidade
 *           example:
 *             code: 200
 *             error: false
 *             messages: ["Entidade encontrada com sucesso."]
 *             content:
 *               data:
 *                 uuid: "550e8400-e29b-41d4-a716-446655440000"
 *                 name: "Empresa Exemplo"
 *
 *     Meta:
 *       type: object
 *       properties:
 *         totalCount:
 *           type: integer
 *           description: Total de itens na lista
 *         filteredCount:
 *           type: integer
 *           description: Total de itens filtrados na lista
 *         start:
 *           type: integer
 *           description: Índice inicial da lista
 *         length:
 *           type: integer
 *           description: Limite de itens por página
 *         pages:
 *           type: integer
 *           description: Total de páginas
 *         currentPage:
 *           type: integer
 *           description: Página atual
 *         orderBy:
 *           type: object
 *           properties:
 *             column:
 *               type: string
 *               description: Campo a ser ordenado
 *             dir:
 *               type: string
 *               enum: [ASC, DESC]
 *               description: Direção da ordenação (ASC ou DESC)
 *       example:
 *         totalCount: 1
 *         filteredCount: 1
 *         start: 0
 *         length: 10
 *         pages: 1
 *         currentPage: 1
 *         orderBy:
 *           column: "name"
 *           dir: "ASC"
 *
 *     ListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             content:
 *               type: object
 *               properties:
 *                 meta:
 *                   $ref: '#/components/schemas/Meta'
 *                 data:
 *                   type: array
 *                   description: Lista de itens
 *                   items:
 *                     type: object
 *                     description: Item da lista
 *
 *     Me:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             uuid:
 *               type: string
 *               format: uuid
 *               description: UUID do usuário
 *             name:
 *               type: string
 *               description: Nome do usuário
 *             document:
 *               type: string
 *               description: Documento do usuário (CPF)
 *             email:
 *               type: string
 *               format: email
 *               description: Email do usuário
 *             avatar:
 *               type: string
 *               description: URL do avatar do usuário
 *         tenant:
 *           type: object
 *           properties:
 *             uuid:
 *               type: string
 *               format: uuid
 *               description: UUID do tenant
 *             name:
 *               type: string
 *               description: Nome do tenant
 *             description:
 *               type: string
 *               description: Descrição do tenant
 *             appTitle:
 *               type: string
 *               description: Título da aplicação
 *             appShortTitle:
 *               type: string
 *               description: Título curto da aplicação
 *             isRoot:
 *               type: integer
 *               description: Indica se é o tenant raiz
 *         role:
 *           type: object
 *           properties:
 *             uuid:
 *               type: string
 *               format: uuid
 *               description: UUID do papel
 *             name:
 *               type: string
 *               description: Nome do papel
 *             description:
 *               type: string
 *               description: Descrição do papel
 *         permissions:
 *           type: array
 *           description: Lista de permissões do usuário
 *           items:
 *             type: object
 *             properties:
 *               uuid:
 *                 type: string
 *                 format: uuid
 *                 description: UUID da permissão
 *               name:
 *                 type: string
 *                 description: Nome da permissão
 *               slug:
 *                 type: string
 *                 description: Slug da permissão
 *               description:
 *                 type: string
 *                 description: Descrição da permissão
 *       example:
 *         user:
 *           uuid: "2fe91aa9-4a20-11f0-95b3-5299fd27ec4e"
 *           name: "Administrador"
 *           document: "000.000.000-00"
 *           email: "admin@projetosfm.com.br"
 *           avatar: "//www.gravatar.com/avatar/0c62b0063771ce3f12502c4e39c711f3?s=200&d=retro&r=g"
 *         tenant:
 *           uuid: "288ad53d-4a1f-11f0-95b3-5299fd27ec4e"
 *           name: "Projetos FM"
 *           description: "Projeto principal do sistema"
 *           appTitle: "Projetos FM"
 *           appShortTitle: "PFM"
 *           isRoot: 1
 *         role:
 *           uuid: "4fe91aa9-4a20-11f0-95b3-5299fd27ec4f"
 *           name: "Administrador"
 *           description: "Acesso total ao sistema"
 *         permissions:
 *           - uuid: "264ef91a-59b4-11f0-9142-3eaed10807e8"
 *             name: "Permissão Total - Inquilino"
 *             slug: "full-tenant-permission"
 *             description: "Permite todas as ações no inquilino"
 *
 *     MeResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             content:
 *               type: object
 *               properties:
 *                 me:
 *                   $ref: '#/components/schemas/Me'
 *           example:
 *             code: 200
 *             error: false
 *             content:
 *               me:
 *                 user:
 *                   uuid: "2fe91aa9-4a20-11f0-95b3-5299fd27ec4e"
 *                   name: "Administrador"
 *                   document: "000.000.000-00"
 *                   email: "admin@projetosfm.com.br"
 *                   avatar: "//www.gravatar.com/avatar/0c62b0063771ce3f12502c4e39c711f3?s=200&d=retro&r=g"
 *                 tenant:
 *                   uuid: "288ad53d-4a1f-11f0-95b3-5299fd27ec4e"
 *                   name: "Projetos FM"
 *                   description: "Projeto principal do sistema"
 *                   appTitle: "Projetos FM"
 *                   appShortTitle: "PFM"
 *                   isRoot: 1
 *                 role:
 *                   uuid: "4fe91aa9-4a20-11f0-95b3-5299fd27ec4f"
 *                   name: "Administrador"
 *                   description: "Acesso total ao sistema"
 *                 permissions:
 *                   - uuid: "264ef91a-59b4-11f0-9142-3eaed10807e8"
 *                     name: "Permissão Total - Inquilino"
 *                     slug: "full-tenant-permission"
 *                     description: "Permite todas as ações no inquilino"
 *
 *     Tenant:
 *       type: object
 *       properties:
 *         uuid:
 *           type: string
 *           format: uuid
 *           description: UUID do tenant
 *         name:
 *           type: string
 *           description: Nome do tenant
 *         description:
 *           type: string
 *           description: Descrição do tenant
 *         appTitle:
 *           type: string
 *           description: Título da aplicação
 *         appShortTitle:
 *           type: string
 *           description: Título curto da aplicação
 *         isRoot:
 *           type: integer
 *           description: Indica se é o tenant raiz (1 = sim, 0 = não)
 *         active:
 *           type: integer
 *           description: Indica se o tenant está ativo (1 = sim, 0 = não)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do tenant
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do tenant
 *       example:
 *         uuid: "288ad53d-4a1f-11f0-95b3-5299fd27ec4e"
 *         name: "Projetos FM"
 *         description: "Projeto principal do sistema"
 *         appTitle: "Projetos FM"
 *         appShortTitle: "PFM"
 *         isRoot: 1
 *         active: 1
 *         createdAt: "2025-08-03 00:35:02"
 *         updatedAt: "2025-08-03 00:35:02"
 *
 *     TenantListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ListResponse'
 *         - type: object
 *           properties:
 *             content:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   description: Lista de tenants
 *                   items:
 *                     $ref: '#/components/schemas/Tenant'
 *           example:
 *             code: 200
 *             error: false
 *             messages: []
 *             content:
 *               meta:
 *                 totalCount: 1
 *                 filteredCount: 1
 *                 start: 0
 *                 length: 10
 *                 pages: 1
 *                 currentPage: 1
 *                 orderBy:
 *                   column: "name"
 *                   dir: "ASC"
 *               data: [
 *                 {
 *                   uuid: "288ad53d-4a1f-11f0-95b3-5299fd27ec4e",
 *                   name: "Projetos FM",
 *                   description: "Projeto principal do sistema",
 *                   appTitle: "Projetos FM",
 *                   appShortTitle: "PFM",
 *                   isRoot: 1,
 *                   active: 1,
 *                   createdAt: "2025-08-03 00:35:02",
 *                   updatedAt: "2025-08-03 00:35:02"
 *                 }
 *               ]
 *
 *     TenantCreateValidationResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ValidationErrorResponse'
 *         - type: object
 *           properties:
 *             form:
 *               type: object
 *               properties:
 *                 name:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: boolean
 *                       description: Indica se há erro no campo nome
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Mensagens de erro do campo nome
 *                 appTitle:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: boolean
 *                       description: Indica se há erro no campo título da aplicação
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Mensagens de erro do campo título da aplicação
 *                 appShortTitle:
 *                   type: object
 *                   properties:
 *                     error:
 *                       type: boolean
 *                       description: Indica se há erro no campo título curto da aplicação
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Mensagens de erro do campo título curto da aplicação
 *           example:
 *             code: 400
 *             error: true
 *             messages: ["Verifique todos os campos."]
 *             form: {
 *               name: {
 *                 error: true,
 *                 messages: ["Campo obrigatório."]
 *               },
 *               appTitle: {
 *                 error: true,
 *                 messages: ["Campo obrigatório."]
 *               },
 *               appShortTitle: {
 *                 error: true,
 *                 messages: ["Campo obrigatório."]
 *               }
 *             }
 */
