import {TYPES} from 'actions/GameActions';
import Phaser from 'phaser';

const LAYERS = {
  MAP: 'MAP',
  TOKEN: 'TOKEN',
  GM: 'GM',
};

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
    this.squareLength = 64;

    this.currentScene = this.data.sceneConfigs.find((scene) => {
      return scene.sceneId === this.data.gameConfig.currentSceneId;
    });

    // TODO Remove after testing
    this.currentScene.width = 100;
    this.currentScene.height = 100;

    this.load.xhr.header = 'Authorization';
    this.load.xhr.headerValue = `Bearer ${this.data.token}`;
  }

  preload() {
    // TODO load existing tokens

  }

  create(data) {
    this.mapLayer = this.add.container(0, 0);
    this.tokenLayer = this.add.container(0, 0);
    this.gmLayer = this.add.container(0, 0);

    this.layerMap = {};
    this.layerMap[LAYERS.MAP] = this.mapLayer;
    this.layerMap[LAYERS.TOKEN] = this.tokenLayer;
    this.layerMap[LAYERS.GM] = this.gmLayer;
    this.currentLayer = LAYERS.TOKEN;

    this.grid = this.drawGrid(this.mapLayer, this.currentScene);

    this.zoomAmount = 0;

    this.handleInteractions();
    this.registerActions();
  }

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

  drawGrid = (mapLayer, currentScene) => {
    const displayArea = new Phaser.Geom.Rectangle(
        -20 * this.borderOffset,
        -20 * this.borderOffset,
        currentScene.width * this.squareLength + this.borderOffset * 10,
        currentScene.height * this.squareLength + this.borderOffset * 10);

    this.cameras.main.setBounds(displayArea.x, displayArea.y, displayArea.width, displayArea.height);

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

    grid.setInteractive({
      hitArea: displayArea,
        draggable: true,
        hitAreaCallback: (hitArea, x, y, gameObject) => {
      return true;
    }});

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

    mapLayer.add(grid);
    return grid;
  };


  registerActions = () => {
    this.data.eventEmitter.on(TYPES.PUT_TOKEN_SUCCESS, this.placeToken, this);
  };

  onHold(inputManager, position) {
    // TODO what else to do on a long press
    // this.mediator.localLongPress(position.x, position.y);
  }

  handleInteractions() {
    this.container = document.getElementById(this.data.container);

    window.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.ctrlKey) {
        this.zoomAmount += Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * .020;
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


    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      this.container.addEventListener(eventName, function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
        if (eventName === 'drop') {
          handleDrop(e);
        }
      }, false);
    });

    const handleDrop = (ev) => {
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (ev.dataTransfer.items[i].kind === 'file') {
            const file = ev.dataTransfer.items[i].getAsFile();
            const worldLocation = this.cameras.main.getWorldPoint(ev.clientX, ev.clientY);
            this.data.triggerEvent({
              type: TYPES.SAVE_IMAGE,
              image: file,
              x: worldLocation.x,
              y: worldLocation.y,
              layer: this.currentLayer,
            });
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
          const file = ev.dataTransfer.files[i];
          const worldLocation = this.cameras.main.getWorldPoint(ev.clientX, ev.clientY);
          this.data.triggerEvent({
            type: TYPES.SAVE_IMAGE,
            image: file,
            x: worldLocation.x,
            y: worldLocation.y,
            layer: this.currentLayer,
          });
        }
      }
    };
  }

  placeToken = (event) => {
    const token = event.token;
    this.load.on('filecomplete', (key, type, texture) => {
      this.add.image(token.x, token.y, key);

      // TODO Make image movable
    }, this);
    this.load.image(token.id, token.imageUrl);
    this.load.start();
  };
}
