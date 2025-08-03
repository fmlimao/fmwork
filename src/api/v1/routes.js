const express = require('express')
const router = express.Router()

const HomeController = require('./controllers/home')
// const AuthController = require('./controllers/auth')
const TenantController = require('./controllers/tenant')
const RoleController = require('./controllers/role')
const RolePermissionController = require('./controllers/role-permission')
const UserController = require('./controllers/user')

// const AuthVerifyMiddleware = require('./middlewares/auth-verify')
const GetTenantMiddleware = require('./middlewares/get-tenant')
const GetRoleMiddleware = require('./middlewares/get-role')
const GetRolePermissionMiddleware = require('./middlewares/get-role-permission')
const GetUserMiddleware = require('./middlewares/get-user')

// Home
router.get('/', HomeController.home)

// // Autenticação
// router.post('/auth', AuthController.loginPost)

// // Verificação de autenticação
// router.use(AuthVerifyMiddleware)

// router.get('/auth/me', AuthController.meGet)

// Inquilinos
router.get('/tenants', TenantController.list)
router.post('/tenants', TenantController.create)
router.get('/tenants/:tenantUuid', GetTenantMiddleware, TenantController.getOne)
router.put('/tenants/:tenantUuid', GetTenantMiddleware, TenantController.update)
router.delete('/tenants/:tenantUuid', GetTenantMiddleware, TenantController.remove)

// Papeis
router.get('/tenants/:tenantUuid/roles', GetTenantMiddleware, RoleController.list)
router.post('/tenants/:tenantUuid/roles', GetTenantMiddleware, RoleController.create)
router.get('/tenants/:tenantUuid/roles/:roleUuid', GetTenantMiddleware, GetRoleMiddleware, RoleController.getOne)
router.put('/tenants/:tenantUuid/roles/:roleUuid', GetTenantMiddleware, GetRoleMiddleware, RoleController.update)
router.delete('/tenants/:tenantUuid/roles/:roleUuid', GetTenantMiddleware, GetRoleMiddleware, RoleController.remove)

// Perfil / Permissões
router.get('/tenants/:tenantUuid/roles/:roleUuid/permissions', GetTenantMiddleware, GetRoleMiddleware, RolePermissionController.list)
router.post('/tenants/:tenantUuid/roles/:roleUuid/permissions', GetTenantMiddleware, GetRoleMiddleware, RolePermissionController.add)
router.get('/tenants/:tenantUuid/roles/:roleUuid/permissions/:permissionUuid', GetTenantMiddleware, GetRoleMiddleware, GetRolePermissionMiddleware, RolePermissionController.getOne)
router.delete('/tenants/:tenantUuid/roles/:roleUuid/permissions/:permissionUuid', GetTenantMiddleware, GetRoleMiddleware, GetRolePermissionMiddleware, RolePermissionController.remove)

// Usuários
router.get('/tenants/:tenantUuid/users', GetTenantMiddleware, UserController.list)
router.post('/tenants/:tenantUuid/users', GetTenantMiddleware, UserController.create)
router.get('/tenants/:tenantUuid/users/:userUuid', GetTenantMiddleware, GetUserMiddleware, UserController.getOne)
router.put('/tenants/:tenantUuid/users/:userUuid', GetTenantMiddleware, GetUserMiddleware, UserController.update)
router.delete('/tenants/:tenantUuid/users/:userUuid', GetTenantMiddleware, GetUserMiddleware, UserController.remove)

// Erros
router.use(require('./middlewares/error-404'))
router.use(require('./middlewares/error-500'))

module.exports = router
