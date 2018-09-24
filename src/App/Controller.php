<?php

namespace App;

class Controller
{
    protected $System;

    public function __construct(System $System)
    {
        $this->System = $System;
    }

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
}