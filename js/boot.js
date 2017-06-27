/// <reference path="game.js" />

var bootState = {
    preload: function () {
        game.load.image('progressBar', 'assets/progressBar.png');
    },

    create: function () {
        game.stage.backgroundColor = '#316fc2';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.renderer.renderSession.roundPixels = true;

        //centre the game
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.refresh();

        game.state.start('load');
    }
}
