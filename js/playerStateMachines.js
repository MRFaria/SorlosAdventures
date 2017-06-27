var AttackFSM = StateMachine.factory({
    init: 'idle',
    transitions: [
        { name: 'shoot', from: 'idle', to: 'fireBall' },
        { name: 'castIceWall', from: 'idle', to: 'iceWall' },
        { name: 'stand', from: '*', to: 'idle' }
    ],
    data: function (player) {      //  <-- use a method that can be called for each instance
        return {
            player: player
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
    data: function (player, vFSM) {      //  <-- use a method that can be called for each instance
        return {
            player: player,
            FSM: vFSM
        }
    },
    methods: {
        onMoveLeft: function () {
            if (this.FSM.state != 'air') {
                this.player.animations.play('walk');
            }
            if (this.player.body.velocity.x > -250)
                this.player.body.velocity.x -= 20;
            this.player.scale.x = -1 * Math.abs(this.player.scale.x);
        },
        onMoveRight: function (speed) {
            if (this.FSM.state != 'air' && this.player.body.velocity.x < 300) {
                this.player.animations.play('walk');
            }
            if (this.player.body.velocity.x < 250)
                this.player.body.velocity.x += 20;
            this.player.scale.x = 1 * Math.abs(this.player.scale.x);
        },
        onStand: function () {
            if (this.FSM.state == 'air') {
                this.player.animations.play('jump');
            }
            else {
                this.player.body.velocity.x = 0;
            }
        },
    }
});

VMotionFSM = StateMachine.factory({
    init: 'ground',
    transitions: [
        { name: 'jump', from: 'ground', to: 'air' },
        { name: 'fall', from: 'air', to: 'falling' },
        { name: 'stand', from: 'falling', to: 'ground' }
    ],
    data: function (player, vFSM, hFSM) { 
        return {
            player: player,
            vFSM: vFSM,
            hFSM: hFSM
        }
    },
    methods: {
        onJump: function () {
            console.log('I am ' + this.color);
            this.player.body.velocity.y -= 800;
            this.player.animations.play('jump');
        },
        onFall: function () {
            // for now do nothing
        },
        onStand: function () {
            this.player.animations.play('stand');
        }
    }
});

