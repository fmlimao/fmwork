<?php

namespace App\Controllers;

class Home extends \App\Controller
{
	public function indexAction()
	{
		// se eu quiser buscar uma lista de usuarios, posso fazer assim
		// $UserModel = new \App\Models\User();
		// $users = $UserModel->getAll();
		// printa($users);

		// se eu quiser buscar um unico usuario, eu posso fazer dessa maneira
		// $user = new \App\Models\User(2);
		// printa($user);



		// $user = new \App\Models\User();
		// $user->setAttribute('name', 'Arnaldo Coelho');
		// $user->setAttribute('user', 'arnaldo.coelho');
		// $user->save();

		// $user->setAttribute('name', 'Caetano Soares');
		// $user->setAttribute('user', 'caetano.soares');
		// $user->save();

		// $user->delete();

		// printa($user);



		// $token = 'askjdhkasjdhkajsdhkasjdhkjashd';

		// $this->view([
		// 	'token' => $token,
		// 	'users' => $users,
		// 	'user' => $user,
		// ]);
	}

	public function loginAction()
	{
		$this->view();
	}

	public function meAjuda($a, $b)
	{
		return $a + $b;
	}

	public function criarContaAction($params)
	{
		echo 'criando uma conta... ' . $this->meAjuda(18, 98);

		printa($params);
	}
}
