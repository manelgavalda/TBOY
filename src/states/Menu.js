/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

var menuGroup;

export default class extends Phaser.State {
    init() {
    }

    preload() {
    }

    create() {
        let text = this.add.text(this.world.centerX, this.world.centerY, 'PLAY', {
            font: '50px Arial',
            fill: '#dddddd',
            align: 'center'
        })
        text.anchor.setTo(0.5, 0.5)

        var title = this.add.text(this.world.centerX, this.world.centerY - 400, 'TBOY', {
            font: '100px Revalia',
            fill: '#dddddd',
            align: 'center'
        })

        title.anchor.set(0.5);
        var grid = this.add.sprite(this.world.width / 2, 130, "gridedition");
        grid.anchor.set(0.5);
        var playButton = this.add.button(this.world.width / 2, this.world.height / 2 + 100, "playbutton", function () {
            game.state.start('Splash')
        });
        playButton.anchor.set(0.5);
        menuGroup = this.add.group();
        var menuButton = this.add.button(this.world.width / 2, this.world.height - 30, "menubutton", this.toggleMenu);
        menuButton.anchor.set(0.5);
        menuGroup.add(menuButton);
        var resetGame = this.add.button(this.world.width / 2, this.world.height + 50, "resetgame", function () {
        });
        resetGame.anchor.set(0.5);
        menuGroup.add(resetGame);
        var thankYou = this.add.button(this.world.width / 2, this.world.height + 130, "thankyou", function () {
        });
        thankYou.anchor.set(0.5);
        menuGroup.add(thankYou);
    }


    toggleMenu() {
        if (menuGroup.y == 0) {
            var menuTween = this.game.add.tween(menuGroup).to({
                y: -180
            }, 500, Phaser.Easing.Bounce.Out, true);
        }
        if (menuGroup.y == -180) {
            var menuTween = this.game.add.tween(menuGroup).to({
                y: 0
            }, 500, Phaser.Easing.Bounce.Out, true);
        }
    }
}