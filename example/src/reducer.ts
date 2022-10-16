import { combineReducers } from 'redux';
import type { Game } from './model';

const games = (state: Game[] = [], action: any) => {
  switch (action.type) {
    case 'SET_GAMES':
      return action.payload;
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  games,
});
