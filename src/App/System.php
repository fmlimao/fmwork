<?php

namespace App;

class System
{
	// Atributos de controle da aplicação
	private $url;
	private $explode;
	private $controller;
	private $action;
	private $final_controller;
	private $final_action;
	private $params;

	// private $routes = [];

	public function __construct()
	{
		// Primeiro limpamos o caminho informado na URL
		$this->setUrl();

		// Depois quebramos ela para ajudar no processo
		$this->setExplode();

		// Retiramos a Controller da URL (caso exista uma)
		$this->setController();

		// Retiramos a Action da URL (caso exista uma)
		$this->setAction();

		// Retiramos os Parâmetros da URL (caso eles existam)
		$this->setParams();

		// Organizamos a Controller e Action para buscar elas dinamicamente
		$this->arrangeControllerAction();
	}

	private function setUrl()
	{
		if (isset($_SERVER['REQUEST_URI'])) {
			// Nginx
			$path = trim($_SERVER['REQUEST_URI']);
			$query_string = '?' . (isset($_SERVER['QUERY_STRING']) ? $_SERVER['QUERY_STRING'] : '');
			$path = str_replace($query_string, '', $path);
		} else if (isset($_SERVER['PATH_INFO'])) {
			// PHP Server
			$path = trim($_SERVER['PATH_INFO']);
		} else if (isset($_GET['url'])) {
			// Apache
			$path = trim($_GET['url']);
		} else {
			die('Não foi possível iniciar a url amigável');
		}

		$this->url = urldecode($path);
	}

	private function setExplode($list = false)
	{
		if ($list !== false) {
			$explode = $list;
		} else {
			$explode = explode('/', $this->url);
		}

		$this->explode = array_values(array_filter(array_map(function ($a) {
			return trim($a);
		}, $explode), function ($a) {
			return $a != '';
		}));
	}

	private function setController()
	{
		if (isset($this->explode[0])) {
			$this->controller = $this->explode[0];
			unset($this->explode[0]);
			$this->setExplode($this->explode);
		} else {
			$this->controller = env('APP_DEFAULT_CONTROLLER');
		}
	}

	public function getController()
	{
		return $this->controller;
	}

	private function setAction()
	{
		if (isset($this->explode[0])) {
			$this->action = $this->explode[0];
			unset($this->explode[0]);
			$this->setExplode($this->explode);
		} else {
			$this->action = env('APP_DEFAULT_ACTION');
		}
	}

	public function getAction()
	{
		return $this->action;
	}

	private function setParams()
	{
		$i = 0;
		$key = '';
		$this->params = [];
		foreach ($this->explode as $e) {
			if ($i % 2 == 0) {
				$key = $e;
			} else {
				$this->params[$key] = $e;
			}
			$i++;
		}
	}

	private function arrangeControllerAction()
	{
		$this->final_controller = 'App\\Controllers\\' . implode('', array_map(function ($a) {
			return ucwords($a);
		}, explode('-', $this->controller)));

		$this->final_action = $this->action . '-action';
		$this->final_action = array_map(function ($a) {
			return ucwords($a);
		}, explode('-', $this->action . '-action'));
		$this->final_action[0] = strtolower($this->final_action[0]);
		$this->final_action = implode('', $this->final_action);
	}

	// public function route($path, $callback)
	// {
	// 	$this->routes[] = [
	// 		'path' => $path,
	// 		'callback' => $callback,
	// 	];
	// }

	public function start()
	{
		// Estanciamos a Controller
		$Controller = new $this->final_controller($this);

		// Verificamos se a Action existe
		if (method_exists($Controller, $this->final_action)) {
			$action = $this->final_action;
			$Controller->$action($this->params);
			return;
		}

		// Erro 404
		// TODO: Chamar uma página amigável para essa mensagem de erro
		die('Rota não encontrada!');

		// foreach ($this->routes as $route) {
		// 	$original_regex = $route['path'];
		// 	preg_match_all("/\{([A-Za-z0-9\_\.\-]+)\}/", $original_regex, $regex_vars);
		// 	$clear_regex = preg_replace("/\{([A-Za-z0-9\_\.\-]+)\}/", "{*}", $original_regex);
		// 	$quote_regex = preg_quote($clear_regex, '/');
		// 	$complete_regex = '/^' . str_replace('\{\*\}', '([A-Za-z0-9\_\.\-]+)', $quote_regex) . '$/';
		// 	preg_match($complete_regex, $this->url, $output_array);

		// 	if (!empty($output_array)) {
		// 		unset($output_array[0]);
		// 		$output_array = array_values($output_array);
		// 		$args = array_combine($regex_vars[1], $output_array);
		// 		$route['callback']($args);
		// 		break;
		// 	}
		// }
	}
}
