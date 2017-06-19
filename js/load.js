/// <reference path="game.js" />

var loadState = {
    preload: function () {

        var loadingLabel = game.add.text(game.width / 2, 150, 'loading...',
            { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);

        var progressBar = game.add.sprite(game.width / 2, 300, 'progressBar');
        progressBar.anchor.set(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        game.load.atlas('sorlo', 'assets/sorlo/sorlosheet.png',
            'assets/sorlo/sorlo.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

        game.load.image('goodly-2x', 'assets/goodly-2x.png'); 
        game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
    },

    create: function () {
        game.state.start('menu');

    }
}