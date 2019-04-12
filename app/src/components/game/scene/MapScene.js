import Phaser from 'phaser';

export default class MapScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'map',
      active: false,
    });
  }

  init(data) {
    this.data = data;
    this.fontsReady = false;
    this.borderOffset = 32;
    this.squareLength = 32;

    this.currentScene = this.data.sceneConfigs.find((scene) => {
      return scene.sceneId === this.data.gameConfig.currentSceneId;
    });

    // TODO Remove after testing
    this.currentScene.width = 100;
    this.currentScene.height = 100;
  }

  preload() {
    this.map = this.make.tilemap({
      width: this.currentScene.width * 32,
      height: this.currentScene.height * 32,
      tileWidth: 32,
      tileHeight: 32,
    });
    this.tiles = this.map.addTilesetImage('grass_biome');
  }

  create(data) {
    this.currentTile = 0;

    // this.mapLayer
    this.mapLayer = this.add.container(0, 0);
    this.drawGrid(this.mapLayer, this.currentScene);

    this.zooming = false;
    this.zoomAmount = 0;

    this.container = document.getElementById('phaser-container');
    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.ctrlKey) {
        this.zoomAmount += Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * .020;
      } else {
        // posX -= e.deltaX * 2;
        // posY -= e.deltaY * 2;
      }
    }, {passive: false});
    window.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.zoomAmount += 0.020;
    }, {passive: false});
    window.addEventListener('gesturechange', (e) => {
      e.preventDefault();
    }, {passive: false});
    window.addEventListener('gestureend', (e) => {
      e.preventDefault();
    }, {passive: false});
  }

  drawGrid = (mapLayer, currentScene) => {
    const grid = this.add.graphics({
      lineStyle: {
        width: 2,
        color: 0x444444,
      },
      fillStyle: {
        color: 0x29aa2e,
      },
    });
    for (let j = 0; j < currentScene.height; j++) {
      for (let i = 0; i < currentScene.width; i++) {
        grid.strokeRect(i * this.squareLength + this.borderOffset,
            j * this.squareLength + this.borderOffset,
            this.squareLength,
            this.squareLength);
      }
    }

    const hitArea = new Phaser.Geom.Rectangle(
        0,
        0,
        this.squareLength * this.borderOffset,
        this.squareLength * this.borderOffset);

    grid.setInteractive({
      hitArea: hitArea,
        draggable: true,
        hitAreaCallback: (hitArea, x, y, gameObject) => {
      return true;
    }});
    mapLayer.add(grid);

    grid.on('dragstart', (pointer, dragX, dragY) => {
      this.gridPrevX = 0;
      this.gridPrevY = 0;
    });

    grid.on('drag', (pointer, dragX, dragY) => {
      const cam = this.cameras.main;
      const newX = cam.scrollX - dragX + this.gridPrevX;
      const newY = cam.scrollY - dragY + this.gridPrevY;

      cam.setScroll(newX, newY);

      this.gridPrevX = dragX;
      this.gridPrevY = dragY;
    });
  };

  update(time, delta) {
    if (this.zoomAmount !== 0) {
      const cam = this.cameras.main;
      let progressizeZoomAmount = this.zoomAmount * .25;
      if (cam.zoom + progressizeZoomAmount > 0.5 && cam.zoom + progressizeZoomAmount < 3) {
        cam.zoomTo(cam.zoom + progressizeZoomAmount, .25);
      }
      this.zoomAmount -= progressizeZoomAmount;
      if (this.zoomAmount < .001 && this.zoomAmount > -.001) {
        this.zoomAmount = 0;
      }
    }
  }

  onHold(inputManager, position) {
    // TODO what else to do on a long press
    // this.mediator.localLongPress(position.x, position.y);
  }
}
