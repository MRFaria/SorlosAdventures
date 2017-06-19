/// <reference path="../phaser.js" />

this._width = window.innerWidth;
this._height = window.innerHeight;

this.game = new Phaser.Game(this._width, this._height, Phaser.CANVAS, 'gameDiv');

game.global = {
    score: 0
};

game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('play', playState);
game.state.add('menu', playState);

game.state.start('boot');