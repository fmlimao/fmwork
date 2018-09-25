<h1>Home Index</h1>

<ul>
    <?php foreach ($users as $user) : ?>
        <li><?php printa($user->name); ?></li>
    <?php endforeach; ?>
</ul>
