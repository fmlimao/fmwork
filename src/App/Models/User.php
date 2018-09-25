<?php

namespace App\Models;

class User extends \App\Model
{
    public $table = 'users';

    // Método que busca usuário pelo login e senha
    public function getByUserAndPassword($user, $password)
    {
        $users = $this->search([
            'where' => ['user = ? AND password = ?', $user, $password],
        ]);

        if (!empty($users)) {
            return $users[0];
        }

        return false;
    }
}
