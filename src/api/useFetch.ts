import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectAccessToken } from '../store/slices/auth';
import { isNotNullish } from '../utility/null.util';
import Rest from './index';
import hash from 'object-hash';

type GetMethods<T> = {
  [P in keyof T]: T[P] extends
    | { method: 'GET'; response: Array<any> }
    | { method: 'GET'; response: Record<string, never> }
    ? P
    : never;
}[keyof T];

export type RestCollectionKeys = GetMethods<Rest>;
export type RestCollectionEndpoints = Pick<Rest, RestCollectionKeys>;

type METHOD = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'get' | 'post' | 'put' | 'delete';

export interface FetchOptions {
  method?: METHOD;
  body?: BodyInit | null | undefined;
}

/**
 * @return if the fetchOptions have a query parameter
 */
export function hasQueryParams(fetchOptions: FetchOptions): fetchOptions is FetchOptions & { query: QueryMap } {
  return Boolean(fetchOptions && (fetchOptions as any).query);
}
/**
 * Converts an object to a query param string. Array properties are converted
 * into repeated params.
 */
export function getQueryString(query: QueryMap) {
  const keys = Object.keys(query);

  if (keys.length === 0) {
    return '';
  }

  const params: { key: string; value: QueryValues }[] = [];

  keys.forEach((key) => {
    const queryValue = query[key];
    if (Array.isArray(queryValue)) {
      queryValue.forEach((value) => params.push({ key, value }));
    } else {
      params.push({ key, value: queryValue });
    }
  });

  const queryString = params
    .filter(({ value }) => value != null)
    .map(({ key, value }) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
    .join('&');

  return queryString ? `?${queryString}` : '';
}

/**
 * Checks to see if all of the values in a query parameter object are empty
 */
export function areValuesEmpty(fields: Record<string, QueryValues>) {
  return !Object.keys(fields).some((name) => Boolean(fields[name]));
}

/**
 * Simple fetch wrapper to get JSON REST API
 */
async function fetchRequest<T>(
  accessToken: string | undefined,
  url: string,
  options: FetchOptions = {},
  extraOptions?: ExtraFetchOptions
): Promise<T | string | undefined> {
  const { method = 'GET', body = undefined } = options;

  const headers = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });

  if (isNotNullish(accessToken)) {
    headers.set('authorization', `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: isNotNullish(body) ? JSON.stringify(body) : body
    });

    if (response.status === 401) {
      /**
       * In the case of a UNAUTHORIZED status, reload the page to prompt for login.
       */
      localStorage.removeItem('token');
      if (extraOptions?.redirectOn401 === true) {
        window.location.reload();
      }

      const errorBody = await response.json();
      return errorBody.message as string | undefined;
    }

    if (response.status === 204) {
      /*
		In the case of a NO CONTENT status, we can't call response.json() because it throws an error
		if there is no response. We've got to cast this here because we don't know at compile time that
		T is undefined. If we're calling this method and get a 204, we can assume this is intentional T is undefined.
		 */
      return undefined;
    }

    if (!response.ok) {
      const errorBody = await response.json();
      return errorBody.message as string | undefined;
    }

    return response.json();
  } catch (_e: unknown) {
    return 'Failed to communicate with server';
  }
}

const getRequestsInProgress: Record<string, ((value: any | undefined) => void)[]> = {};
const getDataCache: Record<string, { date: Date; data: any }> = {};
const CACHE_TIME = 5000;

export interface ExtraFetchOptions {
  force?: boolean;
  accessToken?: string;
  redirectOn401?: boolean;
}

/**
 * @param endpoint string combination of the http method (in caps) colon and the url with params
 * @param request object with maps of all params
 *
 * Fetch endpoint either takes options with no error handler and returns the response type,
 * or takes options with an error handler and returns a union of the response type and the
 * error handler return type
 */
function fetchEndpoint(accessToken?: string) {
  return async <T extends keyof Rest>(
    endpoint: T,
    options: Rest[T]['request'],
    extraOptions?: ExtraFetchOptions
  ): Promise<Rest[T]['response'] | string | undefined> => {
    const { force = false } = extraOptions ?? {};

    const { body = undefined, params = {}, query = undefined } = options as any;
    // eslint-disable-next-line prefer-const
    let [method, url] = (endpoint as string).split(':') as [METHOD, string];
    url = `${import.meta.env.VITE_API_URL}${url}`;
    if (params) {
      Object.keys(params).forEach((param) => {
        url = url.replace(`{${param}}`, (params as any)[param]);
      });
    }
    if (query) {
      url += getQueryString(query);
    }

    if (method.toLowerCase() === 'get') {
      const dataCacheKey = hash({
        url,
        options
      });

      if (
        !force &&
        dataCacheKey in getDataCache &&
        new Date().getTime() - getDataCache[dataCacheKey].date.getTime() < CACHE_TIME
      ) {
        return Promise.resolve(undefined);
      }

      if (dataCacheKey in getRequestsInProgress) {
        return Promise.resolve(undefined);
      }

      const p = new Promise<Rest[T]['response'] | undefined>((resolve) => {
        getRequestsInProgress[dataCacheKey] = [resolve];
      });

      fetchRequest<Rest[T]['response'] | undefined>(
        extraOptions?.accessToken ?? accessToken,
        url,
        {
          body,
          method
        },
        extraOptions
      ).then((response) => {
        getDataCache[dataCacheKey] = {
          date: new Date(),
          data: response
        };
        const resolveFunctions = getRequestsInProgress[dataCacheKey];
        resolveFunctions.forEach((resolveFunction) => resolveFunction(response));
        delete getRequestsInProgress[dataCacheKey];
      });

      return p;
    }

    return fetchRequest(extraOptions?.accessToken ?? accessToken, url, { body, method }, extraOptions);
  };
}

export type QueryValues = string | boolean | number | undefined | null;
export type QueryMap = Record<string, QueryValues | QueryValues[]>;

export default function useFetch() {
  const accessToken = useAppSelector(selectAccessToken);
  return useMemo(() => fetchEndpoint(accessToken), [accessToken]);
}
