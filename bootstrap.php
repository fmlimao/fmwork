<?php

require_once 'functions.php';

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
