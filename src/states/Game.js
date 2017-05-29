/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
    init() {

    }

    preload() {
    }

    create() {
        this.score = 0;
        this.fireRate = 300
        this.nextFire = 0
        this.lives = this.game.add.group();

        //  Text
        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('tiles', 'tiles');

        this.groundLayer = this.map.createLayer('blockedLayer');
        this.backgroundLayer = this.map.createLayer('backgroundLayer');

        this.initializeText()

        // //Before you can use the collide function you need to set what tiles can collide
        this.map.setCollisionBetween(1, 1000, true, 'backgroundLayer');

        //Change the world size to match the size of this layer
        this.backgroundLayer.resizeWorld();

        this.spawnPlayer()

        this.enemy = this.game.add.sprite(500, 500, 'enemy')

        this.game.physics.arcade.enable(this.enemy)
        this.game.physics.arcade.enable(this.player)
        this.game.physics.arcade.enable(this.backgroundLayer)

        this.cursor = this.game.input.keyboard.createCursorKeys()

        this.player.frame = 1
        this.player.animations.add('down', [2, 1, 0], 10, false)
        this.player.animations.add('left', [3, 4, 5], 10, false)
        this.player.animations.add('right', [8, 7, 6], 10, false)
        this.player.animations.add('up', [9, 10, 11], 10, false)

        this.player.body.gravity.y = 0;
        this.player.body.allowRotation = false;
        this.player.body.setSize(30, 20, 35, 35);

        this.createDoors();
        this.createItems();
        this.createBalls();
        this.createBullets();

        this.game.camera.follow(this.player);
        this.game.camera.setSize(800, 500);

        for (var i = 0; i < 3; i++) {
            var player = this.lives.create(this.game.world.width - 150 + (30 * i), -20, 'player');
            // player.anchor.setTo(0.5, 0.5);
            // ship.angle = 90;
            player.alpha = 0.6;
        }
    }

    update() {

        this.balls.forEach(this.game.physics.arcade.moveToPointer, this.game.physics.arcade, false, 200);

        if (this.game.input.activePointer.isDown) {
            this.fire();
        }

        this.enemyFollow()

        this.game.physics.arcade.collide(this.player, this.backgroundLayer);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.enemy, this.killEnemy, null, this);
        this.game.physics.arcade.overlap(this.balls, this.enemy, this.killEnemy, null, this);

        this.inputs()
    }

    initializeText(){
        this.game.add.text(this.game.world.width - 220, 0, 'Lives : ', {fontSize: '32px', fill: '#000'});
        this.scoreText = this.game.add.text(this.game.world.width - 900, 0, 'Score: ' + this.score, {
            fontSize: '32px',
            fill: '#000'
        });

        this.stateText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, ' ', {
            font: '84px Arial',
            fill: '#fff'
        });

        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.visible = false;
    }

    createBullets(){
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(50, 'bullet');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
    }

    createBalls(){
        this.balls = this.game.add.group();
        this.balls.enableBody = true;
        for (var i = 0; i < 50; i++)
        {
            var ball = this.balls.create(this.game.world.randomX, this.game.world.randomY, 'bullet');
        }
    }

    createItems() {
        //create items
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;
        var result = this.findObjectsByType('item', this.map, 'objectsLayer');
        result.forEach(function (element) {
            this.createFromTiledObject(element, this.items);
        }, this);
    }

    findObjectsByType(type, map, layer) {
        var result = []
        map.objects[layer].forEach(function (element) {
            if (element.properties.type === type) {
                //Phaser uses top left, Tiled bottom left so we have to adjust the y position
                //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
                //so they might not be placed in the exact pixel position as in Tiled
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    }

    //create a sprite from an object
    createFromTiledObject(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function (key) {
            sprite[key] = element.properties[key];
        });
    }

    createDoors() {
        //create doors
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        var result = this.findObjectsByType('door', this.map, 'objectsLayer');

        result.forEach(function (element) {
            this.createFromTiledObject(element, this.doors);
        }, this);
    }

    collect(player, collectable) {
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;
        console.log('coleccionada');

        //remove sprite
        collectable.destroy();
    }

    enterDoor(player, door) {
        console.log('entering door that will take you to ' + door.targetTilemap + ' on x:' + door.targetX + ' and y:' + door.targetY);
        this.state.start('Level2');
    }

    inputs() {
        if (this.cursor.down.isDown) {
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

        if (this.cursor.up.isDown) {
            this.player.animations.play('up')
            this.player.body.velocity.y = -220
        }
    }

    enemyFollow() {
        // this.enemy.body.velocity.y = this.y -= 1
        // var NUMBER_OF_FOLLOWERS = 10;
        // for(var i = 0; i < NUMBER_OF_FOLLOWERS; i++) {
        //     var f = this.game.add.existing(
        //         new Enemy(this.game,
        //             this.game.width/2 + i * 32,
        //             this.game.height/2,
        //             f || this.game.input /* the previous follower or pointer */
        //         )
        //     );
        // }
    }

    fire() {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.player.x + 35, this.player.y + 20);

            this.game.physics.arcade.moveToPointer(bullet, 300);
        }

    }

    dead() {
        var live = this.lives.getFirstAlive();

        if (live) {
            live.kill();
        }

        this.playerIsDead = true
        // this.deadSound.play()
        this.game.camera.shake(0.05, 200)
        console.log(this.lives)

        if (this.playerIsDead) {
            // this.explosion.x = this.player.x
            // this.explosion.y = this.player.y + 10
            // this.explosion.start(true, 300, null, 20)
        }
        //tornar a colocar usuari en posició inicial
        this.spawnPlayer()

        if (this.lives.countLiving() < 1) {
            this.enemy.kill();
            this.player.kill();

            this.stateText.text = " GAME OVER \n Click to restart";
            this.stateText.visible = true;

            //the "click to restart" handler
            this.game.input.onTap.addOnce(this.restart, this);
        }
    }

    restart() {
        this.game.state.start('Boot' +
            '')
        this.stateText.visible = false;
        //  A new level starts
        this.enemy.reset(100, 100);

        //resets the life count
        this.lives.callAll('revive');
        //  And brings the aliens back from the dead :)
        // aliens.removeAll();
        // createAliens();

        //revives the player
        this.player.revive();
        //hides the text
    }

    spawnPlayer() {
        if (this.playerIsDead) {
            // this.player.x= 380
            // this.player.y= 101
            this.player.reset(380, 101);
            this.enemy.reset(500, 500);
            this.playerIsDead = false;
        } else {
            this.player = this.game.add.sprite(40, 810, 'player')
        }
    }

    killEnemy(){
        this.enemy.kill()
        this.enemy.reset(500, 500);
        this.game.camera.shake(0.05, 200)
    }

    render() {
        if (__DEV__) {
            // this.game.debug.spriteInfo(this.mushroom, 32, 32)
        }
    }
}
