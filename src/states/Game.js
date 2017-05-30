/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
    init() {
    }

    preload() {
    }

    create() {
        window.game.global.lives = 3
        window.game.global.score= 0
        this.fireRate = 300
        this.nextFire = 0

        //  Text
        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('tiles', 'tiles');

        this.groundLayer = this.map.createLayer('blockedLayer');
        this.backgroundLayer = this.map.createLayer('backgroundLayer');

        this.initializeGui()

        // //Before you can use the collide function you need to set what tiles can collide
        this.map.setCollisionBetween(1, 1000, true, 'backgroundLayer');

        //Change the world size to match the size of this layer
        this.backgroundLayer.resizeWorld();

        this.player = this.game.add.sprite(50, 800, 'player')

        this.spawnEnemy()

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

        this.createItems();
        this.createDoors();
        this.createBalls();
        this.createBullets();

        this.game.camera.follow(this.player);



        this.game.camera.setSize(800, 500);

        // Create a missile and add it to the game in the bottom center of the stage
        // this.game.add.existing(
        //     new Missile(this.game, this.game.width/2, this.game.height - 16)
        // );


        // Simulate a pointer click/tap input at the center of the stage
        // when the example begins running.
        this.game.input.activePointer.x = this.game.width/2;
        this.game.input.activePointer.y = this.game.height/2 - 100;

        this.createMissile()
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
        this.game.physics.arcade.overlap(this.player, this.enemy, this.dead, null, this);
        this.game.physics.arcade.overlap(this.player, [this.rocket1,this.rocket2, this.rocket3, this.rocket4], this.dead, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.enemy, this.killEnemy, null, this);
        this.game.physics.arcade.overlap(this.balls, this.enemy, this.killEnemy, null, this);

        this.inputs()
    }

    createMissile(){
        this.rocket1 = this.game.add.existing(
            new Missile(this.game, this.game.width/2, this.game.height - 16, this.player)
        );

        this.rocket2 = this.game.add.existing(
            new Missile(this.game, this.game.width/2 -200, this.game.height -200, this.player)
        );

        this.rocket3 = this.game.add.existing(
            new Missile(this.game, this.game.width/2 -300, this.game.height -150, this.player)
        );

        this.rocket4 = this.game.add.existing(
            new Missile(this.game, this.game.width/2 -500, this.game.height -250, this.player)
        );

        this.rocket5 = this.game.add.existing(
            new Missile(this.game, this.game.width/2 -800, this.game.height -200, this.player)
        );
    }

    initializeGui(){
        this.livesText = this.game.add.text(16, 16, 'Lives : ', {fontSize: '32px', fill: '#ffffff'});
        this.scoreText = this.game.add.text(this.game.world.width - 150, 16, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });

        this.livesText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;

        this.stateText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, ' ', { font: '84px Arial', fill: '#fff' });

        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.visible = false;

        this.lives = this.game.add.group();
        for (var i = 0; i < window.game.global.lives; i++) {
            this.playerLives = this.lives.create(85 + (30 * i), -10, 'player');
            // player.anchor.setTo(0.5, 0.5);
            // ship.angle = 90;
            this.playerLives.alpha = 0.8;
            this.playerLives.fixedToCamera = true;
        }
    }

    createBullets(){
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(10, 'bullet');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
    }

    createBalls(){
        this.balls = this.game.add.group();
        this.balls.enableBody = true;
        for (var i = 0; i < 3; i++)
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
        window.game.global.score  += 10;
        this.scoreText.text = 'Score: ' + window.game.global.score;
        console.log('coleccionada');

        //remove sprite
        collectable.destroy();
    }

    enterDoor(player, door) {
        console.log('entering door that will take you to ' + door.targetTilemap + ' on x:' + door.targetX + ' and y:' + door.targetY);
        this.state.start('Level2');
    }

    inputs() {
        this.player.body.velocity.set(0);

        if (this.cursor.left.isDown)
        {
            this.player.body.velocity.x = -220;
            this.player.play('left');
        }
        else if (this.cursor.right.isDown)
        {
            this.player.body.velocity.x = 220;
            this.player.play('right');
        }
        else if (this.cursor.up.isDown)
        {
            this.player.body.velocity.y = -220;
            this.player.play('up');
        }
        else if (this.cursor.down.isDown)
        {
            this.player.body.velocity.y = 220;
            this.player.play('down');
        }
        else
        {
            this.player.animations.stop();
        }

        // create our virtual game controller buttons
        this.buttonjump = this.game.add.button(600, 500, 'up', null, this, 0, 1, 0, 1);  //game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame
        this.buttonjump.fixedToCamera = true;  //our buttons should stay on the same place
        this.buttonjump.events.onInputOver.add(function(){jump=true;});
        this.buttonjump.events.onInputOut.add(function(){jump=false;});
        this.buttonjump.events.onInputDown.add(function(){jump=true;});
        this.buttonjump.events.onInputUp.add(function(){jump=false;});

        // buttonfire = this.game.add.button(700, 500, 'up', null, this, 0, 1, 0, 1);
        // buttonfire.fixedToCamera = true;
        // buttonfire.events.onInputOver.add(function(){fire=true;});
        // buttonfire.events.onInputOut.add(function(){fire=false;});
        // buttonfire.events.onInputDown.add(function(){fire=true;});
        // buttonfire.events.onInputUp.add(function(){fire=false;});
        //
        // buttonleft = this.game.add.button(0, 472, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        // buttonleft.fixedToCamera = true;
        // buttonleft.events.onInputOver.add(function(){left=true;});
        // buttonleft.events.onInputOut.add(function(){left=false;});
        // buttonleft.events.onInputDown.add(function(){left=true;});
        // buttonleft.events.onInputUp.add(function(){left=false;});
        //
        // buttonbottomleft = this.game.add.button(32, 536, 'buttondiagonal', null, this, 6, 4, 6, 4);
        // buttonbottomleft.fixedToCamera = true;
        // buttonbottomleft.events.onInputOver.add(function(){left=true;duck=true;});
        // buttonbottomleft.events.onInputOut.add(function(){left=false;duck=false;});
        // buttonbottomleft.events.onInputDown.add(function(){left=true;duck=true;});
        // buttonbottomleft.events.onInputUp.add(function(){left=false;duck=false;});
        //
        // buttonright = this.game.add.button(160, 472, 'buttonhorizontal', null, this, 0, 1, 0, 1);
        // buttonright.fixedToCamera = true;
        // buttonright.events.onInputOver.add(function(){right=true;});
        // buttonright.events.onInputOut.add(function(){right=false;});
        // buttonright.events.onInputDown.add(function(){right=true;});
        // buttonright.events.onInputUp.add(function(){right=false;});
        //
        // buttonbottomright = this.game.add.button(160, 536, 'buttondiagonal', null, this, 7, 5, 7, 5);
        // buttonbottomright.fixedToCamera = true;
        // buttonbottomright.events.onInputOver.add(function(){right=true;duck=true;});
        // buttonbottomright.events.onInputOut.add(function(){right=false;duck=false;});
        // buttonbottomright.events.onInputDown.add(function(){right=true;duck=true;});
        // buttonbottomright.events.onInputUp.add(function(){right=false;duck=false;});
        //
        // buttondown = this.game.add.button(96, 536, 'buttonvertical', null, this, 0, 1, 0, 1);
        // buttondown.fixedToCamera = true;
        // buttondown.events.onInputOver.add(function(){duck=true;});
        // buttondown.events.onInputOut.add(function(){duck=false;});
        // buttondown.events.onInputDown.add(function(){duck=true;});
        // buttondown.events.onInputUp.add(function(){duck=false;});
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
        window.game.global.lives -= 1
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

    spawnEnemy() {
        this.enemy = this.game.add.sprite(50, 50, 'enemy')
        this.game.add.tween(this.enemy)
            .to({ x: this.game.width - 150, y: 50 }, 2000, Phaser.Easing.Sinusoidal.InOut)
            .to({ x: this.game.width - 150, y: this.game.height - 50 },
                1200, Phaser.Easing.Sinusoidal.InOut)
            .to({ x: 150, y: this.game.height - 150 }, 2000, Phaser.Easing.Sinusoidal.InOut)
            .to({ x: 50, y: 50 }, 1200, Phaser.Easing.Sinusoidal.InOut)
            .start()
            .loop();
    }

    spawnPlayer() {
        if (this.playerIsDead) {
            // this.player.x= 380
            // this.player.y= 101
            this.player.reset(50, 800);
            this.enemy.reset(500, 500);
            this.playerIsDead = false;
        } else {
            this.player = this.game.add.sprite(40, 810, 'player')
        }
    }

    killEnemy(){
        this.enemy.kill()
        this.enemy.reset(500, 500);
        this.game.camera.shake(0.02, 100)
    }

    render() {
        if (__DEV__) {
            // this.game.debug.spriteInfo(this.mushroom, 32, 32)
        }
    }
}


var Missile = function(game, x, y, player, dead) {
    this.player=player
    Phaser.Sprite.call(this, game, x, y, 'rocket');

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

    // Enable physics on the missile
    game.physics.enable(this, Phaser.Physics.ARCADE);

    // Define constants that affect motion
    this.SPEED = 250; // missile speed pixels/second
    this.TURN_RATE = 5; // turn rate in degrees/frame
};

Missile.prototype = Object.create(Phaser.Sprite.prototype);

Missile.prototype.constructor = Missile;

Missile.prototype.update = function() {
    // Calculate the angle from the missile to the mouse cursor game.input.x
    // and game.input.y are the mouse position; substitute with whatever
    // target coordinates you need.
    var targetAngle = this.game.math.angleBetween(
        this.x, this.y,
        this.player.position.y, this.player.position.x
    );

    // Gradually (this.TURN_RATE) aim the missile towards the target angle
    if (this.rotation !== targetAngle) {
        // Calculate difference between the current angle and targetAngle
        var delta = targetAngle - this.rotation;

        // Keep it in range from -180 to 180 to make the most efficient turns.
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        if (delta > 0) {
            // Turn clockwise
            this.angle += this.TURN_RATE;
        } else {
            // Turn counter-clockwise
            this.angle -= this.TURN_RATE;
        }

        // Just set angle to target angle if they are close
        if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
            this.rotation = targetAngle;
        }
    }

    // Calculate velocity vector based on this.rotation and this.SPEED
    this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
    this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
};