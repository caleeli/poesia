<?php

$poemas = [
    [
        'titulo' => 'primavera',
        'poeta' => 'ARMANDO CHIRVECHES',
        'poema' => file_get_contents('textos/primavera.txt'),
        'fondo' => '',
        'frente' => 'poetas/armando_chirveches.png',
    ],
    [
        'titulo' => 'la muerte por el tacto',
        'poeta' => 'Jaime Sáenz',
        'poema' => file_get_contents('textos/la_muerte_por_el_tacto.txt'),
        'fondo' => 'fondos/la_muerte_por_el_tacto.jpg',
        'frente' => 'poetas/la_muerte_por_el_tacto.png',
    ],
];
