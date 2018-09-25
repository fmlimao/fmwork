<h1>Home Index</h1>

<p>Token = <?php echo $token; ?></p>

<h3><?php printa($user); ?></h3>

<ul>
    <?php foreach ($users as $user) : ?>
        <li><?php printa($user); ?></li>
    <?php endforeach; ?>
</ul>