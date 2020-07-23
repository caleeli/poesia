var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'es-ES';
recognition.interimResults = true;
//recognition.maxAlternatives = 1;

const app = new Vue({
  el: "#app",
  data() {
    return {
      tiempoPermanencia: 6,
      tiempoContinuo: 1,
      tiempoRetraso: -1, //preview
      poema: `
      Octubre
      
      Estaba echado yo en la tierra, enfrente
      el infinito campo de Castilla,
      que el otoño envolvía en la amarilla
      dulzura de su claro sol poniente.
      
      Lento, el arado, paralelamente
      abría el haza oscura, y la sencilla
      mano abierta dejaba la semilla
      en su entraña partida honradamente
      
      Pensé en arrancarme el corazón y echarlo,
      pleno de su sentir alto y profundo,
      el ancho surco del terruño tierno,
      a ver si con partirlo y con sembrarlo,
      
      la primavera le mostraba al mundo
      el árbol puro del amor eterno.
      `,
      verso: '',
      started: false,
      t0: null,
      events: [],
      times: [],
      words: [],
      lines: [],
      animacion: [],
      audioUrl: null,
      mediaRecorder: null,
    };
  },
  methods: {
    play() {
      const audio = new Audio(this.audioUrl);
      audio.play();
    },
    paint() {
      const t = (new Date().getTime() - this.t0) / 1000 - this.tiempoRetraso;
      const text = [];
      let t_p = null, line = '';
      this.times.forEach((t_i, i) => {
        if (t_i < t && t_i >= t - this.tiempoPermanencia) {
          if (t_p && t_i - t_p > this.tiempoContinuo) {
            text.splice(0);
          }
          if (this.words[i]) {
            text.push(this.words[i].word);
            const isLast = this.words[i].last;
            const word = this.words[i + (isLast ? 1 : 0)];
            line = word && this.lines[word.line] || '';
          }
          t_p = t_i;
        }
      });
      this.verso = this.times.length ? line : this.lines[this.words[0].line];
    },
    startVoice() {
      this.started = !this.started;
      if (this.started) {
        recognition.start()
        this.t0 = new Date().getTime();
        this.times.splice(0);
        // record audio
        this.mediaRecorder = new MediaRecorder(this.stream);
        const audioChunks = [];
        this.mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });
        this.mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          this.audioUrl = URL.createObjectURL(audioBlob);
        });
        this.mediaRecorder.start();
      } else {
        this.mediaRecorder.stop();
        recognition.stop();
      }
    },
    recognition(event) {
      this.events.push(event);
      const words = this.getEventWords(event);
      const t = (new Date().getTime() - this.t0) / 1000;
      const res = [];
      words.forEach((word, index) => {
        if (this.times[index] === undefined) {
          this.times.push(t);
        }
        res.push(`${this.times[index]}: ${word}`);
      });
      this.paint();
    },
    getEventWords(event) {
      const text = [];
      for(let i=0, l=event.results.length; i<l; i++) {
        text.push(event.results[i][0].transcript);
      };
      return this.getWords(text.join(' '));
    },
    getWords(text) {
      return text.trim().split(/[^\wáéíóúñ]+/i);
    },
  },
  watch: {
    verso(verso) {
      this.animacion.push(verso);
    },
  },
  mounted() {
    let word = '', line = 0, lineText = '';
    const text = this.poema.split('\r\n').join('\n');
    [...text].forEach(c => {
      if (c.match(/[\wáéíóúñ]/)) {
        word = word + c;
      } else {
        if (word) {
          this.words.push({word, line, last: false});
          word = '';
        }
      }
      if (c == '\n') {
        if (this.words.length) {
          this.words[this.words.length - 1].last = true;
        }
        this.lines.push(lineText);
        line++;
        lineText = '';
      } else {
        lineText += c;
      }
    })
    recognition.onresult = (event) => {
      this.recognition(event);
    }
    setInterval(() => {
      this.paint();
    }, 100);

    // audio recorder
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      this.stream = stream;
    });
  },
});
