/// <reference path="game.js" />
/// <reference path="../state-machine.min.js" />
/// <reference path="../phaser.min.js" />

var AttackFsm = StateMachine.factory({
    init: 'idle',
    transitions: [
      { name: 'shoot', from: '*', to: 'fireBall' }
    ],
    data: function (player) {      //  <-- use a method that can be called for each instance
        return {
            player: player
        }
    },
    methods: {
        onShoot: function () {
            this.player.animations.play('shoot');
        }
    }
});

var HMotionFsm = StateMachine.factory({
    init: 'idle',
    transitions: [
      { name: 'moveLeft', from: '*', to: 'left' },
      { name: 'moveRight', from: '*', to: 'right' },
      { name: 'stand', from: '*', to: 'idle' },
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
            if (this.player.body.velocity.x > -250)
                this.player.body.velocity.x -= 20;
            this.player.scale.x = -1 * Math.abs(this.player.scale.x);
        },
        onMoveRight: function (speed) {
            if (this.fsm.state != 'air' && this.player.body.velocity.x < 300) {
                this.player.animations.play('walk');
            }
            if (this.player.body.velocity.x < 250)
                this.player.body.velocity.x += 20;
            this.player.scale.x = 1 * Math.abs(this.player.scale.x);
        },
        onStand: function () {
            if (this.fsm.state == 'air') {
                this.player.animations.play('jump');
            }
            else {
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
            this.player.animations.play('stand');
        },
    }
});


var playState = {
    preload: function () {
    },

    create: function () {
        //this.text.

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
        this.player.animations.add('shoot', ['Shoot_0.png', 'Shoot_1.png', 'Shoot_2.png', 'Shoot_3.png',
        'Shoot_4.png', 'Shoot_5.png'], 20, false);
        this.player.body.collideWorldBounds = true;

        this.cursor = game.input.keyboard.createCursorKeys();
        game.camera.follow(this.player);
        this.bgLayer.resizeWorld();

        this.player.skillQueue = [];

        this.vFsm = new VMotionFsm(this.player);
        this.hFsm = new HMotionFsm(this.player, this.vFsm);
        this.player.text = game.add.text(0, window.innerHeight - 50, 'Q W E',
            { font: '30px Arial', fill: '#ffffff' });
        this.player.text.fixedToCamera = true;

        this.attackFsm = new AttackFsm(this.player);
        this.waiting = false;
        this.skill();

    },

    update: function () {
        game.physics.arcade.collide(this.player, this.collision);
        this.movePlayer();
        this.time = game.time.now;

    },

    render: function () {
        game.debug.cameraInfo(game.camera, 32, 32);
    },

    movePlayer: function () {
        if (this.player.body.velocity.x == 0 && this.player.body.velocity.y == 0) {
            this.hFsm.stand();
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
            this.hFsm.stand();
        }

        if (this.cursor.up.isDown && this.player.body.blocked.down) {
            this.vFsm.jump(this.player);
        }
    },

    skill: function () {
        wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKey.name = 'W';
        qKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        qKey.name = 'Q';
        eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        eKey.name = 'E';
        rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
        rKey.name = 'R';
        wKey.onDown.add(invoke, {key: wKey, player: this.player});
        qKey.onDown.add(invoke, {key: qKey, player: this.player});
        eKey.onDown.add(invoke, {key: eKey, player: this.player});
        rKey.onDown.add(cast,  {keys: this.player.skillQueue, player: this.player});
    },
}

function invoke() {
    console.log("key was pressed");
    var array = this.player.skillQueue;

    if(array.length >= 3)
        array.shift();

    array.push(this.key);

    text = '';
    for (var i = 0; i < array.length; i++)
    {
        text += array[i].name;
    }

    this.player.text.setText(text);
}

function cast() {
    console.log("Invoking Spell");
}

