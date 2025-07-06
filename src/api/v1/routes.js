const express = require('express')
const router = express.Router()

const HomeController = require('./controllers/home')
const AuthController = require('./controllers/auth')
const TenantController = require('./controllers/tenant')
const RoleController = require('./controllers/role')
const RolePermissionController = require('./controllers/role-permission')
const UserController = require('./controllers/user')

const AuthVerifyMiddleware = require('./middlewares/auth-verify')
const GetTenantMiddleware = require('./middlewares/get-tenant')
const GetRoleMiddleware = require('./middlewares/get-role')
const GetRolePermissionMiddleware = require('./middlewares/get-role-permission')
const GetUserMiddleware = require('./middlewares/get-user')

// Home
router.get('/', HomeController.homeGet)

// Autenticação
router.post('/auth', AuthController.loginPost)

// Verificação de autenticação
router.use(AuthVerifyMiddleware)

router.get('/auth/me', AuthController.meGet)

// Inquilinos
router.get('/tenants', TenantController.listGet)
router.post('/tenants', TenantController.createPost)
router.get('/tenants/:tenantUuid', GetTenantMiddleware, TenantController.getOneGet)
router.put('/tenants/:tenantUuid', GetTenantMiddleware, TenantController.updatePut)
router.delete('/tenants/:tenantUuid', GetTenantMiddleware, TenantController.deleteDelete)

// Perfis
router.get('/tenants/:tenantUuid/roles', GetTenantMiddleware, RoleController.listGet)
router.post('/tenants/:tenantUuid/roles', GetTenantMiddleware, RoleController.createPost)
router.get('/tenants/:tenantUuid/roles/:roleUuid', GetTenantMiddleware, GetRoleMiddleware, RoleController.getOneGet)
router.put('/tenants/:tenantUuid/roles/:roleUuid', GetTenantMiddleware, GetRoleMiddleware, RoleController.updatePut)
router.delete('/tenants/:tenantUuid/roles/:roleUuid', GetTenantMiddleware, GetRoleMiddleware, RoleController.deleteDelete)

// Perfil / Permissões
router.get('/tenants/:tenantUuid/roles/:roleUuid/permissions', GetTenantMiddleware, GetRoleMiddleware, RolePermissionController.listGet)
router.post('/tenants/:tenantUuid/roles/:roleUuid/permissions', GetTenantMiddleware, GetRoleMiddleware, RolePermissionController.createPost)
router.get('/tenants/:tenantUuid/roles/:roleUuid/permissions/:permissionUuid', GetTenantMiddleware, GetRoleMiddleware, GetRolePermissionMiddleware, RolePermissionController.getOneGet)
router.delete('/tenants/:tenantUuid/roles/:roleUuid/permissions/:permissionUuid', GetTenantMiddleware, GetRoleMiddleware, GetRolePermissionMiddleware, RolePermissionController.deleteDelete)

// Usuários
router.get('/tenants/:tenantUuid/users', GetTenantMiddleware, UserController.listGet)
router.post('/tenants/:tenantUuid/users', GetTenantMiddleware, UserController.createPost)
router.get('/tenants/:tenantUuid/users/:userUuid', GetTenantMiddleware, GetUserMiddleware, UserController.getOneGet)
router.put('/tenants/:tenantUuid/users/:userUuid', GetTenantMiddleware, GetUserMiddleware, UserController.updatePut)
router.delete('/tenants/:tenantUuid/users/:userUuid', GetTenantMiddleware, GetUserMiddleware, UserController.deleteDelete)

// Erros
router.use(require('./middlewares/error-404'))
router.use(require('./middlewares/error-500'))

module.exports = router
