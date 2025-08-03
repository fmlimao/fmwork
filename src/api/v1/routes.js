const express = require('express')
const router = express.Router()

const HomeController = require('./controllers/home')
const AuthController = require('./controllers/auth')

const TenantController = require('./controllers/tenant')
const TenantUserController = require('./controllers/tenant-user')

const RoleController = require('./controllers/role')
const RolePermissionController = require('./controllers/role-permission')
const UserController = require('./controllers/user')

const AuthVerifyMiddleware = require('./middlewares/auth-verify')
const GetTenantMiddleware = require('./middlewares/get-tenant')
const GetTenantUserMiddleware = require('./middlewares/get-tenant-user')

const GetRoleMiddleware = require('./middlewares/get-role')
const GetRolePermissionMiddleware = require('./middlewares/get-role-permission')
const GetUserMiddleware = require('./middlewares/get-user')

// Home
router.get('/', HomeController.home)

// Autenticação
router.post('/auth', AuthController.login)

// Verificação de autenticação
router.use(AuthVerifyMiddleware)

// Dados do usuário autenticado
router.get('/auth/me', AuthController.me)

// Acesso Administrativo

// Inquilinos
router.get('/tenants', TenantController.list)
router.post('/tenants', TenantController.create)
router.get('/tenants/:tenantUuid', GetTenantMiddleware, TenantController.getOne)
router.put('/tenants/:tenantUuid', GetTenantMiddleware, TenantController.update)
router.delete('/tenants/:tenantUuid', GetTenantMiddleware, TenantController.remove)

// Usuários
router.get('/users', UserController.list)
router.post('/users', UserController.create)
router.get('/users/:userUuid', GetUserMiddleware, UserController.getOne)
router.put('/users/:userUuid', GetUserMiddleware, UserController.update)
router.delete('/users/:userUuid', GetUserMiddleware, UserController.remove)

// Acesso Comum

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
router.get('/tenants/:tenantUuid/users', GetTenantMiddleware, TenantUserController.list)
router.post('/tenants/:tenantUuid/users', GetTenantMiddleware, TenantUserController.create)
router.get('/tenants/:tenantUuid/users/:userUuid', GetTenantMiddleware, GetTenantUserMiddleware, TenantUserController.getOne)
router.put('/tenants/:tenantUuid/users/:userUuid', GetTenantMiddleware, GetTenantUserMiddleware, TenantUserController.update)
router.delete('/tenants/:tenantUuid/users/:userUuid', GetTenantMiddleware, GetTenantUserMiddleware, TenantUserController.remove)

// Erros
router.use(require('./middlewares/error-404'))
router.use(require('./middlewares/error-500'))

module.exports = router
