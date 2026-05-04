import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchEndpoint } from './useFetch';
import { store } from '../store';
import * as authStorage from '../utility/authStorage';

const originalFetch = globalThis.fetch;

describe('fetchEndpoint auth refresh flow', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('refreshes the access token and retries the original request after a 401', async () => {
    localStorage.setItem('refreshToken', 'refresh-token');
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const persistSpy = vi.spyOn(authStorage, 'persistSessionTokens');

    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ accessToken: 'new-access-token' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ userId: 'user-1', email: 'user@example.com', firstName: 'Test', lastName: 'User' }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ status: 'success' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      ) as typeof fetch;

    const result = await fetchEndpoint(
      'POST:/auth/token/generate',
      { body: { email: 'user@example.com' } },
      { redirectOn401: false }
    );

    expect(result).toEqual({ status: 'success' });
    expect(persistSpy).toHaveBeenCalledWith({ accessToken: 'new-access-token' });
    expect(dispatchSpy).toHaveBeenCalled();
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
  });

  it('clears stored tokens when refresh fails', async () => {
    localStorage.setItem('accessToken', 'old-access-token');
    localStorage.setItem('refreshToken', 'refresh-token');
    const clearSpy = vi.spyOn(authStorage, 'clearSessionTokens');

    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Bad refresh token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      ) as typeof fetch;

    const result = await fetchEndpoint(
      'POST:/auth/token/generate',
      { body: { email: 'user@example.com' } },
      { redirectOn401: false }
    );

    expect(result).toBe('Unauthorized');
    expect(clearSpy).toHaveBeenCalled();
  });

  it('does not attempt refresh with an empty stored refresh token', async () => {
    localStorage.setItem('accessToken', '');
    localStorage.setItem('refreshToken', '');
    const clearSpy = vi.spyOn(authStorage, 'clearSessionTokens');

    globalThis.fetch = vi.fn().mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    ) as typeof fetch;

    const result = await fetchEndpoint('GET:/auth/profile', {}, { redirectOn401: false });

    expect(result).toBe('Unauthorized');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.not.objectContaining({
          authorization: 'Bearer '
        })
      })
    );
    expect(clearSpy).toHaveBeenCalled();
  });
});
