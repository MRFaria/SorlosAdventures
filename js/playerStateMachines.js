var AttackFSM = StateMachine.factory({
    init: 'idle',
    transitions: [
        { name: 'shoot', from: 'idle', to: 'fireBall' },
        { name: 'castIceWall', from: 'idle', to: 'iceWall' },
        { name: 'stand', from: '*', to: 'idle' }
    ],
    data: function (game) {      //  <-- use a method that can be called for each instance
        return {
            player: game.player
        }
    },
    methods: {
        onShoot: function () {
            this.player.animations.play('shoot');
        },
        onCastIceWall: function () {
            this.player.animations.play('iceWall');
        },
        onStand: function () {
            this.player.animations.play('stand');
        }
    }
});

HMotionFSM = StateMachine.factory({
    init: 'idle',
    transitions: [
        { name: 'moveLeft', from: '*', to: 'left' },
        { name: 'moveRight', from: '*', to: 'right' },
        { name: 'stand', from: '*', to: 'idle' },
    ],
    data: function (game) {      //  <-- use a method that can be called for each instance
        return {
            player: game.player,
            game: game,
        }
    },
    methods: {
        onMoveLeft: function () {
            vel = 250;
            if (this.game.vFSM.state != 'air')
                this.player.animations.play('walk');
            this.player.body.velocity.x = -vel;
            this.player.scale.x = -1 * Math.abs(this.player.scale.x);
        },
        onMoveRight: function () {
            vel = 250;
            if (this.game.vFSM.state != 'air')
                this.player.animations.play('walk');
            this.player.body.velocity.x = vel;
            this.player.scale.x = 1 * Math.abs(this.player.scale.x);
        },
        onStand: function () {
            if (this.game.vFSM.state == 'idle' && this.game.attackFSM.state == 'idle')
                this.player.animations.play('stand');
            this.player.body.velocity.x = 0;
        },
    }
});


VMotionFSM = StateMachine.factory({
    init: 'ground',
    transitions: [
        { name: 'jump', from: 'ground', to: 'air' },
        { name: 'fall', from: 'air', to: 'ground' }
    ],
    data: function (game) {
        return {
            player: game.player,
        }
    },
    methods: {
        onJump: function () {
            vel = 650,
            this.player.body.velocity.y -= vel;
            this.player.animations.play('jump');
        },
        onFall: function () {
            this.player.animations.play('stand');
        },
    }
});

