/* eslint-disable compat/compat */
export default function generateThumbnail(
  dataUrl: string,
  boundBox: { width: number; height: number }
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  return new Promise<string>((resolve) => {
    img.onload = function () {
      const scaleRatio = Math.min(boundBox.width, boundBox.height) / Math.max(img.width, img.height);
      const w = img.width * scaleRatio;
      const h = img.height * scaleRatio;
      canvas.width = w;
      canvas.height = h;
      ctx?.drawImage(img, 0, 0, w, h);
      return resolve(canvas.toDataURL());
    };
    img.src = dataUrl;
  });
}
