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
 *         content:
 *           type: object
 *           description: Conteúdo da resposta
 *       example:
 *         code: 200
 *         error: false
 *         content: {}
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: Código HTTP do erro
 *         error:
 *           type: boolean
 *           default: true
 *           description: Indica que houve erro na requisição
 *         message:
 *           type: string
 *           description: Mensagem de erro
 *       example:
 *         code: 400
 *         error: true
 *         message: "Mensagem de erro"
 */