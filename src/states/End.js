import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
  }

  create () {
      var title = this.add.text(this.world.centerX -200, this.world.centerY - 150, 'Good Job', {
          font: '100px Revalia',
          fill: '#dddddd',
          align: 'center'
      })

      var score = this.add.text(this.world.centerX -300, this.world.centerY, 'Score: '+ window.score, {
          font: '100px Revalia',
          fill: '#dddddd',
          align: 'center'
      })
  }
}
