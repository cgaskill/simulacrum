import {TYPES} from 'actions/GameActions';

const INITIAL_STATE = {
  currentEvent: {},
};

export function gameReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.PLACE_TOKEN:
      return {...state, currentEvent: {...action.event, type: TYPES.PLACE_TOKEN}};
    default:
      return state;
  }
}
