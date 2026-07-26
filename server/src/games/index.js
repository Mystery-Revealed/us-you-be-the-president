// games/index.js — registry of playable games. GameManager looks games up here.
// This repo ships one U.S. History Unit 4 game: You Be the President.

import usYouBeThePresident from './usYouBeThePresident.js';

export const GAMES = {
  [usYouBeThePresident.id]: usYouBeThePresident,
};

export function getGame(id) {
  return GAMES[id] || null;
}
