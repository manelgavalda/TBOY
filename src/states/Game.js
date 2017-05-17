/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {}
  preload () {
      // this.game.load.spritesheet('player', 'assets/greenninja.png', 38, 48);
      // this.game.load.tilemap('tilemap', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
      // this.game.load.image('tiles', 'assets/tilesheet128.png');

  }
  create () {


      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      //Change the background colour
      this.game.stage.backgroundColor = "#a9f0ff";

      this.map = this.game.add.tilemap('tilemap');
      this.map.addTilesetImage('tiles', 'tiles');

      this.backgroundlayer = this.map.createLayer('backgroundLayer');
      this.groundLayer = this.map.createLayer('blockedLayer');

      //Before you can use the collide function you need to set what tiles can collide
      this.map.setCollisionBetween(1, 10, true, 'blockedLayer');

      //Change the world size to match the size of this layer
      this.groundLayer.resizeWorld();




      // const bannerText = 'Phaser + ES6 + Webpack'
    // let banner = this.add.text(this.world.centerX, this.game.height - 80, bannerText)
    // banner.font = 'Bangers'
    // banner.padding.set(10, 16)
    // banner.fontSize = 40
    // banner.fill = '#77BFA3'
    // banner.smoothed = false
    // banner.anchor.setTo(0.5)
    //
    // this.mushroom = new Mushroom({
    //   game: this,
    //   x: this.world.centerX,
    //   y: this.world.centerY,
    //   asset: 'mushroom'
    // })
    //
    // this.game.add.existing(this.mushroom)
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
