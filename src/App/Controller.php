<?php

namespace App;

class Controller
{
    protected $System;

    public function __construct(System $System)
    {
        // Toda controller terá uma copia da System para poder acessar seus atributos
        $this->System = $System;
    }

    // Método responsável por exibir a View da Controller/Action
    protected function view($params = [])
    {
        $dir = __DIR__ . '/Views/' . $this->System->getController() . '/';
        $file = $dir . $this->System->getAction();
        $types = ['php', 'html'];

        if (is_dir($dir)) {
            foreach ($types as $type) {
                $file_name = $file . '.' . $type;
                if (file_exists($file_name)) {
                    extract($params);
                    return require $file_name;
                }
            }
        }

        die('View "' . ($this->System->getController() . '/' . $this->System->getAction()) . '" não encontrada');
    }

    // Método responsável por redirecionar a aplicação
    protected function go($path)
    {
        header('location: ' . env('APP_PATH') . $path);
        exit;
    }

    // Método responsável por verificar se existe a sessão de login
    protected function needLogin()
    {
        if (!isset($_SESSION['login'])) {
            $this->go('home/login');
        }
    }

    // Método responsável por buscar variáveis na GET, POST ou FILES
    protected function get($name, $default_value = null)
    {
        $ret = $default_value;
        if (isset($_GET[$name])) $ret = $_GET[$name];
        else if (isset($_POST[$name])) $ret = $_POST[$name];
        else if (isset($_FILES[$name])) $ret = $_POST[$name];
        return $ret;
    }
}
