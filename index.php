<?php
require 'info.php';
?>
<html>

<head>
    <meta charset="UTF-8">
    <!-- Required Stylesheets -->
    <link rel="icon" type="image/png" href="favicon.png">
    <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap/dist/css/bootstrap.min.css" />
    <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.css" />

    <!-- Required scripts -->
    <script src="https://unpkg.com/vue"></script>
    <script src="https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.js"></script>
</head>

<body>
    <div id="app" class="">
        <?php foreach ($poemas as $i => $poema): ?>
            <a class="btn btn-lg btn-info text-capitalize" href="poema.php?p=<?=$i?>">
                <?=$poema['titulo']?><br>
                <label class="badge badge-info"><?=$poema['poeta']?></label>
            </a>
        <?php endforeach; ?>
    </div>
</body>

</html>
