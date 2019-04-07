import Phaser from 'components/campaign/game/Phaser';
import BootState from 'components/campaign/game/states/BootState';
import MapState from 'components/campaign/game/states/MapState';

// TODO implement hot reloading like in this gist: https://gist.github.com/fkrauthan/6c8cc7aaf597b911449e5a5d02578ce6
export default class Game extends Phaser.Game {
  constructor(mediator, config, userId, width, height) {
    super(width, height, Phaser.AUTO, 'phaser-container');


    this.config = config;
    this.mediator = mediator;
    this.mediator.setGame(this);

    this.state.add('boot', new BootState(mediator, config, userId));
    this.state.add('map', new MapState(mediator, config, userId));
  }

  start() {
    this.state.start('boot');
  }

  create() {
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
  }

  init() {
    this.stage.disableVisibilityChange = true;
  }

  preload() {
    // load all of the campaign assets
  }
}
