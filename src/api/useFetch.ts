/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IdToken, useAuth0 } from '@auth0/auth0-react';
import { useEffect, useMemo, useState } from 'react';
import { isNotNullish } from '../utility/null.util';
import Rest from './index';

type GetMethods<T> = {
  [P in keyof T]: T[P] extends { method: 'GET'; response: Array<any> } | { method: 'GET'; response: {} } ? P : never;
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
async function fetchRequest<T>(accessToken: IdToken, url: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body = undefined } = options;

  const response = await fetch(url, {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: `Bearer ${accessToken.__raw}`
    }),
    body: isNotNullish(body) ? JSON.stringify(body) : body
  });

  if (response.status === 401) {
    /**
     * In the case of a UNAUTHORIZED status, reload the page to prompt for login.
     */
    window.location.reload();
    return undefined as any;
  }

  if (response.status === 204) {
    /*
		In the case of a NO CONTENT status, we can't call response.json() because it throws an error
		if there is no response. We've got to cast this here because we don't know at compile time that
		T is undefined. If we're calling this method and get a 204, we can assume this is intentional T is undefined.
		 */
    return undefined as any;
  }

  if (!response.ok) {
    return undefined as any;
  }

  return response.json();
}

/**
 * @param endpoint string combination of the http method (in caps) colon and the url with params
 * @param request object with maps of all params
 *
 * Fetch endpoint either takes options with no error handler and returns the response type,
 * or takes options with an error handler and returns a union of the response type and the
 * error handler return type
 */
function fetchEndpoint(accessToken?: IdToken) {
  return async <T extends keyof Rest>(
    endpoint: T,
    options: Rest[T]['request']
  ): Promise<Rest[T]['response'] | undefined> => {
    if (!accessToken) {
      return Promise.resolve(undefined);
    }

    const { body = undefined, params = {}, query = undefined } = options as any;
    // eslint-disable-next-line prefer-const
    let [method, url] = (endpoint as string).split(':') as [METHOD, string];
    url = `${process.env.REACT_APP_API_URL}${url}`;
    if (params) {
      Object.keys(params).forEach((param) => {
        url = url.replace(`{${param}}`, (params as any)[param]);
      });
    }
    if (query) {
      url += getQueryString(query);
    }

    return fetchRequest(accessToken, url, { body, method });
  };
}

export type QueryValues = string | boolean | number | undefined | null;
export type QueryMap = Record<string, QueryValues | QueryValues[]>;

export default function useFetch() {
  const [accessToken, setAccessToken] = useState<IdToken>();

  const { getIdTokenClaims } = useAuth0();

  useEffect(() => {
    let alive = true;

    const getAccessToken = async () => {
      const newAccessToken = await getIdTokenClaims();

      if (alive) {
        setAccessToken(newAccessToken);
      }
    };

    getAccessToken();

    return () => {
      alive = false;
    };
  }, [getIdTokenClaims]);

  const fetchCall = useMemo(() => fetchEndpoint(accessToken), [accessToken]);

  return fetchCall;
}
