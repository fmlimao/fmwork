DROP TABLE IF EXISTS people;

CREATE TABLE `people` (
    `person_id` int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    `document` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`person_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS person_emails;

CREATE TABLE `person_emails` (
    `person_email_id` int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(36) NOT NULL,
    `person_id` int NOT NULL,
    `email` varchar(255) NOT NULL,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`person_email_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS projects;

CREATE TABLE `projects` (
    `project_id` int NOT NULL AUTO_INCREMENT,
    `uuid` varchar(36) NOT NULL,
    `name` varchar(255) NOT NULL,
    `description` text,
    `app_title` varchar(255) DEFAULT NULL,
    `app_short_title` varchar(255) DEFAULT NULL,
    `is_root` tinyint DEFAULT 0,
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` datetime DEFAULT NULL,
    PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO people (uuid, name, document, password)
VALUES ('2fe91aa9-4a20-11f0-95b3-5299fd27ec4e', 'Administrador', '000.000.000-00', '$2y$10$eImiTMZG4oQ9qY1a5Z3U0u5z5b5z5b5z5b5z5b5z5b5z5b5z5b5z');

INSERT INTO person_emails (uuid, person_id, email)
VALUES ('2fe91aa9-4a21-11f0-95b3-5299fd27ec4e', 1, 'admin@projetofm.com.br');

INSERT INTO projects (uuid, name, description, app_title, app_short_title, is_root)
VALUES ('288ad53d-4a1f-11f0-95b3-5299fd27ec4e', 'Projetos FM', 'Projeto principal do sistema', 'Projetos FM', 'PFM', 1);


