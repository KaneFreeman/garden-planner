import { useCallback, useEffect, useMemo } from 'react';
import Api from '../api/api';
import useFetch from '../api/useFetch';
import { Picture, fromPictureDTO, toPictureDTO } from '../interface';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPicture, updatePicture } from '../store/slices/pictures';

export const useAddPicture = () => {
  const fetch = useFetch();

  const addPicture = useCallback(
    async (data: Omit<Picture, '_id'>) => {
      const response = await fetch(Api.picture_Post, {
        body: toPictureDTO(data)
      });

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromPictureDTO(response);
    },
    [fetch]
  );

  return addPicture;
};

export const useRemovePicture = () => {
  const fetch = useFetch();

  const removePicture = useCallback(
    async (pictureId: string) => {
      const response = await fetch(Api.picture_IdDelete, {
        params: {
          pictureId
        }
      });

      if (!response || typeof response === 'string') {
        return undefined;
      }

      return fromPictureDTO(response);
    },
    [fetch]
  );

  return removePicture;
};

export function usePicture(pictureId: string | undefined) {
  const fetch = useFetch();
  const dispatch = useAppDispatch();
  const pictureDto = useAppSelector(selectPicture);
  const picture = useMemo(() => (pictureDto ? fromPictureDTO(pictureDto) : undefined), [pictureDto]);

  useEffect(() => {
    if (pictureId === undefined) {
      return () => {};
    }

    let alive = true;

    const getPicturesCall = async () => {
      const data = await fetch(Api.picture_IdGet, {
        params: {
          pictureId
        }
      });

      if (alive && data && typeof data !== 'string') {
        dispatch(updatePicture(data));
      }
    };

    getPicturesCall();

    return () => {
      alive = false;
    };
  }, [dispatch, fetch, pictureId]);

  return picture;
}
