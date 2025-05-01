import { useCallback } from 'react';
import Api from '../api/api';
import { ExtraFetchOptions, fetchEndpoint } from '../api/useFetch';
import { GenerateTokenDTO, LoginDTO, ValidateTokenDTO } from '../interface';
import { useAppDispatch } from '../store/hooks';
import { logout, updateUser } from '../store/slices/auth';
import { isNullish } from '../utility/null.util';

export const useLogin = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();

  const login = useCallback(
    async (data: LoginDTO) => {
      const response = await fetchEndpoint(Api.auth_PostLogin, { body: data }, { ...options, redirectOn401: false });

      if (isNullish(response) || typeof response === 'string') {
        return response ?? 'An error occurred while logging in';
      }

      dispatch(updateUser(response));
      return true;
    },
    [dispatch, options]
  );

  return login;
};

export const useCheckLogin = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();

  const checkLogin = useCallback(async () => {
    const response = await fetchEndpoint(Api.auth_GetProfile, {}, { ...options });

    if (isNullish(response) || typeof response === 'string') {
      return false;
    }

    await dispatch(updateUser({ ...response }));
    return true;
  }, [dispatch, options]);

  return checkLogin;
};

export const useGenerateToken = (options?: ExtraFetchOptions) => {
  const generateToken = useCallback(
    async (data: GenerateTokenDTO): Promise<string | true> => {
      const response = await fetchEndpoint(
        Api.auth_token_PostGenerateToken,
        { body: data },
        { ...options, redirectOn401: false }
      );

      if (isNullish(response) || typeof response === 'string') {
        return response ?? 'An error occurred while generating token';
      }

      return true;
    },
    [options]
  );

  return generateToken;
};

export const useLoginWithToken = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();

  const loginWithToken = useCallback(
    async (data: ValidateTokenDTO) => {
      const response = await fetchEndpoint(
        Api.auth_token_PostValidateToken,
        { body: data },
        { ...options, redirectOn401: false }
      );

      if (isNullish(response) || typeof response === 'string') {
        return response ?? 'An error occurred while validating token';
      }

      dispatch(updateUser(response));
      return true;
    },
    [dispatch, options]
  );

  return loginWithToken;
};

export const useLogout = () => {
  const dispatch = useAppDispatch();

  const logoutCallback = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return logoutCallback;
};
