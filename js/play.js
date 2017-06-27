/// <reference path="game.js" />
/// <reference path="../state-machine.min.js" />
/// <reference path="../phaser.js" />

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

        this.vFSM = new VMotionFSM(this.player);
        this.hFSM = new HMotionFSM(this.player, this.vFSM);
        this.attackFSM = new AttackFSM(this.player, this.vFSM, this.hFSM);

        game.physics.arcade.enable(this.player);

        this.player.body.gravity.y = 3000;
        this.player.body.setSize(this.player.width - 10, this.player.height - 5, 0, 0);
        this.cursor = game.input.keyboard.createCursorKeys();
        game.camera.follow(this.player);
        this.bgLayer.resizeWorld();

        this.player.skillQueue = [];
        this.createAnimations();
        this.player.text = game.add.text(0, window.innerHeight - 50, 'Q W E',
            { font: '30px Arial', fill: '#ffffff' });
        this.player.text.fixedToCamera = true;

        this.handleCastingInputs()
    },

    update: function () {
        game.physics.arcade.collide(this.player, this.collision);
        this.updateState();
    },

    render: function () {
        game.debug.cameraInfo(game.camera, 32, 32);
    },

    updateState: function () {
        if (this.vFSM.state == 'falling' && this.player.body.blocked.down) {
            this.vFSM.stand();
        }
    },

    createAnimations: function () {
        this.player.animations.add('stand', ['stand_0.png', 'stand_1.png', 'stand_2'], 5, true);
        this.player.animations.add('walk', ['Walk_0.png', 'Walk_1.png', 'Walk_2.png', 'Walk_3.png'], 5, false);
        jump = this.player.animations.add('jump', ['Jump_1.png', 'Jump_2.png'], 5, false);
        shoot = this.player.animations.add('shoot', ['Shoot_0.png', 'Shoot_1.png', 'Shoot_2.png', 'Shoot_3.png',
            'Shoot_4.png', 'Shoot_5.png'], 20, false);
        var frames = Phaser.Animation.generateFrameNames('IceSpell_', 0, 13, '.png')
        console.log(frames);
        iceWall = this.player.animations.add('iceWall', frames,
            15, false);
        this.player.body.collideWorldBounds = true;

        shoot.onComplete.add(function () { this.attackFSM.stand() }, this);
        iceWall.onComplete.add(function () { this.attackFSM.stand() }, this);
        iceWall.onComplete.add(function () { this.vFSM.fall() }, this);
    },

    handleCastingInputs: function () {
        wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        wKey.name = 'W';
        qKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        qKey.name = 'Q';
        eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        eKey.name = 'E';
        sKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        sKey.name = 'S';
        wKey.onDown.add(invoke, { key: wKey, player: this.player });
        qKey.onDown.add(invoke, { key: qKey, player: this.player });
        eKey.onDown.add(invoke, { key: eKey, player: this.player });
        sKey.onDown.add(cast, { keys: this.player.skillQueue, player: this.player, game: this });
    },
}

function invoke() {
    console.log("key was pressed");
    var array = this.player.skillQueue;

    if (array.length >= 3)
        array.shift();

    array.push(this.key);

    text = '';
    for (var i = 0; i < array.length; i++) {
        text += array[i].name;
    }

    this.player.text.setText(text);
}

function cast() {
    if (this.game.hFSM.state == 'idle' && this.game.vFSM.state == 'ground') {
        if (this.player.text.text.split('').sort().join('') == 'WWW') {
            console.log("Casting WWW");
            this.game.attackFSM.shoot();
        }
        if (this.player.text.text.split('').sort().join('') == 'EEE') {
            console.log('Casting EEE');
            this.game.attackFSM.castIceWall();
        }
    }

}

