/**
 * @swagger
 * /tenants/{tenantUuid}/roles/{roleUuid}/permissions:
 *   get:
 *     summary: Lista todas as permissões de um papel
 *     description: Retorna uma lista paginada de todas as permissões atribuídas ao papel especificado
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
 *         name: roleUuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do papel
 *         example: "4fe91aa9-4a20-11f0-95b3-5299fd27ec4f"
 *     responses:
 *       200:
 *         description: Lista de permissões recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionListResponse'
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
 *   post:
 *     summary: Adiciona uma permissão ao papel
 *     description: Adiciona uma permissão específica ao papel do inquilino
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
 *         name: roleUuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do papel
 *         example: "4fe91aa9-4a20-11f0-95b3-5299fd27ec4f"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PermissionCreateRequest'
 *     responses:
 *       201:
 *         description: Permissão adicionada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionCreateResponse'
 *       400:
 *         description: Erro de validação nos dados enviados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionCreateValidationResponse'
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
 * /tenants/{tenantUuid}/roles/{roleUuid}/permissions/{uuid}:
 *   get:
 *     summary: Busca uma permissão do papel pelo UUID
 *     description: Retorna os dados de uma permissão específica do papel
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
 *         name: roleUuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do papel
 *         example: "4fe91aa9-4a20-11f0-95b3-5299fd27ec4f"
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da permissão
 *         example: "264f0021-59b4-11f0-9142-3eaed10807e8"
 *     responses:
 *       200:
 *         description: Permissão encontrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolePermissionResponse'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: Permissão não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionNotFoundResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 *
 *   delete:
 *     summary: Remove uma permissão do papel
 *     description: Remove uma permissão específica do papel
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
 *         name: roleUuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do papel
 *         example: "4fe91aa9-4a20-11f0-95b3-5299fd27ec4f"
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID da permissão
 *         example: "264f0021-59b4-11f0-9142-3eaed10807e8"
 *     responses:
 *       204:
 *         description: Permissão removida com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       404:
 *         description: Permissão não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PermissionNotFoundResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */