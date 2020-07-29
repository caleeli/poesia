<?php

$poemas = [
    [
        'poeta' => 'Jaime Sáenz',
        'poema' => file_get_contents('textos/la_muerte_por_el_tacto.txt'),
        'fondo' => 'fondos/la_muerte_por_el_tacto.jpg',
        'frente' => 'poetas/la_muerte_por_el_tacto.png',
    ]
];

header('Content-type: application/json');
echo json_encode($poemas[0]);
