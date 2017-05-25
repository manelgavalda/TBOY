import Phaser from 'phaser'
import WebFont from 'webfontloader'

var menuGroup;
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

    let text = this.add.text(this.world.centerX, this.world.centerY, 'PLAY', { font: '50px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)



    this.load.image("gametitle", "./assets/sprites/gametitle.png");
    this.load.image("gridedition", "./assets/sprites/gridedition.png");
    this.load.image("playbutton", "./assets/sprites/playbutton.png");
    this.load.image("menubutton", "./assets/sprites/menubutton.png");
    this.load.image("resetgame", "./assets/sprites/resetgame.png");
    this.load.image("thankyou", "./assets/sprites/thankyou.png");
    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')

    // this.load.spritesheet('player', './assets/images/player.png', 38, 48);
    this.load.tilemap('tilemap', './assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', './assets/images/tiles.png');

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Change the background colour
    this.game.stage.backgroundColor = "#3358ee";
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }

  create(){
      this.state.start("GameTitle");
  }

    // var gameTitle = function(game){}

    // gameTitle.prototype = {
        create(){
            var title= this.add.text(this.world.centerX, this.world.centerY -400, 'TBOY', { font: '100px Revalia', fill: '#dddddd', align: 'center' })

            // var title = this.add.sprite(this.world.width / 2, 60, "gametitle");
            title.anchor.set(0.5);
            var grid = this.add.sprite(this.world.width / 2, 130, "gridedition");
            grid.anchor.set(0.5);
            var playButton = this.add.button(this.world.width / 2, this.world.height / 2 + 100, "playbutton", function(){
                game.state.start('Splash')
            });
            playButton.anchor.set(0.5);
            menuGroup = this.add.group();
            var menuButton = this.add.button(this.world.width / 2, this.world.height - 30, "menubutton", this.toggleMenu);
            menuButton.anchor.set(0.5);
            menuGroup.add(menuButton);
            var resetGame = this.add.button(this.world.width / 2, this.world.height + 50, "resetgame", function(){});
            resetGame.anchor.set(0.5);
            menuGroup.add(resetGame);
            var thankYou = this.add.button(this.world.width / 2, this.world.height + 130, "thankyou", function(){});
            thankYou.anchor.set(0.5);
            menuGroup.add(thankYou);
        }
    // }

    toggleMenu(){
        if(menuGroup.y == 0){
            var menuTween = this.game.add.tween(menuGroup).to({
                y: -180
            }, 500, Phaser.Easing.Bounce.Out, true);
        }
        if(menuGroup.y == -180){
            var menuTween = this.game.add.tween(menuGroup).to({
                y: 0
            }, 500, Phaser.Easing.Bounce.Out, true);
        }
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
