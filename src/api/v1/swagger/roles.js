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
 */