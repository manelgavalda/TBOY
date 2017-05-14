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

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')

      //load game assets
      this.load.tilemap('level1', './assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
      this.load.image('tiles', './assets/images/tiles.png');
      this.load.image('simples_pimples', './assets/images/simples_pimples.png');
      // this.load.image('browndoor', 'assets/images/browndoor.png');
      // this.load.image('greencup', 'assets/images/greencup.png');
      // this.load.image('bluecup', 'assets/images/bluecup.png');

  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
