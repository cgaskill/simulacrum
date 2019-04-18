import Game from 'components/game/Game';
import {connect} from 'react-redux';
import * as GameActions from 'actions/GameActions';
import uuid from 'uuid/v4';

const mapStateToProps = (state, ownProps) => {
  return {
    campaigns: state.campaigns,
    currentEvent: state.game.currentEvent,
    token: state.user.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    triggerEvent: (event) => {
      event.id = uuid();
      dispatch(GameActions.triggerEvent(event));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
