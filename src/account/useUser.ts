import { useCallback } from 'react';
import Api from '../api/api';
import { ExtraFetchOptions, fetchEndpoint } from '../api/useFetch';
import { UserDTO } from '../interface';
import { useAppDispatch } from '../store/hooks';
import { updateUserDetails } from '../store/slices/auth';
import { isNullish } from '../utility/null.util';

export const useAddUser = (options?: ExtraFetchOptions) => {
  const addUser = useCallback(
    async (data: UserDTO): Promise<true | string> => {
      const response = await fetchEndpoint(Api.user_Post, { body: data }, options);
      if (isNullish(response) || typeof response === 'string') {
        return response ?? 'An error occurred while creating account';
      }

      return true;
    },
    [options]
  );

  return addUser;
};

export const useGetUser = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();

  const getUser = useCallback(async (): Promise<UserDTO | string> => {
    const response = await fetchEndpoint(Api.user_Get, {}, options);
    if (isNullish(response) || typeof response === 'string') {
      return response ?? 'An error occurred while fetching account details';
    }

    await dispatch(updateUserDetails(response));
    return response;
  }, [dispatch, options]);

  return getUser;
};

export const useUpdateUser = (options?: ExtraFetchOptions) => {
  const dispatch = useAppDispatch();

  const checkLogin = useCallback(
    async (data: UserDTO) => {
      const response = await fetchEndpoint(Api.user_Put, { body: data }, { ...options });

      if (isNullish(response) || typeof response === 'string') {
        return response ?? 'An error occurred while updating account details';
      }

      await dispatch(updateUserDetails(response));
      return response;
    },
    [dispatch, options]
  );

  return checkLogin;
};
