/// <reference path="game.js" />

var menuState = {
    preload: function () {        
    },

    create: function () {
        game.state.start('play');
    }
}