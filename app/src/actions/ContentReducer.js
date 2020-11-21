import {TYPES} from 'actions/ContentActions';
import _ from 'lodash';

const INITIAL_STATE = {
  isLoaded: true,
  instances: [],
  error: false,
  templates: {},
};

export function contentReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.PUT_CONTENT_ITEM_START:
      return {...state, isLoaded: false, error: false};
    case TYPES.PUT_CONTENT_ITEM_SUCCESS:
      return {...state, instances: replaceItem(state.instances, action.contentItem), isLoaded: true, error: false};
    case TYPES.PUT_CONTENT_ITEM_FAILURE:
      return {...state, isLoaded: true, error: action.error};
    case TYPES.LOAD_CONTENT_ITEMS_START:
      return {...state, instances: [], campaignId: action.campaignId, isLoaded: false, error: false};
    case TYPES.LOAD_CONTENT_ITEMS_SUCCESS:
      return {...state, instances: action.contentItems, campaignId: action.campaignId, isLoaded: true, error: false};
    case TYPES.LOAD_CONTENT_ITEMS_FAILURE:
      return {...state, instances: [], isLoaded: true, error: action.error};
    case TYPES.LOAD_CAMPAIGN_START:
      return {...state, instances: [], isLoaded: true, error: false};
    case TYPES.LOAD_TEMPLATES_SUCCESS:
      return {...state, templates: action.templates};
    default:
      return state;
  }
}

function replaceItem(instances, newContentItem) {
  const tempContentItemIndex = _.findLastIndex(instances, (contentItem) => contentItem.id === newContentItem.id);
  if (tempContentItemIndex > -1) {
    return _.concat(_.slice(instances, 0, tempContentItemIndex), newContentItem, _.slice(instances, tempContentItemIndex + 1));
  } else {
    return _.concat(instances, newContentItem);
  }
}

// function removeItem(instances, newContentItem) {
//   const tempContentItemIndex = _.findLastIndex(instances, (contentItem) => contentItem.name = newContentItem.name);
//   if (tempContentItemIndex > -1) {
//     return _.concat(_.slice(instances, 0, tempContentItemIndex), _.slice(instances, tempContentItemIndex + 1));
//   } else {
//     return instances;
//   }
// }

export function getCurrentContentItems(state, campaignId) {
  return state.content.campaignId !== null && state.content.campaignId === campaignId ? state.content.instances : null;
}

export function getTemplates(state) {
  return state.content.templates;
}
