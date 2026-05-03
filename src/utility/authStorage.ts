import { SessionDTO } from '../interface';
import { isNotNullish } from './null.util';

const accessTokenKey = 'accessToken';
const refreshTokenKey = 'refreshToken';

export function persistSessionTokens(session: Pick<SessionDTO, 'accessToken' | 'refreshToken'>) {
  if (isNotNullish(session.accessToken)) {
    localStorage.setItem(accessTokenKey, session.accessToken);
  }

  if (isNotNullish(session.refreshToken)) {
    localStorage.setItem(refreshTokenKey, session.refreshToken);
  }
}

export function clearSessionTokens() {
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(refreshTokenKey);
}

export function getStoredAccessToken() {
  return localStorage.getItem(accessTokenKey);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(refreshTokenKey);
}
