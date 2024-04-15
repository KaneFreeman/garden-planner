import { useCallback } from 'react';
import Api from '../api/api';
import useFetch, { ExtraFetchOptions } from '../api/useFetch';
import { CreateUserDTO, LoginDTO } from '../interface';
import { useAppDispatch } from '../store/hooks';
import { updateUser } from '../store/slices/auth';
import { isNullish } from '../utility/null.util';

export const useLogin = (options?: ExtraFetchOptions) => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  const login = useCallback(
    async (data: LoginDTO) => {
      const response = await fetch(Api.auth_PostLogin, { body: data }, { ...options, redirectOn401: false });

      if (isNullish(response) || typeof response === 'string') {
        return response ?? 'An error occurred while logging in';
      }

      dispatch(updateUser(response));
      return true;
    },
    [dispatch, fetch, options]
  );

  return login;
};

export const useCheckLogin = (options?: ExtraFetchOptions) => {
  const fetch = useFetch();
  const dispatch = useAppDispatch();

  const checkLogin = useCallback(
    async (accessToken: string) => {
      const response = await fetch(Api.auth_GetProfile, {}, { ...options, accessToken });

      if (isNullish(response) || typeof response === 'string') {
        return false;
      }

      await dispatch(updateUser({ ...response, accessToken }));
      return true;
    },
    [dispatch, fetch, options]
  );

  return checkLogin;
};

export const useSignUp = (options?: ExtraFetchOptions) => {
  const fetch = useFetch();

  const signUp = useCallback(
    async (data: CreateUserDTO): Promise<true | string> => {
      const response = await fetch(Api.user_Post, { body: data }, options);
      if (isNullish(response) || typeof response === 'string') {
        return response ?? 'An error occurred while creating account';
      }

      return true;
    },
    [fetch, options]
  );

  return signUp;
};
