-- Desabilitar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS tenants;

CREATE TABLE `tenants` (
    `tenant_id` int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text,
    `app_title` varchar(255) DEFAULT NULL,
    `app_short_title` varchar(255) DEFAULT NULL,
    `is_root` tinyint DEFAULT 0,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `tenant_id` int NOT NULL,
    `uuid` varchar(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    `document` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `uk_users_tenant_email` (`tenant_id`, `email`),
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `permissions` (
    `permission_id` int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    `slug` varchar(255) NOT NULL,
    `description` text,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`permission_id`),
    UNIQUE KEY `uk_permissions_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `roles` (
    `role_id` int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_roles` (
    `user_role_id` int NOT NULL AUTO_INCREMENT,
    `tenant_id` int NOT NULL,
    `user_id` int NOT NULL,
    `role_id` int NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`user_role_id`),
    UNIQUE KEY `uk_user_roles` (`tenant_id`, `user_id`, `role_id`),
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`tenant_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `role_permissions` (
    `role_permission_id` int NOT NULL AUTO_INCREMENT,
    `tenant_id` int NOT NULL,
    `role_id` int NOT NULL,
    `permission_id` int NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`role_permission_id`),
    UNIQUE KEY `uk_role_permissions` (`tenant_id`, `role_id`, `permission_id`),
    FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`tenant_id`),
    FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
    FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Inserir algumas permissões básicas
INSERT INTO permissions (uuid, name, slug, description) VALUES
('3fe91aa9-4a20-11f0-95b3-5299fd27ec4f', 'Visualizar Dashboard', 'view-dashboard', 'Permite visualizar o dashboard do tenant'),
('3fe91aa9-4a20-11f0-95b3-5299fd27ec50', 'Gerenciar Usuários', 'manage-users', 'Permite gerenciar usuários do tenant'),
('3fe91aa9-4a20-11f0-95b3-5299fd27ec51', 'Gerenciar Perfis', 'manage-roles', 'Permite gerenciar perfis de acesso do tenant'),
('3fe91aa9-4a20-11f0-95b3-5299fd27ec52', 'Gerenciar Permissões', 'manage-permissions', 'Permite gerenciar permissões dos perfis');

-- Inserir perfil padrão de Administrador
INSERT INTO roles (uuid, name, description) VALUES
('4fe91aa9-4a20-11f0-95b3-5299fd27ec4f', 'Administrador', 'Acesso total ao tenant');

-- Inserir tenant root
INSERT INTO tenants (uuid, name, description, app_title, app_short_title, is_root)
VALUES ('288ad53d-4a1f-11f0-95b3-5299fd27ec4e', 'Projetos FM', 'Projeto principal do sistema', 'Projetos FM', 'PFM', 1);

-- Inserir usuário admin
INSERT INTO users (tenant_id, uuid, name, document, email, password)
SELECT tenant_id, '2fe91aa9-4a20-11f0-95b3-5299fd27ec4e', 'Administrador', '000.000.000-00', 'admin@projetosfm.com.br', '$2b$10$xLxrhUq119Hwa2gnRqWlOeucyrTqq8JEDrqOXmUxLSgDGVXIiobwy'
FROM tenants WHERE is_root = 1;

-- Vincular perfil de Administrador ao usuário admin
INSERT INTO user_roles (tenant_id, user_id, role_id)
SELECT t.tenant_id, u.user_id, r.role_id
FROM tenants t
JOIN users u ON u.tenant_id = t.tenant_id
CROSS JOIN roles r
WHERE t.is_root = 1
AND u.email = 'admin@projetosfm.com.br'
AND r.name = 'Administrador';

-- Vincular todas as permissões ao perfil de Administrador
INSERT INTO role_permissions (tenant_id, role_id, permission_id)
SELECT t.tenant_id, r.role_id, p.permission_id
FROM tenants t
CROSS JOIN roles r
CROSS JOIN permissions p
WHERE t.is_root = 1
AND r.name = 'Administrador';

-- Reabilitar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;
