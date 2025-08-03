/**
 * @swagger
 * /tenants/{tenantUuid}/roles:
 *   get:
 *     summary: Lista todos os papéis do inquilino
 *     description: Retorna uma lista paginada de todos os papéis do inquilino especificado
 *     tags: [⤷ Papéis]
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
 *         description: Lista de papéis recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleListResponse'
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
 *     summary: Cria um novo papel
 *     description: Cria um novo papel no inquilino especificado
 *     tags: [⤷ Papéis]
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
 *             $ref: '#/components/schemas/RoleCreateRequest'
 *     responses:
 *       201:
 *         description: Papel criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleCreateResponse'
 *       400:
 *         description: Erro de validação nos dados enviados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleCreateValidationResponse'
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
 * /tenants/{tenantUuid}/roles/{uuid}:
 *   get:
 *     summary: Busca um papel pelo UUID
 *     description: Retorna os dados de um papel específico do inquilino
 *     tags: [⤷ Papéis]
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
 *         description: UUID do papel
 *         example: "1c964865-7088-11f0-a5c2-fa4b97db6fe4"
 *     responses:
 *       200:
 *         description: Papel encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleResponse'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: Papel não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleNotFoundResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 *
 *   put:
 *     summary: Atualiza um papel
 *     description: Atualiza os dados de um papel específico do inquilino
 *     tags: [⤷ Papéis]
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
 *         description: UUID do papel
 *         example: "1c964865-7088-11f0-a5c2-fa4b97db6fe4"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleUpdateRequest'
 *     responses:
 *       200:
 *         description: Papel atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleUpdateResponse'
 *       400:
 *         description: Erro de validação nos dados enviados
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/RoleCreateValidationResponse'
 *                 - $ref: '#/components/schemas/RoleUpdateEmptyFieldsResponse'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: Papel não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleNotFoundResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 *
 *   delete:
 *     summary: Remove um papel
 *     description: Remove um papel específico do inquilino
 *     tags: [⤷ Papéis]
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
 *         description: UUID do papel
 *         example: "1c964865-7088-11f0-a5c2-fa4b97db6fe4"
 *     responses:
 *       204:
 *         description: Papel removido com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: Papel não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleNotFoundResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
