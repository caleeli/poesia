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
      manual: false,
      tiempoPermanencia: 9,
      tiempoContinuo: 3,
      tiempoRetraso: 0, //preview
      tiempoRetrasoAudio: 1, //preview
      poeta: '',
      poema: '',
      fondo: '',
      frente: '',
      verso: '',
      started: false,
      t0: null,
      events: [],
      times: [],
      words: [],
      recognized: [],
      lines: [],
      animacion: [],
      audioUrl: null,
      mediaRecorder: null,
      current: {text: [], listen: []},
    };
  },
  methods: {
    endLine() {
      let i = Math.max(0, this.times.length - 1);
      const line = this.words[i].line;
      const t = (new Date().getTime() - this.t0) / 1000;
      console.log(this.lines[line]);
      while(i < this.words.length) {
        this.times[i] = t;
        this.recognized[i] = this.words[i].word;
        if (this.words[i].last) {
          i++;
          this.times[i] = t;
          this.recognized[i] = this.words[i].word;
            break;
        }
        i++;
      }
    },
    save() {
      const bodyFormData = new FormData();
      bodyFormData.set('recognized', JSON.stringify(this.recognized));
      bodyFormData.set('times', JSON.stringify(this.times));
      bodyFormData.set('audioUrl', JSON.stringify(this.audioUrl));
      axios.post('save.php' + location.search, bodyFormData).then((res) => {
        console.log(res);
      });
    },
    estilo(w, i) {
      if (!this.recognized[i]) return 'span';
      if (this.recognized[i].toLowerCase() == w.word.toLowerCase()) return 'b';
      return 'u';
    },
    play() {
      this.t0 = new Date().getTime();
      this.animacion.splice(0);
      this.paint();
      setTimeout(() => {
        const audio = new Audio(this.audioUrl);
        audio.play();
      }, this.tiempoRetrasoAudio * 1000);
    },
    paint() {
      const t = (new Date().getTime() - this.t0) / 1000 - this.tiempoRetraso;
      const text = [];
      const listen = [];
      let t_p = null, line = '';
      this.times.forEach((t_i, i) => {
        if (t_i < t && t_i >= t - this.tiempoPermanencia) {
          if (t_p && t_i - t_p > this.tiempoContinuo) {
            text.splice(0);
            listen.splice(0);
          }
          if (this.words[i]) {
            text.push(this.words[i].word);
            listen.push(this.recognized[i]);
            const isLast = this.words[i].last;
            const word = this.words[i + (isLast ? 1 : 0)];
            line = word && this.lines[word.line] || '';
          }
          t_p = t_i;
        }
      });
      this.current.text = text;
      this.current.listen = listen;
      this.verso = (!line && t < 5 - this.tiempoRetraso) || !this.times.length ? this.lines[this.words[0].line] :  line;
    },
    startVoice() {
      this.started = !this.started;
      if (this.started) {
        recognition.start()
        this.t0 = new Date().getTime();
        this.times.splice(0);
        this.recognized.splice(0);
        // record audio
        this.mediaRecorder = new MediaRecorder(this.stream);
        const audioChunks = [];
        this.mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });
        this.mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onload = () => {
            this.audioUrl = reader.result.replace('application/octet-stream', 'audio/wav');
          };
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
      words.forEach((word, index) => {
        if (this.times[index] === undefined) {
          this.times.push(t);
          this.recognized.push(word);
        } else {
          this.recognized[index] = word;
        }
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
    preparePoema() {
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
    },
  },
  mounted() {
    axios.get('poemas.php' + location.search).then((res) => {
      Object.keys(res.data).forEach(key => {
        this[key] = res.data[key];
      });
      this.preparePoema();
    });
    recognition.onresult = (event) => {
      if (!this.manual) {
        this.recognition(event);
      }
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
  watch: {
    verso(verso) {
      const last = this.animacion.length && this.animacion[this.animacion.length-1];
      if (last != verso) this.animacion.push(verso);
    },
  },
});
