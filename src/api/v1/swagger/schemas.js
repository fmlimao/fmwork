/**
 * @swagger
 * components:
 *   schemas:
 *
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
 *               description: Formulário de erro
 *               properties:
 *                 id-do-campo:
 *                   type: object
 *                   description: Campo que causou o erro
 *                   properties:
 *                     error:
 *                       type: boolean
 *                       description: Indica se houve erro no campo
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: string
 *                         description: Mensagem de erro ou sucesso
 *           example:
 *             code: 400
 *             error: true
 *             messages: ["Verifique todos os campos."]
 *             form: {
 *               name: {
 *                 error: true,
 *                 messages: ["Campo obrigatório."]
 *               }
 *             }
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
 *           example:
 *             code: 401
 *             error: true
 *             messages: ["Usuário não encontrado."]
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
 *     ListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             content:
 *               type: object
 *               properties:
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalCount:
 *                       type: integer
 *                       description: Total de itens na lista
 *                     filteredCount:
 *                       type: integer
 *                       description: Total de itens filtrados na lista
 *                     start:
 *                       type: integer
 *                       description: Índice inicial da lista
 *                     length:
 *                       type: integer
 *                       description: Limite de itens por página
 *                     pages:
 *                       type: integer
 *                       description: Total de páginas
 *                     currentPage:
 *                       type: integer
 *                       description: Página atual
 *                     orderBy:
 *                       type: object
 *                       properties:
 *                         column:
 *                           type: string
 *                           description: Campo a ser ordenado
 *                         dir:
 *                           type: string
 *                           description: Direção da ordenação (asc ou desc)
 *                 data:
 *                   type: array
 *                   description: Lista de itens
 *                   items:
 *                     type: object
 *                     description: Item da lista
 *           example:
 *             code: 200
 *             error: false
 *             content:
 *               meta:
 *                 totalCount: 100
 *                 filteredCount: 100
 *                 start: 0
 *                 length: 10
 *                 pages: 10
 *                 currentPage: 1
 *                 orderBy:
 *                   column: "name"
 *                   dir: "asc"
 *               data:
 *                 - uuid: "550e8400-e29b-41d4-a716-446655440000"
 *                   name: "Empresa Exemplo"
 *                 - uuid: "550e8400-e29b-41d4-a716-446655440001"
 *                   name: "Empresa Exemplo 2"
 *
 *
 */
