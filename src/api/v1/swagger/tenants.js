/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: Gerenciamento de inquilinos (tenants)
 *
 * /tenants:
 *   get:
 *     summary: Lista todos os inquilinos
 *     description: Retorna uma lista paginada de todos os inquilinos do sistema
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de inquilinos recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TenantListResponse'
 *       401:
 *         description: Token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerErrorResponse'
 */
