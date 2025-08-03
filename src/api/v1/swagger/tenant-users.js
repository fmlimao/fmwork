/**
 * @swagger
 * /tenants/{tenantUuid}/users:
 *   get:
 *     summary: Lista todos os usuários do inquilino
 *     description: Retorna uma lista paginada de todos os usuários do inquilino especificado
 *     tags: [⤷ Usuários do Inquilino]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantUuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do inquilino
 *         example: "288ad53d-4a1f-11f0-95b3-5299fd27ec4e"
 *     responses:
 *       200:
 *         description: Lista de usuários recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantUserListResponse'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: Inquilino não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantNotFoundResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 *
 *   post:
 *     summary: Cria um novo usuário no inquilino
 *     description: Cria um novo usuário no inquilino especificado
 *     tags: [⤷ Usuários do Inquilino]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantUuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do inquilino
 *         example: "288ad53d-4a1f-11f0-95b3-5299fd27ec4e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantUserCreateRequest'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantUserCreateResponse'
 *       400:
 *         description: Erro de validação nos dados enviados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantUserCreateValidationResponse'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: Inquilino não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantNotFoundResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
