/// <reference path="game.js" />
/// <reference path="../state-machine.min.js" />
/// <reference path="../phaser.min.js" />

var HMotionFsm = StateMachine.factory({
    init: 'idle',
    transitions: [
      { name: 'moveLeft', from: '*', to: 'left' },
      { name: 'moveRight', from: '*', to: 'right' },
      { name: 'rest', from: '*', to: 'idle' },
    ],
    data: function (player, fsm) {      //  <-- use a method that can be called for each instance
        return {
            player: player,
            fsm: fsm
        }
    },
    methods: {
        onMoveLeft: function () {
            if (this.fsm.state != 'air') {
                this.player.animations.play('walk');
            }
            this.player.body.velocity.x = -200;
            this.player.scale.x = -1 * Math.abs(this.player.scale.x);
        },
        onMoveRight: function (speed) {
            if (this.fsm.state != 'air') {
                this.player.animations.play('walk');
            }
            this.player.body.velocity.x = 200;
            this.player.scale.x = 1 * Math.abs(this.player.scale.x);
        },
        onRest: function () {
            if (this.fsm.state == 'air') {
                this.player.animations.play('jump');
            }
            else {
                this.player.animations.play('stand');
                this.player.body.velocity.x = 0;
            }
       },

    }
});

var VMotionFsm = StateMachine.factory({
    init: 'ground',
    transitions: [
      { name: 'jump', from: 'ground', to: 'air' },
      { name: 'fall', from: 'air', to: 'ground' },
    ],
    data: function (player) {      //  <-- use a method that can be called for each instance
        return {
            player: player
        }
    },
    methods: {
        onJump: function () {
            console.log('I am ' + this.color);
            this.player.body.velocity.y -= 800;
            this.player.animations.play('jump');
        },
        onFall: function () {
        },
    }
});

var playState = {
    preload: function () {
    },

    create: function () {

        this.map = game.add.tilemap('level1');
        this.map.addTilesetImage('goodly-2x');
        this.collision = this.map.createLayer('Collision');
        this.bgLayer = this.map.createLayer('Background');
        this.detailsLayer = this.map.createLayer('Details');
        this.tilesLayer = this.map.createLayer('Tiles');
        this.map.setCollision(71, true, "Collision");

        this.player = game.add.sprite(50, 50, 'sorlo');
        this.player.anchor.setTo(0.5, 0.5);

        game.physics.arcade.enable(this.player);

        this.player.body.gravity.y = 3000;
        this.player.body.setSize(this.player.width - 10, this.player.height - 5, 0, 0);
        this.player.animations.add('stand', ['stand_0.png', 'stand_1.png', 'stand_2'], 5, true);
        this.player.animations.add('walk', ['Walk_0.png', 'Walk_1.png', 'Walk_2.png', 'Walk_3.png'], 5, false);
        this.player.animations.add('jump', ['Jump_1.png', 'Jump_2.png'], 5, false);
        this.player.body.collideWorldBounds = true;

        this.cursor = game.input.keyboard.createCursorKeys();
        game.camera.follow(this.player);
        this.bgLayer.resizeWorld();
        this.vFsm = new VMotionFsm(this.player);
        this.hFsm = new HMotionFsm(this.player, this.vFsm);
    },

    update: function () {
        game.physics.arcade.collide(this.player, this.collision);
        this.movePlayer();
    },

    render: function () {
        game.debug.cameraInfo(game.camera, 32, 32);
    },

    movePlayer: function () {
        if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0) {
            this.hFsm.rest();
        }

        if (this.vFsm.state == 'air' && this.player.body.blocked.down) {
            this.vFsm.fall();
        }

        if (this.cursor.left.isDown) {
            this.hFsm.moveLeft();
        }

        else if (this.cursor.right.isDown) {
            this.hFsm.moveRight();
        }

        else {
            this.hFsm.rest();
        }

        if (this.cursor.up.isDown && this.player.body.blocked.down) {
            this.vFsm.jump(this.player);
        }
    }
}