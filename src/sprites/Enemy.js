/**
 * Created by manel on 25/05/17.
 */
import Phaser from 'phaser'

export default class extends Phaser.Sprite {
        constructor({game, x, y, target}) {
        super(game, x, y, target);

        // Phaser.Sprite.call(this, game, x, y, 'enemy');

        // Save the target that this Follower will follow
        // The target is any object with x and y properties
        this.target = target;

        // Set the pivot point for this sprite to the center
        this.anchor.setTo(0.5, 0.5);

        // Enable physics on this object
        // this.game.physics.enable(this, Phaser.Physics.ARCADE);

        // Each Follower will record its position history in
        // an array of point objects (objects with x,y members)
        // This will be used to make each Follower follow the
        // same track as its target
        this.history = [];
        this.HISTORY_LENGTH = 5;

        // Define constants that affect motion
        this.MAX_SPEED = 250; // pixels/second
        this.MIN_DISTANCE = 32; // pixels
    };
}