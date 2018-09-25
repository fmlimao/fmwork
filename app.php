<?php

// Chamamos o arquivo com as configurações da nossa aplicação
require_once 'bootstrap.php';

// Objeto responsável por cuidar das chamadas das Controller e Actions
$System = new App\System;

// $System->route('/a-b/{v1}/', function () {
//     echo 'rota 1';
// });

// $System->route('/a-b/{caique}/e-f/{renan}/i-aj/', function ($args) {
//     echo 'rota 2';
//     printa($args);
// });

// Metodo que inicia toda a aplicação
$System->start();
