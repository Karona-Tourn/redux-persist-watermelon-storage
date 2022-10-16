import type { Game } from './model';

export const setGames = (games: Game[]) => {
  return {
    type: 'SET_GAMES',
    payload: games,
  };
};
