export const getImageName = (imageUrl: string): string => {
  return imageUrl.split('r2.cloudflarestorage.com/')[1].split('?')[0];
}