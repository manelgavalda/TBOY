import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#2d2d2d';
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bangers']
      },
      active: this.fontsLoaded

    })

    this.load.audio('bso', ['assets/sounds/bso.mp3']);
    this.load.audio('item', ['assets/sounds/item.mp3']);
    this.load.audio('laser', ['assets/sounds/laser.mp3']);
    this.load.audio('dead', ['assets/sounds/dead.mp3']);

    this.load.image("gametitle", "./assets/sprites/gametitle.png");
    this.load.image("gridedition", "./assets/sprites/gridedition.png");
    this.load.image("playbutton", "./assets/sprites/playbutton.png");
    this.load.image("menubutton", "./assets/sprites/menubutton.png");
    this.load.image("resetgame", "./assets/sprites/resetgame.png");
    this.load.image("thankyou", "./assets/sprites/thankyou.png");
    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')

    this.load.spritesheet('player', './assets/images/player.png', 96, 64)
    this.load.spritesheet('startdoor', './assets/images/tiles.png', 32, 32, 100, 255)
    this.load.spritesheet('enddoor', './assets/images/tiles.png', 32, 32, 100, 255)
    this.load.spritesheet('enemy', './assets/images/enemies.png', 100, 150, 200)

    this.load.image('woodchest', './assets/images/woodenchest.png')
    this.load.image('goldchest', './assets/images/goldenchest.png')
    this.load.image('diamondchest', './assets/images/diamondchest.png')

    this.load.image('bullet', 'assets/sprites/purple_ball.png');
    this.load.image('rocket', 'assets/images/rocket.png');

    this.load.tilemap('level1', './assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level2', './assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level2', './assets/tilemaps/level2.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.image('tiles', './assets/images/tiles.png');

    this.game.load.spritesheet('buttonvertical', './assets/buttons/button-vertical.png',64,64);
    this.game.load.spritesheet('buttonhorizontal', './assets/buttons/button-horizontal.png',96,64);
    this.game.load.spritesheet('buttondiagonal', './assets/buttons/button-diagonal.png',64,64);
    this.game.load.spritesheet('buttonfire', './assets/buttons/button-round-a.png',96,96);
    this.game.load.spritesheet('buttonjump', './assets/buttons/button-round-b.png',96,96);


    this.game.load.image('deadParticle', './assets/images/deadParticle.png')

  }

  create(){
      this.state.start("Splash");
  }

  render () {
    if (this.fontsReady) {
      // this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
