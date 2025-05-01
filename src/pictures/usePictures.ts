import { useCallback, useEffect, useMemo } from 'react';
import Api from '../api/api';
import { fetchEndpoint } from '../api/useFetch';
import { Picture, fromPictureDTO, toPictureDTO } from '../interface';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPicture, updatePicture } from '../store/slices/pictures';

export const useAddPicture = () => {
  const addPicture = useCallback(async (data: Omit<Picture, '_id'>) => {
    const response = await fetchEndpoint(Api.picture_Post, {
      body: toPictureDTO(data)
    });

    if (!response || typeof response === 'string') {
      return undefined;
    }

    return fromPictureDTO(response);
  }, []);

  return addPicture;
};

export const useRemovePicture = () => {
  const removePicture = useCallback(async (pictureId: string) => {
    const response = await fetchEndpoint(Api.picture_IdDelete, {
      params: {
        pictureId
      }
    });

    if (!response || typeof response === 'string') {
      return undefined;
    }

    return fromPictureDTO(response);
  }, []);

  return removePicture;
};

export function usePicture(pictureId: string | undefined) {
  const dispatch = useAppDispatch();
  const pictureDto = useAppSelector(selectPicture);
  const picture = useMemo(() => (pictureDto ? fromPictureDTO(pictureDto) : undefined), [pictureDto]);

  useEffect(() => {
    if (pictureId === undefined) {
      return () => {};
    }

    let alive = true;

    const getPicturesCall = async () => {
      const data = await fetchEndpoint(Api.picture_IdGet, {
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
  }, [dispatch, pictureId]);

  return picture;
}
