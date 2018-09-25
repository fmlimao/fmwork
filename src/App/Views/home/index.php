<h1>Home Index</h1>

<p>
    <a href="<?php echo env('APP_PATH'); ?>home/logout">[Sair]</a>
</p>

<h3>Lista de Usuários</h3>

<ul>
    <?php foreach ($users as $user) : ?>
        <li><?php printa($user->name); ?></li>
    <?php endforeach; ?>
</ul>
