<h1>Login</h1>

<form action="<?php echo env('APP_PATH'); ?>home/login" method="post">
    <input type="hidden" name="act" value="login">

    <?php foreach ($error_message as $message) : ?>
        <p style="color: #c00;"><?php echo $message; ?></p>
    <?php endforeach; ?>

    <p>
        <label for="iptUser">Usuário</label>
        <br>
        <input type="text" id="iptUser" name="user" value="<?php echo $user; ?>">
    </p>

    <p>
        <label for="iptPassword">Senha</label>
        <br>
        <input type="password" id="iptPassword" name="password" value="<?php echo $password; ?>">
    </p>

    <p>
        <button type="submit">Entrar</button>
    </p>
</form>