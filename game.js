window.onload = function () {
  var tileSize = 80
  var tileSizeScreen = 160
  var numRows = 4
  var numCols = 5
  var tileSpacing = 10
  var localStorageName = 'crackalien'
  var highScore
  var tilesArray = []
  var selectedArray = []
  var soundButton
  var playSound = true
  var screenButton
  var score
  var timeLeft
  var tilesLeft
  var checked
  var delay = 0
  var delayEvent
  var game = new Phaser.Game(1280, 720)
  // game.load.image('background', 'assets/sprites/background.jpg')
  // game.add.image(0, 0, 'background')

  var playGame = function (game) {}
  playGame.prototype = {
    scoreText: null,
    timeText: null,
    soundArray: [],
    preload: function () {
      game.load.image('textPoints', 'assets/sprites/textPoints.png')
      game.load.spritesheet('tiles', 'assets/sprites/tiles.png', tileSize, tileSize)
    },
    create: function () {
      // console.log(game.world.centerX)
      // console.log(game.world.centerY)
      score = 0
      timeLeft = 60
      this.checked = true
      // add.image(x, y, key)
      // game.add.image(0, 0, 'tiles')
      var background = game.add.sprite(-65, -30, 'background')
      background.width = game.width + 115
      background.height = game.height + 50
      var textpoints = game.add.sprite(110, 85, 'textPoints')
      textpoints.anchor.set(0.5)
      textpoints.width = 200
      textpoints.height = 150
      textpoints = game.add.sprite(game.width - 110, 85, 'textPoints')
      textpoints.anchor.set(0.5)
      textpoints.width = 200
      textpoints.height = 150
      this.placeTiles()
      // console.log("That's my awesome game")
      function handleIncorrect () {
        if (!game.device.desktop) {
          counter.timer.pause()
          document.getElementById('turn').style.display = 'block'
        }
      }

      function handleCorrect () {
        if (!game.device.desktop) {
          counter.timer.resume()
          document.getElementById('turn').style.display = 'none'
        }
      }
      game.scale.forceOrientation(true, false)
      game.scale.enterIncorrectOrientation.add(handleIncorrect)
      game.scale.leaveIncorrectOrientation.add(handleCorrect)
      if (playSound) {
        this.soundArray[0] = game.add.audio('select', 1)
        this.soundArray[1] = game.add.audio('right', 1)
        this.soundArray[2] = game.add.audio('wrong', 1)
      }
      var style = {
        fontSize: '50px',
        align: 'center',
        boundsAlignH: 'center'
      }
      this.scoreText = game.add.text(110, 92, 'SCORE\n' + score, style)
      this.scoreText.anchor.set(0.5)
      this.scoreText.lineSpacing = 7
      this.timeText = game.add.text(game.width - 110, 92, 'TIME\n' + timeLeft, style)
      this.timeText.anchor.set(0.5)
      this.timeText.lineSpacing = 7
      var counter = game.time.events.loop(Phaser.Timer.SECOND, this.decreaseTime, this) // Phaser.Timer.SECOND
    },
    placeTiles: function () {
      tilesLeft = numRows * numCols
      var leftSpace = (game.width - (numCols * tileSizeScreen) - ((numCols - 1) *
        tileSpacing)) / 2
      var topSpace = (game.height - (numRows * tileSizeScreen) - ((numRows - 1) *
        tileSpacing)) / 2
      for (var i = 0; i < numRows * numCols; i++) {
        tilesArray.push(Math.floor(i / 2))
      }
      for (i = 0; i < numRows * numCols; i++) {
        var from = game.rnd.between(0, tilesArray.length - 1)
        var to = game.rnd.between(0, tilesArray.length - 1)
        var temp = tilesArray[from]
        tilesArray[from] = tilesArray[to]
        tilesArray[to] = temp
      }
      // console.log('my tile values: ' + tilesArray)
      // console.log('1: ' + tilesArray[3])
      for (i = 0; i < numCols; i++) {
        for (var j = 0; j < numRows; j++) {
          // add.button(x, y, key, callback, callbackContext)
          var tile = game.add.button(leftSpace + i * (tileSizeScreen + tileSpacing), topSpace + j * (tileSizeScreen + tileSpacing), 'tiles', this.showTile, this)
          tile.frame = 10
          tile.width = tileSizeScreen
          tile.height = tileSizeScreen
          tile.value = tilesArray[j * numCols + i]
        // console.log(tile.value)
        }
      }
    },
    showTile: function (target) {
      if (selectedArray.length < 2 && selectedArray.indexOf(target) === -1) {
        if (playSound) {
          this.soundArray[0].play()
        }
        target.frame = target.value
        selectedArray.push(target)
      }
      if (selectedArray.length === 2 && this.checked === true) {
        this.checked = false
        game.time.events.add(500, this.checkTiles, this)
      }
    // console.log('this tile has value = ' + target.value)
    },
    checkTiles: function () {
      if (selectedArray[0].value === selectedArray[1].value) {
        if (playSound) {
          this.soundArray[1].play()
        }
        score++
        timeLeft += 2
        this.timeText.text = 'TIME\n' + timeLeft
        this.scoreText.text = 'SCORE\n' + score
        selectedArray[0].destroy()
        selectedArray[1].destroy()
        tilesLeft -= 2
        if (tilesLeft === 0) {
          tilesArray.length = 0
          selectedArray.length = 0
          this.placeTiles()
        }
      } else {
        if (playSound) {
          this.soundArray[2].play()
        }
        selectedArray[0].frame = 10
        selectedArray[1].frame = 10
      }
      selectedArray.length = 0
      this.checked = true
    },
    decreaseTime: function () {
      timeLeft--
      this.timeText.text = 'TIME\n' + timeLeft
      if (timeLeft === 0) {
        game.state.start('GameOver')
      }
    }
  }

  var titleScreen = function (game) {}
  titleScreen.prototype = {
    preload: function () {
      game.load.image('startIcon', 'assets/sprites/startLight.png')
      game.load.image('title', 'assets/sprites/MemoryLight.png')
    },
    create: function () {
      /*
      function gofull () {
        if (game.scale.isFullScreen) {
          game.scale.stopFullScreen()
        } else {
          game.scale.startFullScreen(false)
        }
      }*/
      game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT
      // var key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE)
      // key1.onDown.add(gofull, this)
      // game.input.onDown.add(gofull, this)
      game.scale.pageAlignHorizontally = true
      game.scale.pageAlignVertically = true
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
      // game.stage.disableVisibilityChange = true

      // Forzar girar pantalla
      function handleIncorrect () {
        if (!game.device.desktop) {
          document.getElementById('turn').style.display = 'block'
        }
      }

      function handleCorrect () {
        if (!game.device.desktop) {
          document.getElementById('turn').style.display = 'none'
        }
      }
      game.scale.forceOrientation(true, false)
      game.scale.enterIncorrectOrientation.add(handleIncorrect)
      game.scale.leaveIncorrectOrientation.add(handleCorrect)
      /*
      var style = {
        font: '48px Monospace',
        fill: '#00ff00',
        align: 'center'
      }
      var text = game.add.text(game.width / 2, game.height / 2 - 100, 'Crack Alien Code', style)
      text.anchor.set(0.5)
      */
      var background = game.add.sprite(-65, -30, 'background')
      background.width = game.width + 115
      background.height = game.height + 50
      var text = game.add.sprite(game.width / 2, game.height / 2 - 200, 'title')
      text.anchor.set(0.5)
      text.width = 1000
      text.height = 167
      soundButton = game.add.button(game.width / 2 - 100, game.height / 2 + 250, 'soundIcons', this.soundGame, this)
      soundButton.anchor.set(0.5)
      soundButton.width = 120
      soundButton.height = 120
      screenButton = game.add.button(game.width / 2 + 100, game.height / 2 + 250, 'screenIcon', this.screenGame)
      screenButton.anchor.set(0.5)
      screenButton.width = 120
      screenButton.height = 120
      var start = game.add.button(game.width / 2, game.height / 2 + 20, 'startIcon', this.startGame)
      start.anchor.set(0.5)
      start.width = 400
      start.height = 160
    },
    soundGame: function (target) {
      if (target.frame === 1) {
        playSound = true
        soundButton.frame = 0
      } else {
        playSound = false
        soundButton.frame = 1
      }
    },
    screenGame: function (target) {
      if (game.scale.isFullScreen) {
        game.scale.stopFullScreen()
        screenButton.frame = 0
      } else {
        game.scale.startFullScreen(false)
        screenButton.frame = 1
      }
    },
    startGame: function (target) {
      game.state.start('PlayGame')
    }
  }

  var gameOver = function (game) {}
  gameOver.prototype = {
    preload: function () {
      game.load.image('textPoints', 'assets/sprites/textPoints.png')
      game.load.image('restartIcon', 'assets/sprites/restartLight.png')
    },
    create: function () {
      game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT
      // var key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE)
      // key1.onDown.add(gofull, this)
      highScore = Math.max(score, highScore)
      localStorage.setItem(localStorageName, highScore)

      var background = game.add.sprite(-65, -30, 'background')
      background.width = game.width + 115
      background.height = game.height + 50
      var textpoints = game.add.sprite(game.width / 2 - 150, game.height / 2, 'textPoints')
      textpoints.anchor.set(0.5)
      textpoints.width = 200
      textpoints.height = 150
      textpoints = game.add.sprite(game.width / 2 + 150, game.height / 2, 'textPoints')
      textpoints.anchor.set(0.5)
      textpoints.width = 200
      textpoints.height = 150

      var style = {
        fontSize: '35px',
        align: 'center'
      }
      var styleTitle = {
        fontSize: '150px',
        fill: '#333333',
        align: 'center'
      }
      var text = game.add.text(game.width / 2, 150, 'Game Over', styleTitle)
      text.anchor.set(0.5)
      text = game.add.text(game.width / 2 - 150, game.height / 2 + 17, 'Your score\n' + score, style)
      text.anchor.set(0.5)
      text.lineSpacing = 20
      text = game.add.text(game.width / 2 + 150, game.height / 2 + 17, 'Best score\n' + highScore, style)
      text.anchor.set(0.5)
      text.lineSpacing = 20
      delay = 0
      delayEvent = game.time.events.loop(Phaser.Timer.SECOND, this.buttonRestart, this) // Phaser.Timer.SECOND
    },
    buttonRestart: function () {
      delay++
      if (delay === 1) {
        var restart = game.add.button(game.width / 2, game.height / 2 + 200, 'restartIcon', this.restartGame)
        restart.anchor.set(0.5)
        restart.width = 200
        restart.height = 80
        delayEvent.timer.destroy()
      }
    },
    restartGame: function () {
      tilesArray.length = 0
      selectedArray.length = 0
      game.state.start('TitleScreen')
    }
  }

  var preloadAssets = function (game) {}
  preloadAssets.prototype = {
    preload: function () {
      game.load.image('background', 'assets/sprites/background1.png')
      game.load.spritesheet('tiles', 'assets/sprites/tiles.png', tileSize,
        tileSize)
      game.load.audio('select', ['assets/sounds/chipsCollide1.mp3',
        'assets/sounds/chipsCollide2.ogg']) // CLICK
      game.load.audio('right', ['assets/sounds/chipsCollide2.mp3',
        'assets/sounds/chipsCollide2.ogg']) // BIEN
      game.load.audio('wrong', ['assets/sounds/chipsCollide3.mp3',
        'assets/sounds/chipsCollide3.ogg']) // MAL
      game.load.spritesheet('soundIcons', 'assets/sprites/soundiconsLight.png', 200,
        192)
      game.load.spritesheet('screenIcon', 'assets/sprites/screenLight.png', 200,
        192)
    },
    create: function () {
      game.state.start('TitleScreen')
    }
  }

  game.state.add('PreloadAssets', preloadAssets)
  game.state.add('TitleScreen', titleScreen)
  game.state.add('PlayGame', playGame)
  game.state.add('GameOver', gameOver)
  highScore = localStorage.getItem(localStorageName) == null ? 0 : localStorage.getItem(localStorageName)
  game.state.start('PreloadAssets')
// game.state.start('PlayGame')
}
