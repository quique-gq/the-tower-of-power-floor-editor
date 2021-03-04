var THE_TOWER_OF_POWER_MAP_EDITOR = function () {
  'use strict';

  var canvas = document.createElement('canvas');
  var stage = canvas.getContext('2d');
  var info = {
    version: 'v0.1-20210304-1037est',
    authors: ['Literal Line'],
    width: 224,
    height: 288,
    bg: '#000000',
    aa: false,
    fps: 60
  };

  var controls = {};

  var PAUSE;
  var setPause = function (bool) {
    if (bool) {
      PAUSE = true;
      keys = {};
      for (var a in playing) playing[a].pause();
    } else {
      PAUSE = false;
      for (var a in playing) playing[a].play();
    }
  };

  var keys = {};
  var initEventListeners = function () {
    var resize = function () {
      canvas.style.height = window.innerHeight + 'px';
      canvas.style.width = window.innerHeight * (7 / 9) + 'px';
      canvas.style.paddingTop = '0';
      if (parseInt(canvas.style.width) > window.innerWidth) {
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerWidth * (9 / 7) + 'px';
        canvas.style.paddingTop = window.innerHeight / 2 - parseInt(canvas.style.height) / 2 + 'px';
      }
    };
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    window.addEventListener('keydown', function (e) {
      for (var c in controls) if (controls[c] === e.code) e.preventDefault();
      keys[e.code] = true;
    });
    window.addEventListener('keyup', function (e) {
      delete keys[e.code];
    });
    window.addEventListener('blur', function () { setPause(true); });
    window.addEventListener('focus', function () { setPause(false); });

    resize();
  };

  var initCanvas = function () {
    canvas.width = info.width;
    canvas.height = info.height;
    canvas.style.background = info.bg;
    canvas.style.display = 'block';
    canvas.style.margin = 'auto';
    canvas.style.imageRendering = info.aa ? 'auto' : 'pixelated';
    canvas.style.imageRendering = info.aa ? 'auto' : '-moz-crisp-edges';
    stage.imageSmoothingEnabled = info.aa;
  };

  var initHelp = function () {
    var helpBtn = document.createElement('button');
    var helpPopup = document.createElement('div');
    var pauseLoop;
    helpPopup.innerHTML =
      '<div>' +
      '<h1 style="float: left">Help</h1>' + '<img style="float: right; transform: translateX(2px)" width="52px" height="52px" src="./assets/iconHelp.png">' +
      '<hr style="border: 1px solid #FFFFFF; clear: both"></hr>' +
      '</div>' +
      '<div style="height: 85%; overflow-y: auto">' +
      '<h2 style="float: left">Controls</h2>' + '<img style="float: right" width="46px" height="46px" src="./assets/iconControls.png">' +
      '<ul style="clear: both">' +
      '<li>Directional: Arrow keys</li>' +
      '<li>Attack: Left ctrl</li>' +
      '<li>Insert coin: Right shift</li>' +
      '<li>Player 1 start: Enter</li>' +
      '<ul>' +
      '</div>';
    helpBtn.style = 'background: #000066 url(\'./assets/iconHelp.png\'); background-size: cover; opacity: 0.3333; border: 2px outset #3333FF; position: fixed; width: 52px; height: 52px; bottom: 5px; right: 5px; outline: none; image-rendering: pixelated';
    helpPopup.style = 'background: #000030; opacity: 0.75; border: 1px solid #FFFFFF; border-radius: 5px; padding: 25px; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 75vw; height: 75vh; color: #FFFFFF; image-rendering: pixelated';
    helpBtn.classList.add('btn3d');
    helpPopup.classList.add('hidden');
    helpBtn.onclick = function () {
      helpPopup.classList.toggle('hidden');
      if (Array.prototype.slice.call(helpPopup.classList).indexOf('hidden') === -1) {
        pauseLoop = setInterval(function () { setPause(true); }, 1);
      } else {
        clearInterval(pauseLoop);
        setPause(false);
      }
      this.blur();
    };
    document.body.insertAdjacentElement('afterbegin', helpBtn);
    document.body.insertAdjacentElement('afterbegin', helpPopup);
  };

  var init = function () {
    initEventListeners();
    initHelp();
    initCanvas();
    document.body.insertAdjacentElement('afterbegin', canvas);
    console.log('the-tower-of-power ' + info.version);
    console.log('by ' + info.authors);
    requestAnimationFrame(game.loop);
    setInterval(function () { assets.audio.silence.play(); }, 1000 / 60);
  };

  var playing = {};

  var GameAudio = function (src) {
    this.audio = document.createElement('audio');
    this.audio.src = src;
    this.audio.volume = 0.5;
    this.loop = false;
    var self = this;
    this.audio.addEventListener('ended', function () {
      if (self.loop) {
        self.audio.play();
      } else {
        delete playing[self.audio.src];
      }
    });
  };

  GameAudio.prototype.play = function (time) {
    playing[this.audio.src] = this.audio;
    if (typeof time !== 'undefined') {
      this.audio.pause();
      this.audio.currentTime = time;
    }
    this.audio.play();
  };

  GameAudio.prototype.stop = function () {
    this.audio.pause();
    this.audio.currentTime = 0;
    delete playing[this.audio.src];
  };

  CanvasRenderingContext2D.prototype.textChars = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
    'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', ' ', '!', '\'', '*', '-', '.', ':', '='
  ];
  CanvasRenderingContext2D.prototype.drawText = function (obj) {
    var t = obj.text.toString().toUpperCase();
    var c = obj.color % Math.floor(assets.textures.font.height / 24);
    var x = obj.x;
    var y = obj.y;
    for (var i = 0; i < t.length; i++) {
      var char = this.textChars.indexOf(t.charAt(i));
      this.drawImage(assets.textures.font, char % 28 * 8, Math.floor(char / 28) * 8 + c * 24, 8, 8, (x + i) * 8, y * 8, 8, 8);
    }
  };

  var assets = {
    textures: {
      font: createTexture('./assets/font.png'),
      tilesFloor: createTexture('./assets/tilesFloor.png')
    },
    audio: {
      silence: new GameAudio('assets/5-seconds-of-silence.mp3')
    }
  };

  var game = (function () {
    var STATE = 'editor';
    var timer = 0;

    var editor = (function () {
      var lCanvas = document.createElement('canvas');
      var lStage = lCanvas.getContext('2d');
      lCanvas.width = info.width;
      lCanvas.height = info.height;
      var lTimer = 20000;

      lStage.drawText({ text: 'red', color: 3, x: 0, y: 0 });
      lStage.drawText({ text: 'green', color: 12, x: 3, y: 3 });
      lStage.drawText({ text: 'blue', color: 13, x: 6, y: 6 });
      lStage.drawText({ text: 'ok', color: 0, x: 0, y: 12 });

      return function () {
        lStage.drawText({ text: lTimer, color: 0, x: 9, y: 9 });
        stage.drawImage(lCanvas, 0, 0);
        if (timer % 2) lTimer -= 10;
      }
    })();

    var delta = 0;
    var then = 0;
    var interval = 1000 / info.fps;

    return {
      loop: function (now) {
        if (!then) then = now;
        requestAnimationFrame(game.loop);
        delta = now - then;

        if (delta > interval) {
          if (!PAUSE) {
            canvas.style.filter = 'brightness(100%)';
            stage.clearRect(0, 0, canvas.width, canvas.height);
            switch (STATE) {
              case 'editor':
                editor();
                break;
              default:
                throw ('Error: requested state does not exist!');
            }
            timer++;
          } else {
            canvas.style.filter = 'brightness(33.33%)';
            stage.drawText({ text: 'paused', color: 0, x: 11, y: 17 });
          }
          then = now - (delta % interval);
        }
      }
    }
  })();

  return {
    init: init,
    clickToBegin: function () {
      var initCSS = function () {
        var stylesheet = document.styleSheets[0];
        var rules = [
          '@font-face { font-family: "Arcade"; src: url(\'./assets/arcade_n.ttf\'); }',
          'body { margin: 0; overflow: hidden; }',
          'div { font-family: "Arcade"; font-size: 16px; }',
          'h1, h2, h3, h4, h5, h6 { font-style: italic; }',
          'h1, h2 { padding: 10px; margin: 0; }',
          'ul { padding-left: 40px; }',
          'li { padding: 2px; }',
          'div, button { -webkit-user-select: none; -moz-user-select: none; user-select: none; user-select: none; }',
          '.btn3d:active { border-style: inset !important; }',
          '.btn3d:hover { opacity: 1 !important; }',
          '.hidden { display: none; }'
        ];
        rules.forEach(function (cur) { stylesheet.insertRule(cur); });
      };

      var btn = document.createElement('button');
      btn.style = 'padding: 10px; border: 1px solid #FFFFFF; border-radius: 3px; background: #000000; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); outline: none; font-family: "Courier New"; font-size: 3vw; color: #FFFFFF';
      btn.innerHTML = 'Click to begin';
      btn.onclick = function () { THE_TOWER_OF_POWER_MAP_EDITOR().init(); btn.remove(); };
      initCSS();
      document.body.appendChild(btn);
    }
  }
};


// misc functions

function rndInt(max) {
  return Math.floor(Math.random() * max);
}

function repeatChar(char, amt) {
  return new Array(amt + 1).join(char);
}

function requestText(url, callback) {
  var r = new XMLHttpRequest();
  r.open('GET', url);
  r.onload = function () { callback(r.responseText); };
  r.send();
};

function createTexture(src) {
  var img = document.createElement('img');
  img.src = src;
  return img;
}

function convertBase(value, fromBase, toBase) {
  var range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
  var fromRange = range.slice(0, fromBase);
  var toRange = range.slice(0, toBase);

  var decValue = value.split('').reverse().reduce(function (carry, digit, index) {
    if (fromRange.indexOf(digit) === -1) throw new Error('Invalid digit `' + digit + '` for base ' + fromBase + '.');
    return carry += fromRange.indexOf(digit) * (Math.pow(fromBase, index));
  }, 0);

  var newValue = '';
  while (decValue > 0) {
    newValue = toRange[decValue % toBase] + newValue;
    decValue = (decValue - (decValue % toBase)) / toBase;
  }
  return newValue || '0';
}
