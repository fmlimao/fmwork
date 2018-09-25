<?php

namespace App;

class Model
{
    protected $data = [];

    public function __construct($id = null)
    {
        if ($id) {
            $response = $this->search([
                'where' => 'id = ' . $id,
            ]);

            if (!empty($response)) {
                $current_obj = $response[0];

                // criar o objeto
                foreach ($current_obj as $key => $value) {
                    $this->setAttribute($key, $value);
                }
            }
        }
    }

    public function getAll()
    {
        $response = $this->search();

        // retorna lista
        $list = [];
        foreach ($response as $current_obj) {
            $class_name = __CLASS__;
            $obj = new $class_name(null);
            foreach ($current_obj as $key => $value) {
                $obj->setAttribute($key, $value);
            }
            $list[] = $obj;
        }
        return $list;
    }

    public function search($args = [])
    {
        global $conn;

        $query = "SELECT * FROM " . $this->table;

        if (isset($args['where'])) {
            $query .= " WHERE " . $args['where'];
        }

		$rs = $conn->prepare($query);
		$rs->execute();
        $response = $rs->fetchAll(\PDO::FETCH_ASSOC);

        return $response;
    }

    public function setAttribute($key, $value)
    {
        $this->data[$key] = $value;
    }

    public function save()
    {
        global $conn;

        if (!isset($this->data['id'])) {
            $query = "INSERT INTO " . $this->table;
            $query .= " (" . implode(', ', array_keys($this->data)) . ")";
            $query .= " VALUES (" . implode(', ', array_map(function ($a) {
                return ':' . $a;
            }, array_keys($this->data))) . ");";

            // printa($query);

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
                    $this->setAttribute($key, $value);
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
                    $this->setAttribute($key, $value);
                }
            }
        }
    }

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
