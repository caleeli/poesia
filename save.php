<?php
//data:audio/wav;base64,
$file = "saves/" . intval($_REQUEST['p']) . '.json';
$data = $_POST;
foreach ($data as $k => $v) {
  $data[$k] = json_decode($v);
}
file_put_contents($file, json_encode($data));
