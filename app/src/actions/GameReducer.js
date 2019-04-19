import {TYPES} from 'actions/GameActions';

const INITIAL_STATE = {
  currentEvent: {},
};

export function gameReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.PUT_TOKEN_SUCCESS:
      return {...state, currentEvent: action.event, currentEventType: TYPES.PUT_TOKEN_SUCCESS};
    default:
      return state;
  }
}
