/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init () {}
  preload () {
      this.game.load.spritesheet('player', './assets/images/player.png', 96, 64)
      // this.load.spritesheet('player', './assets/images/player.png', 38, 48);
      // this.game.load.tilemap('tilemap', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
      // this.game.load.image('tiles', 'assets/tilesheet128.png');

  }
  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Change the background colour
    this.game.stage.backgroundColor = "#a9f0ff";

    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('tiles', 'tiles');

    this.backgroundLayer = this.map.createLayer('background');
    // this.groundLayer = this.map.createLayer('ground');
    //
    // //Before you can use the collide function you need to set what tiles can collide
    this.map.setCollisionBetween(1, 100, true, 'background');

    //Change the world size to match the size of this layer
    this.backgroundLayer.resizeWorld();


    this.player = this.game.add.sprite(250, 101, 'player')
    this.game.physics.arcade.enable(this.player)
    this.game.physics.arcade.enable(this.backgroundLayer)
    this.player.body.gravity.y = 0

    this.player.body.setSize(20, 20)

    this.cursor = game.input.keyboard.createCursorKeys()


    this.player.frame = 1
    this.player.animations.add('down', [0, 2], 2, true)
    this.player.animations.add('left', [3, 4, 5], 5, true)
    this.player.animations.add('right', [6, 7, 8], 8, true)
    this.player.animations.add('up', [9, 10, 11], 11, true)
  }

  update(){
      this.game.physics.arcade.collide(this.player, this.backgroundLayer)



      this.inputs()
      // if (this.player.body) {
      //     if (this.player.body.touching.down) {
      //         if (this.hasJumped) {
      //             this.dustSound.play();
      //             this.dust.x = this.player.x;
      //             this.dust.y = this.player.y + 10;
      //             this.dust.start(true, 300, null, 8);
      //         }
      //         this.hasJumped = false
      //     }
      // }
  }

    inputs () {
        if(this.cursor.down.isDown) {
            this.player.animations.play('down')
            this.player.body.velocity.y = +220
        } else {
            this.player.body.velocity.y = 0
        }

        if (this.cursor.left.isDown) {
            this.player.animations.play('left')
            this.player.body.velocity.x = -220
        } else {
            this.player.body.velocity.x = 0
        }

        if (this.cursor.right.isDown) {
            this.player.animations.play('right')
            this.player.body.velocity.x = +220
        }

        if(this.cursor.up.isDown) {
            this.player.animations.play('up')
            this.jumpPlayer()
        }
    }

    jumpPlayer () {
        if (!this.hasJumped) {
            this.player.body.velocity.y = -220
        }
    }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
