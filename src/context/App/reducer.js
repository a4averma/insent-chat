import { SET_FETCHING } from "./types";

export default function AppReducer(state, action) {
  switch (action.type) {
    case SET_FETCHING:
      return {
        ...state,
        isFetching: action.payload,
      }
    default:
      return state;
  }
};