import axios from "axios";

export const TYPES = {
  CREATE_CONTENT_ITEM_START: "CREATE_CONTENT_ITEM_START",
  CREATE_CONTENT_ITEM_SUCCESS: "CREATE_CONTENT_ITEM_SUCCESS",
  CREATE_CONTENT_ITEM_FAILURE: "CREATE_CONTENT_ITEM_FAILURE",
  LOAD_CONTENT_ITEMS_START: "LOAD_CONTENT_ITEMS_START",
  LOAD_CONTENT_ITEMS_SUCCESS: "LOAD_CONTENT_ITEMS_SUCCESS",
  LOAD_CONTENT_ITEMS_FAILURE: "LOAD_CONTENT_ITEMS_FAILURE",
};

export function createContentItem(contentItem) {
  return (dispatch, getState) => {
    dispatch(createContentStart(contentItem));
    return axios.post("/api/content/", contentItem)
    .then((response) => {
      dispatch(createContentSuccess(response.data));
    }).catch((error) => {
      dispatch(createContentFailure(error, contentItem));
    });
  };
}

export function loadContentItems(campaignId) {
  return (dispatch, getState) => {
    dispatch(loadContentItemsStart(campaignId));
    return axios.get(`/api/content/${campaignId}/load`)
    .then((response) => {
      dispatch(loadContentItemsSuccess(campaignId, response.data));
    }).catch((error) => {
      dispatch(loadContentItemsFailure(error));
    });
  };
}

export function createContentStart(contentItem) {
  return {
    type: TYPES.CREATE_CONTENT_ITEM_START,
    contentItem,
  };
}

export function createContentSuccess(contentItem) {
  return {
    type: TYPES.CREATE_CONTENT_ITEM_SUCCESS,
    contentItem,
  };
}

export function createContentFailure(error, contentItem) {
  return {
    type: TYPES.CREATE_CONTENT_ITEM_FAILURE,
    error,
    contentItem,
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

