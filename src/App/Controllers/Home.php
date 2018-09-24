<?php

namespace App\Controllers;

class Home extends \App\Controller
{
	public function indexAction()
	{
		$token = 'askjdhkasjdhkajsdhkasjdhkjashd';

		$this->view([
			'token' => $token,
		]);
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
