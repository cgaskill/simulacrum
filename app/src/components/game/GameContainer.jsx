import Game from 'components/game/Game';
import {connect} from 'react-redux';
import * as GameActions from 'actions/GameActions';

const mapStateToProps = (state, ownProps) => {
  return {
    campaigns: state.campaigns,
    currentEvent: state.game.currentEvent,
    currentEventType: state.game.currentEventType,
    token: state.user.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    triggerEvent: (event) => {
      dispatch(GameActions.triggerEvent(event));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
