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
 *
 * /tenants/{tenantUuid}/users/{uuid}:
 *   get:
 *     summary: Busca um usuário do inquilino pelo UUID
 *     description: Retorna os dados de um usuário específico do inquilino
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
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do usuário
 *         example: "6b4e8f8e-708e-11f0-a5c2-fa4b97db6fe4"
 *     responses:
 *       200:
 *         description: Usuário encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantUserResponse'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantUserNotFoundResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 *
 *   put:
 *     summary: Atualiza um usuário do inquilino
 *     description: Atualiza os dados de um usuário específico do inquilino
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
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do usuário
 *         example: "6b4e8f8e-708e-11f0-a5c2-fa4b97db6fe4"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TenantUserUpdateRequest'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantUserUpdateResponse'
 *       400:
 *         description: Erro de validação nos dados enviados
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/TenantUserCreateValidationResponse'
 *                 - $ref: '#/components/schemas/TenantUserUpdateEmptyFieldsResponse'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantUserNotFoundResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 *
 *   delete:
 *     summary: Remove um usuário do inquilino
 *     description: Remove um usuário específico do inquilino
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
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do usuário
 *         example: "6b4e8f8e-708e-11f0-a5c2-fa4b97db6fe4"
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantUserNotFoundResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
