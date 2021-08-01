import { createContext, useContext, useReducer } from "react";
import AppReducer from './reducer';
import { SET_FETCHING } from './types';

const AppContext = createContext();

const initialState = {
  isFetching: false,
  error: null,
  data: null,
  isAuthenticated: false,
  user: null
};

export const useApp = () => {
  return useContext(AppContext);
}

export default function AppProvider({children}) {
  const app = useProvideApp();
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>
}

function useProvideApp() {
  const [state, dispatch] = useReducer(AppReducer, initialState);
  const {isFetching, error, data, isAuthenticated, user} = state;
  const setFetching = (isFetching) => dispatch({type: SET_FETCHING, payload: isFetching});
  return {
    isFetching,
    error,
    data,
    isAuthenticated,
    user,
    setFetching
  }
}