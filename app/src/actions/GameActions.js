import axios from 'axios';

export const TYPES = {
  PUT_IMAGE_START: 'PUT_IMAGE_START',
  PUT_IMAGE_SUCCESS: 'PUT_IMAGE_SUCCESS',
  PUT_IMAGE_FAILURE: 'PUT_IMAGE_FAILURE',
  PLACE_TOKEN: 'PLACE_TOKEN',
  SAVE_IMAGE: 'SAVE_IMAGE',
};

export const eventMap = {
  'SAVE_IMAGE': saveImage,
};

export function triggerEvent(event) {
  return (dispatch) => {
    if (eventMap[event.type]) {
      dispatch(eventMap[event.type](event));
    } else {
      console.log('Unregistered event: ' + event.type);
    }
  };
}

export function saveImage(event) {
  return (dispatch) => {
    const {campaignId, image} = event;
    dispatch(putImageStart(image));

    const formData = new FormData();
    formData.append('image', image);
    return axios.put(`/api/content/${campaignId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      dispatch(putImageSuccess(response.data, event));
      // TODO persist token location
      dispatch(placeToken({...event, imageUrl: `/api/content/${campaignId}/image/${image.name}`}));
    }).catch((error) => {
      dispatch(putImageFailure(error, image));
    });
  };
}

export function putImageStart(event) {
  return {
    type: TYPES.PUT_IMAGE_START,
    event,
  };
}

export function putImageSuccess(responseData, event) {
  return {
    type: TYPES.PUT_IMAGE_SUCCESS,
    responseData,
    event,
  };
}

export function putImageFailure(error, event) {
  return {
    type: TYPES.PUT_IMAGE_FAILURE,
    error,
    event,
  };
}

export function placeToken(event) {
  return {
    type: TYPES.PLACE_TOKEN,
    event,
  };
}
