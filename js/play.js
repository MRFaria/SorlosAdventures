/// <reference path="game.js" />
/// <reference path="../state-machine.min.js" />
/// <reference path="../phaser.min.js" />
//var FSM = new StateMachine({
//            init: 'ground',
//            transitions: [
//              { name: 'jump', from: 'ground', to: 'air' },
//              { name: 'fall', from: 'air', to: 'ground' },
//              { name: 'climbDown', from: 'ground', to: 'hang' },
//              { name: 'hang', from: 'air', to: 'hang' },
//            ],
//            data: function (player) {      //  <-- use a method that can be called for each instance
//                return {
//                    player: player
//                }
//            },
//            methods: {
//                onJump: function () {
//                    console.log(this.player.body.velocity.x);
//                    this.player.body.velocity.y -= 800;
//                    this.player.animations.play('jump');
//                }
//            }
//        });

  var FSM = StateMachine.factory({
    init: 'ground',
    transitions: [
      { name: 'jump', from: 'ground', to: 'air' },
      { name: 'rest', from: 'air', to: 'ground' }
    ],
    data: function(player) {      //  <-- use a method that can be called for each instance
      return {
        player: player
      }
    },
    methods: {
      onJump: function() {
        console.log('I am ' + this.color);
        this.player.body.velocity.y -= 800;
        this.player.animations.play('jump');
      }
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

        this.cursor = game.input.keyboard.createCursorKeys();
        game.camera.follow(this.player);
        this.bgLayer.resizeWorld();
        this.fsm = new FSM(this.player);
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
            this.player.animations.play();
        }

        if (this.fsm.state == 'air' && this.player.body.blocked.down) {
            this.fsm.rest();
        }

        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -200;
            this.player.animations.play('walk');
            this.player.scale.x = -1 * Math.abs(this.player.scale.x);
        }

        else if (this.cursor.right.isDown) {
            this.player.animations.play('walk');
            this.player.body.velocity.x = 200;
            this.player.rotation = 0
            this.player.scale.x = Math.abs(this.player.scale.x);
        }

        else {
            this.player.body.velocity.x = 0;
        }

        if (this.cursor.up.isDown && this.player.body.blocked.down) {
            this.fsm.jump(this.player);
        }
    }
}