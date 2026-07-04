import type { Language } from "./types";

export const PLAYER_ID_KEY = "fd_player_id";
export const PLAYER_NUMBER_KEY = "fd_player_number";
export const LANGUAGE_KEY = "fd_language";
export const OPERATOR_KEY = "fd_operator";

export function getStoredLanguage(): Language {
  const v = localStorage.getItem(LANGUAGE_KEY);
  return v === "ja" ? "ja" : "en";
}

export function setStoredLanguage(lang: Language) {
  localStorage.setItem(LANGUAGE_KEY, lang);
}

export function getStoredPlayerNumber(): string | null {
  return localStorage.getItem(PLAYER_NUMBER_KEY);
}

export function getStoredPlayerId(): string | null {
  return localStorage.getItem(PLAYER_ID_KEY);
}

export function storePlayer(id: string, playerNumber: string) {
  localStorage.setItem(PLAYER_ID_KEY, id);
  localStorage.setItem(PLAYER_NUMBER_KEY, playerNumber);
}

export function clearStoredPlayer() {
  localStorage.removeItem(PLAYER_ID_KEY);
  localStorage.removeItem(PLAYER_NUMBER_KEY);
}

export function isOperator(): boolean {
  return sessionStorage.getItem(OPERATOR_KEY) === "true";
}

export function setOperator(v: boolean) {
  if (v) sessionStorage.setItem(OPERATOR_KEY, "true");
  else sessionStorage.removeItem(OPERATOR_KEY);
}
