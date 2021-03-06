<html>

<head>
    <meta charset="UTF-8">
    <!-- Required Stylesheets -->
    <link rel="icon" type="image/png" href="favicon.png">
    <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap/dist/css/bootstrap.min.css" />
    <link type="text/css" rel="stylesheet" href="https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.css" />
    <link type="text/css" rel="stylesheet" href="app.css?<?=fileatime('app.css')?>" />
    <script src="https://kit.fontawesome.com/33f5bb9c45.js" crossorigin="anonymous"></script>

    <!-- Required scripts -->
    <script src="https://unpkg.com/vue"></script>
    <script src="https://unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js"></script>
</head>

<body>
    <div id="app" class="d-flex flex-row justify-content-between">
        <div>
            <div class="viewport">
                <img v-if="fondo" :src="`${fondo}?${new Date().getTime()}`" class="fondo">
                <iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""
                    src="https://www.youtube-nocookie.com/embed/MwG1efUj3JM?autoplay=1" class="video" width="793"
                    height="446" frameborder="0"></iframe>
                <img v-if="frente" :src="`${frente}?${new Date().getTime()}`" class="frente">
                <img src="images/border-4.svg" class="border-1">
                <img src="images/floral-border.svg" class="floral-border">
                <div class="texto-poema">
                    <transition-group name="list" tag="p">
                        <div v-for="(item,key) in animacion" v-bind:key="`verso-${key}`" class="list-item">{{ item.replace('ññ', '') }}</div>
                    </transition-group>
                </div>
                <div class="texto-poeta">
                    {{ poeta }}
                </div>
            </div>
        </div>
        <div class="flex-grow-1 d-flex flex-column">
            <div>
                <button class="btn btn-danger" @click="startVoice">
                <i v-if="started" class="fas fa-stop"></i>
                <i v-else class="fas fa-circle"></i>
                    {{ started ? 'PARAR' : 'GRABAR' }}
                </button>
                <button class="btn btn-success" @click="play" :disabled="!audioUrl">PLAY</button>
                <button class="btn btn-primary" @click="save" :disabled="!audioUrl">SAVE</button>
                <button class="btn btn-primary" @click="endLine" :disabled="!started">ENDLINE</button>
                <input type="checkbox" v-model="manual"> Avance Manual
            </div>
            <div class="palabras-poema">
                <component
                    v-for="(w,i) in words"
                    :key="`wl-${i}`"
                    :is="estilo(w,i)"
                    :title="recognized[i]"
                >
                    {{ w.word }}<br v-if="w.last" />
                </component>
            </div>
        </div>
    </div>
    <script src="app.js?<?=fileatime('app.js')?>"></script>
</body>

</html>