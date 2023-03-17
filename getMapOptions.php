<?php
$gameMode = $_GET["gameMode"];
$mapDir = "Map Images/" . $gameMode;
$mapOptions = array_diff(scandir($mapDir), array('..', '.')); // read the contents of the directory and remove the . and .. entries
echo json_encode($mapOptions);
?>