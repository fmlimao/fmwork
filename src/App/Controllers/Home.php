<?php

namespace App\Controllers;

class Home extends \App\Controller
{
	public function indexAction()
	{
		$this->needLogin();

		$UserModel = new \App\Models\User();
		$users = $UserModel->getAll();

		$this->view([
			'users' => $users,
		]);
	}

	public function loginAction()
	{
		$act = $this->get('act', '');
		$user = trim($this->get('user', ''));
		$password = trim($this->get('password', ''));
		$error_message = [];

		if ($act == 'login') {
			$error = false;

			if ($user == '') {
				$error = true;
				$error_message[] = '- Informe o usuário';
			}

			if ($password == '') {
				$error = true;
				$error_message[] = '- Informe a senha';
			}

			if (!$error) {
				$UserModel = new \App\Models\User();
				$users = $UserModel->getByUserAndPassword($user, $password);

				if (!$users) {
					$error_message[] = '- Usuário não encontrado';
				} else {
					$_SESSION['login'] = $users;
					$this->go('home');
				}
			}
		}

		$this->view([
			'user' => $user,
			'password' => $password,
			'error_message' => $error_message,
		]);
	}

	public function logoutAction()
	{
		session_destroy();
		$this->go('home');
	}
}
