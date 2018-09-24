<?php

require_once 'bootstrap.php';

$System = new App\System;

// $System->route('/a-b/{v1}/', function () {
//     echo 'rota 1';
// });

// $System->route('/a-b/{caique}/e-f/{renan}/i-aj/', function ($args) {
//     echo 'rota 2';
//     printa($args);
// });

$System->start();
