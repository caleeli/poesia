<?php

$poemas = [
    [
        'titulo' => 'primavera',
        'poeta' => 'ARMANDO CHIRVECHES',
        'poema' => file_get_contents('textos/primavera.txt'),
        'fondo' => 'fondos/laguna.jpg',
        'frente' => 'poetas/armando_chirveches.png',
        'audioUrl' => 'audios/Primavera.m4a',
    ],
    [
        'titulo' => 'la muerte por el tacto',
        'poeta' => 'Jaime Sáenz',
        'poema' => file_get_contents('textos/la_muerte_por_el_tacto.txt'),
        'fondo' => 'fondos/la_muerte_por_el_tacto.jpg',
        'frente' => 'poetas/la_muerte_por_el_tacto.png',
    ],
    [
        'titulo' => 'la muerte por el tacto (parte 2)',
        'poeta' => 'Jaime Sáenz',
        'poema' => file_get_contents('textos/la_muerte_por_el_tacto_2.txt'),
        'fondo' => 'fondos/la_muerte_por_el_tacto.jpg',
        'frente' => 'poetas/la_muerte_por_el_tacto.png',
        'audioUrl' => 'audios/LaMuertePorElTacto2.mp3',
        'tiempoRetrasoAudio' => 1,
    ],
    [
        'titulo' => 'Habla Olimpo',
        'poeta' => 'Franz Tamayo',
        'poema' => file_get_contents('textos/habla_olimpo.txt'),
        'fondo' => 'fondos/illimani.jpg',
        'frente' => 'poetas/franz_tamayo.png',
        'audioUrl' => 'audios/Habla_Olimpo.mp3',
        'tiempoRetrasoAudio' => 0.5,
    ],
    [
        'titulo' => 'Rebelión',
        'poeta' => 'Yolanda Bedregal',
        'poema' => file_get_contents('textos/rebelion.txt'),
        'fondo' => 'fondos/pajabrava.jpg',
        'frente' => 'poetas/Yolanda_Bedregal.png',
        'audioUrl' => 'audios/Rebelion.mp3',
        'tiempoRetrasoAudio' => 0.5,
    ],
];

foreach (glob("saves/*.json") as $file) {
    $i = intval(basename($file, '.json'));
    $json = json_decode(file_get_contents($file));
    foreach ($json as $k => $v) {
        if (!($k === 'audioUrl' && isset($poemas[$i][$k]))) {
            $poemas[$i][$k] = $v;
        }
    }
}
