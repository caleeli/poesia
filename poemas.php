<?php

require 'info.php';

$i = $_GET['p'] ?? 0;

header('Content-type: application/json');
echo json_encode($poemas[$i]);
