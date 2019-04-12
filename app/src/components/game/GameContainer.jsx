import BootScene from 'components/game/scene/BootScene';
import MapScene from 'components/game/scene/MapScene';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import GameMediator from 'components/game/ClientGameMediator';
import Phaser from 'phaser';

let width;
let height;

class GameContainer extends Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    shutdown: PropTypes.bool,
  };

  componentDidMount() {
    // Setup
    width = this.props.width;
    height = this.props.height;
    this.gameMediator = new GameMediator();

    let config = {
      type: Phaser.AUTO,
      width: this.props.width,
      height: this.props.height,
      backgroundColor: '#FFFFFF',
      scene: [BootScene, MapScene],
    };

    this.game = new Phaser.Game(config);
    this.game.scene.start('boot', {...this.props.campaign, userId: this.props.userId});

    // this.game = new Game(this.gameMediator, this.props.campaign, this.props.userId, width, height);
    // this.client = new Client(this.gameMediator, this.props.campaign, this.props.token, this.props.userId);

    // Initialize
    // this.client.connect();
  }

  componentWillUnmount() {
    // this.client.disconnect();
    this.game.destroy(true);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // We can modify the game's state here
    if ((nextProps.width && nextProps.width !== width) ||
        (nextProps.height && nextProps.height !== height)) {
      if (nextProps.width) {
        width = nextProps.width;
      }
      if (nextProps.height) {
        height = nextProps.height;
      }
      this.game.scale.resize(width, height);
    }
    return false;
  }

  render() {
    return (
        <div id="phaser-container"/>
    );
  }
}

export default GameContainer;
