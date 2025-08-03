-- Desabilitar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS permissions;

CREATE TABLE `permissions` (
    `permission_id` int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    `slug` varchar(255) NOT NULL,
    `description` text,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tenants` (
    `tenant_id` int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text,
    `app_title` varchar(255) DEFAULT NULL,
    `app_short_title` varchar(255) DEFAULT NULL,
    `is_root` tinyint DEFAULT 0,
    `active` tinyint DEFAULT 1,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`tenant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `roles` (
    `role_id` int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(36) NOT NULL,
    `tenant_id` int NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text,
    `active` tinyint DEFAULT 1,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
    `user_id` int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(36) NOT NULL,
    `tenant_id` int NOT NULL,
    `role_id` int NOT NULL,
    `name` varchar(255) NOT NULL,
    `document` varchar(255) DEFAULT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `active` tinyint DEFAULT 1,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `role_permissions` (
    `role_permission_id` int NOT NULL AUTO_INCREMENT,
    `tenant_id` int NOT NULL,
    `role_id` int NOT NULL,
    `permission_id` int NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`role_permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Inserir algumas permissões básicas
INSERT INTO permissions (uuid, name, slug, description) VALUES
('264ef91a-59b4-11f0-9142-3eaed10807e8', 'Permissão Total - Inquilino', 'full-tenant-permission', 'Permite todas as ações no inquilino'),
('264f0021-59b4-11f0-9142-3eaed10807e8', 'Visualizar Dashboard', 'view-dashboard', 'Permite visualizar o dashboard do tenant'),
('264f01a7-59b4-11f0-9142-3eaed10807e8', 'Gerenciar Usuários', 'manage-users', 'Permite gerenciar usuários do tenant'),
('264f0210-59b4-11f0-9142-3eaed10807e8', 'Gerenciar Perfis', 'manage-roles', 'Permite gerenciar perfis de acesso do tenant'),
('264f024c-59b4-11f0-9142-3eaed10807e8', 'Gerenciar Permissões', 'manage-permissions', 'Permite gerenciar permissões dos perfis');

-- Inserir tenant root
INSERT INTO tenants (uuid, name, description, app_title, app_short_title, is_root)
VALUES ('288ad53d-4a1f-11f0-95b3-5299fd27ec4e', 'Projetos FM', 'Projeto principal do sistema', 'Projetos FM', 'PFM', 1);

-- Inserir papel padrão de Administrador
INSERT INTO roles (uuid, tenant_id, name, description) VALUES
('4fe91aa9-4a20-11f0-95b3-5299fd27ec4f', 1, 'Administrador', 'Acesso total ao sistema');

-- Inserir usuário admin
INSERT INTO users (uuid, tenant_id, role_id, name, document, email, password)
VALUES ('2fe91aa9-4a20-11f0-95b3-5299fd27ec4e', 1, 1, 'Administrador', '000.000.000-00', 'admin@projetosfm.com.br', '$2b$10$xLxrhUq119Hwa2gnRqWlOeucyrTqq8JEDrqOXmUxLSgDGVXIiobwy');

-- Vincular todas as permissões ao perfil de Administrador
INSERT INTO role_permissions (tenant_id, role_id, permission_id)
VALUES (1, 1, 1);

-- Reabilitar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;
