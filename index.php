<?php
  require_once 'vendor/autoload.php';
  require_once 'mix.php';

   /* $path = 'https://www.gazetakrot.ru/images/jc_answers/2018/krot_japan_crossword_week_2018_45_4.png';//__DIR__."/public/images/men.jpg";
    list($width, $height) = getimagesize($path);
    $im = imagecreatefrompng($path);
    $txt = [];
    $json = fopen(__DIR__."/public/images/x.json", "w");
    for($y = 0; $y <  $height; $y++){
        for($x = 0; $x < $width; $x++){
            $txt[$y][$x] = getColorJson($x, $y);
        }
    }
    fwrite($json, json_encode($txt));
    fclose($json);*/

function getColorJson($x, $y){
    global $im;
    $rgb = imagecolorat($im, $x, $y);
    $r = ($rgb >> 16) & 0xFF;
    $g = ($rgb >> 8) & 0xFF;
    $b = $rgb & 0xFF;
    $gs = ($r+$g+$b) /3 ;

    return $gs < 50 ? 1 : 0;
}
   function getColor($x, $y){
       global $im;
       $rgb = imagecolorat($im, $x, $y);
       $r = ($rgb >> 16) & 0xFF;
       $g = ($rgb >> 8) & 0xFF;
       $b = $rgb & 0xFF;
       $gs = ($r+$g+$b) /3 ;
       $gs = $gs < $_GET['d']? $gs : 255;
       return " $gs,  $gs,  $gs";//"$r, $g, $b";//
   }
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Demo</title>
    <link rel="stylesheet" href="<?php echo mix('css/app.css'); ?>" />
  </head>

  <body>

    <div id="app">
        <my-table :img="img" >
            <my-canvas style="width: 500px; height: 500px;" :img="img">

            </my-canvas>
        </my-table>

    </div>


    <script src="<?php echo mix('js/app.js'); ?>"></script>

    <script src="http://localhost:35729/livereload.js"></script>

  </body>
</html>
