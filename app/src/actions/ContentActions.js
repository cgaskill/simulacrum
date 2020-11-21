import axios from 'axios';

export const TYPES = {
  PUT_CONTENT_ITEM_START: 'PUT_CONTENT_ITEM_START',
  PUT_CONTENT_ITEM_SUCCESS: 'PUT_CONTENT_ITEM_SUCCESS',
  PUT_CONTENT_ITEM_FAILURE: 'PUT_CONTENT_ITEM_FAILURE',
  LOAD_TEMPLATES_START: 'LOAD_TEMPLATES_START',
  LOAD_TEMPLATES_SUCCESS: 'LOAD_TEMPLATES_SUCCESS',
  LOAD_TEMPLATES_FAILURE: 'LOAD_TEMPLATES_FAILURE',
  LOAD_CONTENT_ITEMS_START: 'LOAD_CONTENT_ITEMS_START',
  LOAD_CONTENT_ITEMS_SUCCESS: 'LOAD_CONTENT_ITEMS_SUCCESS',
  LOAD_CONTENT_ITEMS_FAILURE: 'LOAD_CONTENT_ITEMS_FAILURE',
};

export function putContentItem(contentItem) {
  return (dispatch) => {
    dispatch(putContentStart(contentItem));
    return axios.put('/api/content/', contentItem)
    .then((response) => {
      dispatch(putContentSuccess(response.data));
    }).catch((error) => {
      dispatch(putContentFailure(error, contentItem));
    });
  };
}

export function loadContentItems(campaignId) {
  return (dispatch) => {
    dispatch(loadContentItemsStart(campaignId));
    return axios.get(`/api/content/${campaignId}/load`)
    .then((response) => {
      dispatch(loadContentItemsSuccess(campaignId, response.data));
    }).catch((error) => {
      dispatch(loadContentItemsFailure(error));
    });
  };
}

export function loadTemplates() {
  return (dispatch) => {
    dispatch(loadTemplateStart());
    return axios.get('/api/content/item/templates')
      .then((response) => {
        dispatch(loadTemplateSuccess(response.data['contentItemTemplates']));
      }).catch((error) => {
        dispatch(loadTemplateFailure(error));
      });
  };
}

export function putContentStart(contentItem) {
  return {
    type: TYPES.PUT_CONTENT_ITEM_START,
    contentItem,
  };
}

export function putContentSuccess(contentItem) {
  return {
    type: TYPES.PUT_CONTENT_ITEM_SUCCESS,
    contentItem,
  };
}

export function putContentFailure(error, contentItem) {
  return {
    type: TYPES.PUT_CONTENT_ITEM_FAILURE,
    error,
    contentItem,
  };
}

export function loadTemplateStart() {
  return {
    type: TYPES.LOAD_TEMPLATES_START,
  };
}

export function loadTemplateSuccess(templates) {
  return {
    type: TYPES.LOAD_TEMPLATES_SUCCESS,
    templates,
  };
}

export function loadTemplateFailure(error) {
  return {
    type: TYPES.LOAD_TEMPLATES_FAILURE,
    error,
  };
}

export function loadContentItemsStart(campaignId) {
  return {
    type: TYPES.LOAD_CONTENT_ITEMS_START,
    campaignId,
  };
}

export function loadContentItemsSuccess(campaignId, contentItems) {
  return {
    type: TYPES.LOAD_CONTENT_ITEMS_SUCCESS,
    contentItems,
    campaignId,
  };
}

export function loadContentItemsFailure(error) {
  return {
    type: TYPES.LOAD_CONTENT_ITEMS_FAILURE,
    error,
  };
}

