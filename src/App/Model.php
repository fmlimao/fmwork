<?php

namespace App;

class Model
{
    // Aqui ficarão todos os atributos do objeto
    protected $data = [];

    public function __construct($id = null)
    {
        // Se o ID for passado no construtor, faremos a busca por elle
        if ($id) {
            $response = $this->search([
                'where' => 'id = ' . $id,
            ]);

            if (!empty($response)) {
                $current_obj = $response[0];

                // Populamos o objeto
                foreach ($current_obj as $key => $value) {
                    $this->$key = $value;
                }
            }
        }
    }

    // Método que recebe os "sets" do objeto e manda esse valor para o $data
    public function __set($key, $value)
    {
        $this->data[$key] = $value;
    }

    // Método que retorna o valor do $data
    public function __get($key)
    {
        return isset($this->data[$key]) ? $this->data[$key] : null;
    }

    // Metodo que retorna todos os registros
    public function getAll()
    {
        $response = $this->search();

        // retorna lista
        $list = [];
        foreach ($response as $current_obj) {
            $class_name = __CLASS__;
            $obj = new $class_name(null);
            foreach ($current_obj as $key => $value) {
                $obj->$key = $value;
            }
            $list[] = $obj;
        }
        return $list;
    }

    // Método que busca os registos no banco (pode passar filtros)
    public function search($args = [])
    {
        global $conn;

        $query = "SELECT * FROM " . $this->table;

        $query_args = [];
        if (isset($args['where'])) {
            if (is_string($args['where']) && trim($args['where']) != '') {
                $query .= " WHERE " . trim($args['where']);
            } else if (is_array($args['where']) && !empty($args['where'])) {
                $where = $args['where'][0];
                unset($args['where'][0]);
                $query_args = array_values($args['where']);
                $query .= " WHERE " . $where;
            }
        }

		$rs = $conn->prepare($query);
		$rs->execute($query_args);
        $response = $rs->fetchAll(\PDO::FETCH_ASSOC);

        return $response;
    }

    // Método que salva novos registros e registros existentes
    public function save()
    {
        global $conn;

        if (!isset($this->data['id'])) {
            $query = "INSERT INTO " . $this->table;
            $query .= " (" . implode(', ', array_keys($this->data)) . ")";
            $query .= " VALUES (" . implode(', ', array_map(function ($a) {
                return ':' . $a;
            }, array_keys($this->data))) . ");";

            $rs = $conn->prepare($query);
            $rs->execute($this->data);

            $id = $conn->lastInsertId();

            $response = $this->search([
                'where' => 'id = ' . $id,
            ]);

            if (!empty($response)) {
                $this->data = [];
                $current_obj = $response[0];

                // criar o objeto
                foreach ($current_obj as $key => $value) {
                    $this->$key = $value;
                }
            }
        } else {
            $id = $this->data['id'];
            unset($this->data['id']);

            $query = "UPDATE " . $this->table;
            $query .= " SET " . implode(', ', array_map(function ($a) {
                return $a . ' = :' . $a;
            }, array_keys($this->data)));
            $query .= " WHERE id = :id";

            $this->data['id'] = $id;

            $rs = $conn->prepare($query);
            $rs->execute($this->data);

            $response = $this->search([
                'where' => 'id = ' . $id,
            ]);

            if (!empty($response)) {
                $this->data = [];
                $current_obj = $response[0];

                // criar o objeto
                foreach ($current_obj as $key => $value) {
                    $this->$key = $value;
                }
            }
        }
    }

    // Método que remove o registro do banco
    public function delete()
    {
        if (isset($this->data['id'])) {
            global $conn;

            $query = "DELETE FROM " . $this->table . " WHERE id = :id";

            $rs = $conn->prepare($query);
            $rs->execute([
                'id' => $this->data['id'],
            ]);

            $this->data = [];
        }
    }
}
