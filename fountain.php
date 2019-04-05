<?php
require_once 'vendor/autoload.php';
require_once 'mix.php';
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="<?php echo mix('css/app.css'); ?>" />
</head>
<body>
<div id="fountain">
    <canvas id="canvas" ref="my-canvas" ></canvas>
</div>


<script src="<?php echo mix('js/fountain.js'); ?>"></script>
<script src="http://localhost:35729/livereload.js"></script>
</body>
</html>