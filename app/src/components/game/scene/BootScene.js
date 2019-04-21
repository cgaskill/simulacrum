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

  }

  create() {
    this.scene.start('map', this.data);
  }
}
