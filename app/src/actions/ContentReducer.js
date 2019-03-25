import {TYPES} from "actions/ContentActions";
import _ from "lodash";

const INITIAL_STATE = {
  isLoading: true,
  instances: [],
  error: false,
};

export function contentReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case TYPES.PUT_CONTENT_ITEM_START:
      return {...state, isLoading: true, error: false};
    case TYPES.PUT_CONTENT_ITEM_SUCCESS:
      return {...state, instances: replaceItem(state.instances, action.contentItem), isLoading: false, error: false};
    case TYPES.PUT_CONTENT_ITEM_FAILURE:
      return {...state, isLoading: false, error: action.error};
    case TYPES.LOAD_CONTENT_ITEMS_START:
      return {...state, instances: [], campaignId: action.campaignId, isLoading: true, error: false};
    case TYPES.LOAD_CONTENT_ITEMS_SUCCESS:
      return {...state, instances: action.contentItems, campaignId: action.campaignId, isLoading: false, error: false};
    case TYPES.LOAD_CONTENT_ITEMS_FAILURE:
      return {...state, instances: [], isLoading: false, error: action.error};
    case TYPES.LOAD_CAMPAIGN_START:
      return {...state, instances: [], isLoading: false, error: false};
    default:
      return state;
  }
}

function replaceItem(instances, newContentItem) {
  const tempContentItemIndex = _.findLastIndex(instances, (contentItem) => contentItem.id = newContentItem.id);
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
