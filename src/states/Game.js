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

        this.initializeWorld();
        this.initializeGui();
        this.spawnEnemy();
        this.createPhisics();
        this.createPlayer();
        this.createItems();
        this.createDoors();
        this.createRain();
        this.createBalls();
        this.createBullets();
        this.setCamera();
        this.createMissile();
        this.createVirtualInput();
    }

    update() {

        this.balls.forEach(this.game.physics.arcade.moveToPointer, this.game.physics.arcade, false, 200);

        if (this.game.input.activePointer.isDown) {
            this.fire();
        }
        this.createCollisions()
        this.inputs()
    }

    createRain(){
        this.emitter = this.game.add.emitter(this.game.world.centerX, 0, 400);
        this.emitter.width = this.game.world.width;
        this.emitter.makeParticles('rainParticle');
        this.emitter.minParticleScale = 0.1;
        this.emitter.maxParticleScale = 0.5;
        this.emitter.setYSpeed(300, 500);
        this.emitter.setXSpeed(-5, 5);
        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;
        this.emitter.start(false, 1600, 5, 0);
    }

    createCollisions(){
        this.game.physics.arcade.collide(this.player, this.backgroundLayer);
        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemy, this.dead, null, this);
        this.game.physics.arcade.overlap(this.player, [this.rocket1,this.rocket2, this.rocket3, this.rocket4, this.rocket5], this.dead, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.enemy, this.killEnemy, null, this);
        this.game.physics.arcade.overlap(this.balls, this.enemy, this.killEnemy, null, this);
    }

    createPhisics(){
        this.game.physics.arcade.enable(this.enemy)
        this.game.physics.arcade.enable(this.player)
        this.game.physics.arcade.enable(this.backgroundLayer)
    }

    initializeWorld(){
        this.map = this.game.add.tilemap('level1');
        this.map.addTilesetImage('tiles', 'tiles');

        this.groundLayer = this.map.createLayer('blockedLayer');
        this.backgroundLayer = this.map.createLayer('backgroundLayer');

        // //Before you can use the collide function you need to set what tiles can collide
        this.map.setCollisionBetween(1, 1000, true, 'backgroundLayer');

        //Change the world size to match the size of this layer
        this.backgroundLayer.resizeWorld();

        //Create player
        this.player = this.game.add.sprite(50, 800, 'player')
    }

    setCamera() {
        this.game.camera.follow(this.player);
        this.game.camera.setSize(800, 500);
    }

    createPlayer(){
        this.player.frame = 1
        this.player.animations.add('down', [2, 1, 0], 10, false)
        this.player.animations.add('left', [3, 4, 5], 10, false)
        this.player.animations.add('right', [8, 7, 6], 10, false)
        this.player.animations.add('up', [9, 10, 11], 10, false)
        this.player.body.gravity.y = 0;
        this.player.body.allowRotation = false;
        this.player.body.setSize(30, 20, 35, 35);
    }

    createVirtualInput(){
        var out = this
        this.buttonleft = this.game.add.button(32, 536-50, 'buttonhorizontal', null, this, 6, 4, 6, 4);
        this.buttonleft.fixedToCamera = true;
        this.buttonleft.events.onInputOver.add(function(){out.left=true;});
        this.buttonleft.events.onInputOut.add(function(){out.left=false;});
        this.buttonleft.events.onInputDown.add(function(){out.left=true;});
        this.buttonleft.events.onInputUp.add(function(){out.left=false;});

        this.buttonvertical = this.game.add.button(130, 472-50, 'buttonvertical', null, this, 0, 1, 0, 1);
        this.buttonvertical.fixedToCamera = true;
        this.buttonvertical.events.onInputOver.add(function(){out.up=true;});
        this.buttonvertical.events.onInputOut.add(function(){out.up=false;});
        this.buttonvertical.events.onInputDown.add(function(){out.up=true;});
        this.buttonvertical.events.onInputUp.add(function(){out.up=false;});

        this.buttonright = this.game.add.button(160, 536-50, 'buttonhorizontal', null, this, 7, 5, 7, 5);
        this.buttonright.fixedToCamera = true;
        this.buttonright.events.onInputOver.add(function(){out.right=true;});
        this.buttonright.events.onInputOut.add(function(){out.right=false;});
        this.buttonright.events.onInputDown.add(function(){out.right=true;});
        this.buttonright.events.onInputUp.add(function(){out.right=false;});

        this.buttondown = this.game.add.button(130, 564-50, 'buttonvertical', null, this, 0, 1, 0, 1);
        this.buttondown.fixedToCamera = true;
        this.buttondown.events.onInputOver.add(function(){out.down=true;});
        this.buttondown.events.onInputOut.add(function(){out.down=false;});
        this.buttondown.events.onInputDown.add(function(){out.down=true;});
        this.buttondown.events.onInputUp.add(function(){out.down=false;});
    }

    createMissile(){
        this.game.input.activePointer.x = this.game.width/2;
        this.game.input.activePointer.y = this.game.height/2 - 100;

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
        this.cursor = this.game.input.keyboard.createCursorKeys()
        this.livesText = this.game.add.text(16, 16, 'Lives : ', {fontSize: '32px', fill: '#ffffff'});
        this.levelText = this.game.add.text(250, 16, 'Level : 1', {fontSize: '32px', fill: '#ffffff'});

        this.scoreText = this.game.add.text(this.game.world.width - 250, 16, 'Score: ' + window.game.global.score, { fontSize: '32px', fill: '#ffffff' });

        this.livesText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;
        this.levelText.fixedToCamera = true;


        this.stateText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, ' ', { font: '84px Arial', fill: '#fff' });

        this.stateText.anchor.setTo(0.5, 0.5);
        this.stateText.visible = false;

        this.lives = this.game.add.group();
        for (var i = 0; i < window.game.global.lives; i++) {
            this.playerLives = this.lives.create(85 + (30 * i), -10, 'player');
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
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    }

    createFromTiledObject(element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);
        Object.keys(element.properties).forEach(function (key) {
            sprite[key] = element.properties[key];
        });
    }

    createDoors() {
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        var result = this.findObjectsByType('door', this.map, 'objectsLayer');

        result.forEach(function (element) {
            this.createFromTiledObject(element, this.doors);
        }, this);
    }

    collect(player, collectable) {
        this.game.add.audio('item').play();
        window.game.global.score  += 500;
        this.scoreText.text = 'Score: ' + window.game.global.score;
        console.log('coleccionada');
        collectable.destroy();
    }

    enterDoor(player, door) {
        this.state.start('Level2');
    }

    inputs() {
        this.player.body.velocity.set(0);

        if (this.cursor.left.isDown || this.left)
        {
            this.player.body.velocity.x = -220;
            this.player.play('left');
        }
        else if (this.cursor.right.isDown|| this.right)
        {
            this.player.body.velocity.x = 220;
            this.player.play('right');
        }
        else if (this.cursor.up.isDown || this.up)
        {
            this.player.body.velocity.y = -220;
            this.player.play('up');
        }
        else if (this.cursor.down.isDown || this.down)
        {
            this.player.body.velocity.y = 220;
            this.player.play('down');
        }
        else
        {
            this.player.animations.stop();
        }
    }

    fire() {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.player.x + 35, this.player.y + 20);
            this.game.add.audio('laser').play();

            this.game.physics.arcade.moveToPointer(bullet, 300);
        }

    }

    dead() {
        this.setParticles()
        this.game.add.audio('dead').play();
        window.game.global.lives -= 1
        window.game.global.score  -= 500;
        this.scoreText.text = 'Score: ' + window.game.global.score;
        var live = this.lives.getFirstAlive();

        if (live) {
            live.kill();
        }

        this.playerIsDead = true
        this.game.camera.shake(0.05, 200)
        console.log(this.lives)
        this.spawnPlayer()

        if (this.lives.countLiving() < 1) {
            this.game.scale.stopFullScreen();
            this.enemy.kill();
            this.player.kill();

            this.stateText.text = " GAME OVER \n Click to restart";
            this.stateText.visible = true;

            this.game.input.onTap.addOnce(this.restart, this);
        }
    }

    restart() {
        this.game.state.start('Menu' + '')
        this.stateText.visible = false;
        this.enemy.reset(100, 100);
        this.lives.callAll('revive');
        this.player.revive();
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

    setParticles() {
        this.explosion = this.game.add.emitter(0, 0, 20);
        this.explosion.makeParticles('deadParticle');
        this.explosion.setYSpeed(-150, 150);
        this.explosion.setXSpeed(-150, 150);
        this.explosion.x = this.player.x;
        this.explosion.y = this.player.y+10;
        this.explosion.start(true, 300, null, 8);
    }

    killEnemy(){
        this.game.add.audio('dead').play();
        this.enemy.kill()
        this.enemy.reset(500, 500);
        this.game.camera.shake(0.02, 100)
        window.game.global.score+=1;
        this.scoreText.text = 'Score: ' + window.game.global.score;
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