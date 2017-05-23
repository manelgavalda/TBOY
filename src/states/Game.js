/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init () {}
  preload () {
      this.game.load.spritesheet('player', './assets/images/player.png', 96, 64)
      this.game.load.spritesheet('startdoor', './assets/images/tiles.png', 32, 32, 100, 255)
      this.game.load.spritesheet('enddoor', './assets/images/tiles.png', 32, 32, 100, 255)
      this.game.load.spritesheet('woodchest', './assets/images/woodenchest.png')
      this.game.load.spritesheet('goldchest', './assets/images/goldenchest.png')
      this.game.load.spritesheet('diamondchest', './assets/images/diamondchest.png')
      this.game.load.spritesheet('enemy', './assets/images/enemies.png',100, 250, 200)
  }

  create () {
    this.score = 0;
    this.scoreText;
    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('tiles', 'tiles');

    this.groundLayer = this.map.createLayer('blockedLayer');
    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    // this.objectsLayer = this.map.createLayer('objectsLayer');
    this.scoreText = this.game.add.text(30, 0, 'Score: '+ this.score, { fontSize: '32px', fill: '#000' });

      //
    // //Before you can use the collide function you need to set what tiles can collide
    this.map.setCollisionBetween(1, 1000, true, 'backgroundLayer');

    //Change the world size to match the size of this layer
    this.backgroundLayer.resizeWorld();


    // this.player = this.game.add.sprite(50, 800, 'player')
      this.spawnPlayer()
    this.enemy = this.game.add.sprite(500, 500, 'enemy')
    this.game.physics.arcade.enable(this.enemy)


      this.game.physics.arcade.enable(this.player)
    this.game.physics.arcade.enable(this.backgroundLayer)
    this.player.body.gravity.y = 0

    this.player.body.setSize(30, 20, 35, 35)

    this.cursor = game.input.keyboard.createCursorKeys()

    this.player.frame = 1
    this.player.animations.add('down', [2, 1, 0], 10, false)
    this.player.animations.add('left', [3, 4, 5], 10, false)
    this.player.animations.add('right', [8, 7, 6], 10, false)
    this.player.animations.add('up', [9, 10, 11], 10, false)

      this.createItems();
      this.createDoors();

  }
    createItems() {
        //create items
        this.items = this.game.add.group();
        this.items.enableBody = true;
        var item;
        var result = this.findObjectsByType('item', this.map, 'objectsLayer');
        result.forEach(function(element){
            this.createFromTiledObject(element, this.items);
        }, this);
    }
    findObjectsByType(type, map, layer) {
        var result = []
        map.objects[layer].forEach(function(element){
            if(element.properties.type === type) {
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
        Object.keys(element.properties).forEach(function(key){
            sprite[key] = element.properties[key];
        });
    }

    createDoors() {
        //create doors
        this.doors = this.game.add.group();
        this.doors.enableBody = true;
        var result = this.findObjectsByType('door', this.map, 'objectsLayer');

        result.forEach(function(element){
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
        console.log('entering door that will take you to '+door.targetTilemap+' on x:'+door.targetX+' and y:'+door.targetY);
    }
  update(){
      this.game.physics.arcade.collide(this.player, this.backgroundLayer)
      this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
      this.game.physics.arcade.overlap(this.player, this.doors, this.enterDoor, null, this);
      this.game.physics.arcade.overlap(this.player, this.enemy, this.dead, null, this)

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
            this.player.body.velocity.y = -220
        }
    }

    dead() {
        this.playerIsDead = true
        // this.deadSound.play()
        this.game.camera.shake(0.05, 200)

        if (this.playerIsDead) {
            // this.explosion.x = this.player.x
            // this.explosion.y = this.player.y + 10
            // this.explosion.start(true, 300, null, 20)
        }
        //tornar a colocar usuari en posició inicial
        this.spawnPlayer()
    }

    spawnPlayer() {
        if(this.playerIsDead) {
            // this.player.x= 380
            // this.player.y= 101
            this.player.reset(380, 101);
            this.playerIsDead=false;
        } else {
            this.player = this.game.add.sprite(380,101,'player')
        }
    }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
