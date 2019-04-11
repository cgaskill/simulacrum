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
    // this.backgroundColor = '#FFFFFF';
    this.fontsReady = false;
    this.borderOffset = 32;
    this.squareLength = 32;

    this.currentScene = this.data.sceneConfigs.find((scene) => {
      return scene.sceneId === this.data.gameConfig.currentSceneId;
    });

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
    // create a group for our graphics
    // this.mapLayer = this.map.createDynamicLayer('Map', this.tiles);

    // this.game.stage.backgroundColor = "#77c6ff";
    // this.cameras.main.setViewPort(0, 0,
    //     this.borderOffset * 2 + this.squareLength * currentScene.width,
    //     this.borderOffset * 2 + this.squareLength * currentScene.height);

    // this.size = new Phaser.Rectangle(0, 0,
    //     this.borderOffset * 2 + this.squareLength * currentScene.width,
    //     this.borderOffset * 2 + this.squareLength * currentScene.height);

    // TODO create the current scene
    // this.backgroundLayer = this.map.create('scene-' + currentScene.sceneId,
    //     currentScene.width, currentScene.height, 32, 32);
    // this.backgroundLayer.resizeWorld();

    // this.currentLayer = this.backgroundLayer;
    this.currentTile = 0;

    // this.createTileSelector();

    // this.mapLayer
    this.mapLayer = this.add.container(0, 0);
    this.drawGrid(this.mapLayer, this.currentScene);

    this.zooming = false;
    this.zoomAmount = 0;

    this.container = document.getElementById('phaser-container');
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.ctrlKey) {
        this.zoomAmount += Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * .01;
      } else {
        // posX -= e.deltaX * 2;
        // posY -= e.deltaY * 2;
      }
    });
    this.container.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.zoomAmount += 0.01;
    });
    this.container.addEventListener('gesturechange', (e) => {
      e.preventDefault();
    });
    this.container.addEventListener('gestureend', (e) => {
      e.preventDefault();
    });
  }

  // TODO drawlines instead of having individual rectangles?
  drawGrid(mapLayer, currentScene) {
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

    // grid.inputEnabled = true;
    // grid.input.enableDrag();
    // grid.events.onDragStart.add(this.gridOnDragStart, this);
    // grid.events.onDragUpdate.add(this.gridOnDragUpdate, this);
    // grid.events.onDragStop.add(this.gridOnDragStop, this);
    // grid.events.onInputUp.add(this.gridOnInputUp, this);
    mapLayer.add(grid); // moves from world stage to group as a child
  }

  update(time, delta) {
    if (this.zoomAmount !== 0) {
      // TODO prevent zooming if screen is too small/large
      // this.game.camera.scale.x += this.zoomAmount;
      // this.game.camera.scale.y += this.zoomAmount;

      // this.game.camera.bounds.x = this.size.x * this.game.camera.scale.x;
      // this.game.camera.bounds.y = this.size.y * this.game.camera.scale.y;
      // this.game.camera.bounds.width = this.size.width * this.game.camera.scale.x;
      // this.game.camera.bounds.height = this.size.height * this.game.camera.scale.y;

      // TODO zoom around mouse
      // this.game.camera.x += -1 * this.zoomAmount / 2;
      // this.game.camera.y += -1 * this.zoomAmount / 2;

      // this.zoomAmount = 0;
    }
  }

  gridOnDragStart = (grid, pointer, startX, startY) => {
    this.gridPrevX = startX;
    this.gridPrevY = startY;
  };

  gridOnDragUpdate = (grid, startPointer, nextX, nextY, snapPointer, fromStart) => {
    // move the camera by the amount the mouse has moved since last update
    if (nextX !== 0 || nextY !== 0) {
      this.camera.x -= nextX;
      this.camera.y -= nextY;
    }
  };

  gridOnDragStop = (grid, pointer) => {

  };

  onHold(inputManager, position) {
    // TODO what else to do on a long press
    // this.mediator.localLongPress(position.x, position.y);
  }

  // gridOnInputUp = (grid, pointer, isOver) => {
  //   // TODO find the closest tile to position
  //   // TODO check if a tile already exists in the tile
  //   // TODO replace the tile if different than currently expected
  //   if ((pointer.timeDown + this.game.input.tapRate) > this.game.time.time) {
  //     // Is the creator changing the tile type?
  //     this.marker.x = this.currentLayer.getTileX(this.game.input.activePointer.worldX) * 32;
  //     this.marker.y = this.currentLayer.getTileY(this.game.input.activePointer.worldY) * 32;
  //
  //     this.map.putTile(this.currentTile,
  //         this.currentLayer.getTileX(this.marker.x),
  //         this.currentLayer.getTileY(this.marker.y), this.currentLayer);
  //       // map.fill(currentTile, currentLayer.getTileX(marker.x), currentLayer.getTileY(marker.y), 4, 4, currentLayer);
  //   } else if ((pointer.timeDown + this.game.input.tapRate) > this.game.time.time) {
  //     // What to do with double tap?
  //   }
  // };

  // createTileSelector() {
  //   //  Our tile selection window
  //   let tileSelectorBackground = this.map.createDynamicLayer('Tile Selector');
  //   tileSelectorBackground.beginFill(0x000000, 0.5);
  //   tileSelectorBackground.drawRect(0, 0, 800, 34);
  //   tileSelectorBackground.endFill();
  //
  //   tileSelector.add(tileSelectorBackground);
  //
  //   // TODO update color palette
  //   let tileStrip = tileSelector.create(1, 1, 'ground_1x1');
  //   tileStrip.inputEnabled = true;
  //   tileStrip.events.onInputDown.add(this.pickTile, this);
  //
  //   tileSelector.fixedToCamera = true;
  //
  //   //  Our painting marker
  //   this.marker = this.game.add.graphics();
  //   this.marker.lineStyle(2, 0x000000, 1);
  //   this.marker.drawRect(0, 0, 32, 32);
  // }

  pickTile(sprite, pointer) {
    this.currentTile = this.game.math.snapToFloor(pointer.x, 32) / 32;
  }

  render() {
    // this.game.debug.inputInfo(16, 16);
    // this.game.debug.cameraInfo(this.game.camera, 32, 32);
  }
}
