import {TYPES} from 'actions/CampaignActions';

const INITIAL_STATE = {
  isLoaded: false,
  instances: [],
  current: null,
  error: false,
};

export function campaignReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.LOAD_CAMPAIGNS_START:
      return {...state, instances: [], current: null, isLoaded: false, error: false};
    case TYPES.LOAD_CAMPAIGNS_SUCCESS:
      return {...state, instances: action.campaigns, isLoaded: true, error: false};
    case TYPES.LOAD_CAMPAIGNS_FAILURE:
      return {...state, instances: [], isLoaded: true, error: action.error};
    case TYPES.LOAD_CAMPAIGN_START:
      return {...state, current: null, isLoaded: false, error: false};
    case TYPES.LOAD_CAMPAIGN_SUCCESS:
      return {...state, current: action.campaign, isLoaded: true, error: false};
    case TYPES.LOAD_CAMPAIGN_FAILURE:
      return {...state, ...state.instances, isLoaded: true, error: action.error};
    case TYPES.ADD_CAMPAIGN_SUCCESS:
      return {...state, instances: [action.campaign, ...state.instances], error: false};
    case TYPES.ACCEPT_INVITE_SUCCESS:
      return {...state, instances: [action.campaign, ...state.instances], error: false};
    case TYPES.ADD_CAMPAIGN_FAILURE:
      return {...state, error: action.error};
    default:
      return state;
  }
}

export function getCurrentCampaign(state, campaignId) {
  return state.campaigns.current !== null && state.campaigns.current.id === campaignId ? state.campaigns.current : null;
}
