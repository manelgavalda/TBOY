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
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        var music_on_off = 0
        var out = this
        this.music = this.game.add.audio('bso');
        this.music.loop = true;
        this.music.play();

        var title = this.add.text(this.world.centerX, this.world.centerY - 200, 'TBOY', {
            font: '100px Revalia',
            fill: '#dddddd',
            align: 'center'
        })

        title.anchor.set(0.5);
        var playButton = this.add.button(this.world.width / 2, this.world.height / 2 + 100 - 150, "playbutton", function () {
            this.game.scale.startFullScreen(false);
            this.game.state.start('Game')
        });
        playButton.anchor.set(0.5);
        menuGroup = this.add.group();
        var menuButton = this.add.button(this.world.width / 2, this.world.height - 30, "menubutton", this.toggleMenu);
        menuButton.anchor.set(0.5);
        menuGroup.add(menuButton);
        var resetGame = this.add.button(this.world.width / 2, this.world.height + 50, "resetgame", function() {

            if(music_on_off == 0){
                out.music.resume()
                music_on_off = 1
            } else {
                out.music.pause()
                music_on_off = 0
            }
        });
        resetGame.anchor.set(0.5);
        menuGroup.add(resetGame);
        var thankYou = this.add.button(this.world.width / 2, this.world.height + 130, "thankyou", function () {
        });
        thankYou.anchor.set(0.5);
        menuGroup.add(thankYou);

        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.scale.startFullScreen(false);

    }

    toggleMenu() {
        if (menuGroup.y == 0) {
            var menuTween = this.game.add.tween(menuGroup).to({
                y: -260
            }, 500, Phaser.Easing.Bounce.Out, true);
        }
        if (menuGroup.y == -260) {
            var menuTween = this.game.add.tween(menuGroup).to({
                y: 0
            }, 500, Phaser.Easing.Bounce.Out, true);
        }
    }

    toogleMusic(){
        var i = 0

    }
}