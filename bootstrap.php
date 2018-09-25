<?php

require_once 'functions.php';

session_name(env('APP_SESSION_NAME'));
session_start();

if (env('APP_DISPLAY_ERRORS')) {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

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

try {
    $conn = new \PDO('mysql:host=' . env('APP_NAME') . '-mysql;dbname=' . env('MYSQL_DATABASE'), env('MYSQL_USER'), env('MYSQL_PASSWORD'));
} catch (\PDOException $e) {
    printa('Erro no banco: ' . $e->getMessage());
    die();
}
