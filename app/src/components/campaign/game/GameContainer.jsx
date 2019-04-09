import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Game from 'components/campaign/game/Game';
import Client from 'components/campaign/game/Client';
import GameMediator from 'components/campaign/game/ClientGameMediator';

let width = null;
let height = null;

class GameContainer extends Component {
  static propTypes = {
    campaign: PropTypes.object.isRequired,
    token: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  componentDidMount() {
    // Setup
    width = this.props.width;
    height = this.props.height;
    this.gameMediator = new GameMediator();
    this.game = new Game(this.gameMediator, this.props.campaign, this.props.userId, width, height);
    this.client = new Client(this.gameMediator, this.props.campaign, this.props.token, this.props.userId);

    // Initialize
    this.game.start();
    // this.client.connect();
  }

  componentWillUnmount() {
    this.client.disconnect();
    this.game.destroy();
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
      // this.game.resize(width, height);
    }
    return false;
  }

  render() {
    const {classes} = this.props;

    return (
        <div>
          <div className={classes.phaserContainer} id="phaser-container" ref={this.container}>
          </div>
        </div>
    );
  }
}

export default GameContainer;
