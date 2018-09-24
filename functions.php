<?php

function printa($v, $dump = 0)
{
	echo '<pre>';
	if ($dump) {
		var_dump($v);
	} else {
		print_r($v);
	}
	echo '</pre>';
}

function env($key)
{
	foreach (parse_ini_file(__DIR__ . '/.env') as $k => $v) {
		if ($k == $key) return $v;
	}
	return null;
}
