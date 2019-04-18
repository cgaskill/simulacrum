import BootScene from 'components/game/scene/BootScene';
import MapScene from 'components/game/scene/MapScene';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import GameMediator from 'components/game/ClientGameMediator';
import Phaser from 'phaser';

let width;
let height;
let eventId;

class Game extends Component {
  static propTypes = {
    currentEvent: PropTypes.object.isRequired,
    campaign: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    triggerEvent: PropTypes.func.isRequired,
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
      parent: 'phaser-container',
      scene: [BootScene, MapScene],
    };

    this.game = new Phaser.Game(config);

    const triggerEvent = (event) => {
      event.userId = this.props.userId;
      event.campaignId = this.props.campaign.id;
      this.props.triggerEvent(event);
    };

    this.eventEmitter = new Phaser.Events.EventEmitter();
    this.game.scene.start('boot', {
      ...this.props.campaign,
      token: this.props.token,
      userId: this.props.userId,
      container: 'phaser-container',
      triggerEvent,
      eventEmitter: this.eventEmitter,
    });

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

    if (nextProps.currentEvent.id !== eventId) {
      eventId = nextProps.currentEvent.id;
      this.eventEmitter.emit(nextProps.currentEvent.type, nextProps.currentEvent);
    }

    return false;
  }

  render() {
    return (
        <div id="phaser-container"/>
    );
  }
}

export default Game;
