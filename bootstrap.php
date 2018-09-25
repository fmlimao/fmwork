<?php

// Chamamos o arquivo de funções
require_once 'functions.php';

// Setamos o nome da Sessão e iniciamos ela
session_name(env('APP_SESSION_NAME'));
session_start();

// Exibição de erros na tela
if (env('APP_DISPLAY_ERRORS')) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

// Função responsável pela chamada das Classes de maneira automática (PSR-4)
function autoload($classe)
{
    $classe = implode('/', explode('\\', $classe));
    $file = __DIR__ . '/src/' . $classe . '.php';
    if (file_exists($file)) {
        return require $file;
    }

    die('Classe "' . $classe . '" não encotrada');
}

spl_autoload_register('autoload');

// Conexão com o Banco de Dados
try {
    $conn = new \PDO('mysql:host=' . env('APP_NAME') . '-mysql;dbname=' . env('MYSQL_DATABASE'), env('MYSQL_USER'), env('MYSQL_PASSWORD'));
} catch (\PDOException $e) {
    printa('Erro no banco: ' . $e->getMessage());
    die();
}
