import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'boot',
      active: false,
    });
  }

  init(data) {
    this.data = data;
  }

  preload() {
    this.game.scale.setScreenSize = true;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    this.load.tilemapTiledJSON('mapmaker', '/assets/test.json');
    this.load.image('grass_biome', '/assets/overworld_tileset_grass.png', 16, 16);
  }

  create() {
    this.scene.start('map', this.data);
  }
}
