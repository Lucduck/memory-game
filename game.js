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
  var playSound
  var score
  var timeLeft
  var tilesLeft
  var checked
  var game = new Phaser.Game(1280, 720)
  var playGame = function (game) {}
  // game.load.image('background', 'assets/sprites/background.jpg')
  // game.add.image(0, 0, 'background')
  playGame.prototype = {
    scoreText: null,
    timeText: null,
    soundArray: [],
    preload: function () {
      game.load.image('background', 'assets/sprites/background.jpg')
      game.load.spritesheet('tiles', 'assets/sprites/tiles.png', tileSize, tileSize)
    },
    create: function () {
      console.log(game.world.centerX)
      console.log(game.world.centerY)
      score = 0
      timeLeft = 60
      this.checked = true
      // add.image(x, y, key)
      // game.add.image(0, 0, 'tiles')
      game.add.sprite(0, 0, 'background')
      this.placeTiles()
      // console.log("That's my awesome game")
      if (playSound) {
        this.soundArray[0] = game.add.audio('select', 1)
        this.soundArray[1] = game.add.audio('right', 1)
        this.soundArray[2] = game.add.audio('wrong', 1)
      }
      var style = {
        font: '32px Monospace',
        fill: '#00ff00',
        align: 'center'
      }
      this.scoreText = game.add.text(5, 5, 'Score: ' + score, style)
      this.timeText = game.add.text(5, game.height - 5, 'Time left: ' + timeLeft, style)
      this.timeText.anchor.set(0, 1)
      game.time.events.loop(Phaser.Timer.SECOND, this.decreaseTime, this)
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
        this.timeText.text = 'Time left: ' + timeLeft
        this.scoreText.text = 'Score: ' + score
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
      this.timeText.text = 'Time left: ' + timeLeft
      if (timeLeft === 0) {
        game.state.start('GameOver')
      }
    }
  }

  var titleScreen = function (game) {}
  titleScreen.prototype = {
    preload: function () {
      game.load.image('background', 'assets/sprites/background.jpg')
      game.load.spritesheet('soundIcons', 'assets/sprites/soundiconsLight.png', 50, 48)
      game.load.image('startIcon', 'assets/sprites/startLight.png')
      game.load.image('screenIcon', 'assets/sprites/screenLight.png')
      game.load.image('title', 'assets/sprites/MemoryLight.png')
      game.load.audio('select', ['assets/sounds/select.mp3', 'assets/sounds/select.ogg'])
      game.load.audio('right', ['assets/sounds/right.mp3', 'assets/sounds/right.ogg'])
      game.load.audio('wrong', ['assets/sounds/wrong.mp3', 'assets/sounds/wrong.ogg'])
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
      game.add.sprite(0, 0, 'background')
      var text = game.add.sprite(game.width / 2, game.height / 2 - 200, 'title')
      text.anchor.set(0.5)
      text.width = 1200
      text.height = 200
      soundButton = game.add.button(game.width / 2 - 100, game.height / 2 + 20, 'soundIcons', this.soundGame, this)
      soundButton.anchor.set(0.5)
      soundButton.width = 80
      soundButton.height = 80
      var screenSize = game.add.button(game.width / 2 + 100, game.height / 2 + 20, 'screenIcon', this.screenGame)
      screenSize.anchor.set(0.5)
      screenSize.width = 80
      screenSize.height = 80
      var start = game.add.button(game.width / 2, game.height / 2 + 170, 'startIcon', this.startGame)
      start.anchor.set(0.5)
      start.width = 200
      start.height = 80
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
      } else {
        game.scale.startFullScreen(false)
      }
    },
    startGame: function (target) {
      game.state.start('PlayGame')
    }
  }

  var gameOver = function (game) {}
  gameOver.prototype = {
    create: function () {
      function gofull () {
        if (game.scale.isFullScreen) {
          game.scale.stopFullScreen()
        } else {
          game.scale.startFullScreen(false)
        }
      }
      game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT
      // var key1 = game.input.keyboard.addKey(Phaser.Keyboard.ONE)
      // key1.onDown.add(gofull, this)
      game.input.onDown.add(gofull, this)
      highScore = Math.max(score, highScore)
      localStorage.setItem(localStorageName, highScore)
      var style = {
        font: '32px Monospace',
        fill: '#00ff00',
        align: 'center'
      }
      var text = game.add.text(game.width / 2, game.height / 2, 'Game Over\n\nYour score: ' + score + '\nBest score: ' + highScore + '\n\nTap to restart', style)
      text.anchor.set(0.5)
      game.input.onDown.add(this.restartGame, this)
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
      game.load.spritesheet('tiles', 'assets/sprites/tiles.png', tileSize,
        tileSize)
      game.load.audio('select', ['assets/sounds/select.mp3',
        'assets/sounds/select.ogg'])
      game.load.audio('right', ['assets/sounds/right.mp3',
        'assets/sounds/right.ogg'])
      game.load.audio('wrong', ['assets/sounds/wrong.mp3',
        'assets/sounds/wrong.ogg'])
      game.load.spritesheet('soundicons', 'assets/sprites/soundicons.png', 80,
        80)
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
