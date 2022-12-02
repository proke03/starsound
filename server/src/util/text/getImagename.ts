export const getImageName = (imageUrl: string): string => {
  let result;
  if(imageUrl.split('r2.cloudflarestorage.com/')[1])
    result = imageUrl.split('r2.cloudflarestorage.com/')[1].split('?')[0]
  else if(imageUrl.split('.r2.dev/')[1])
    result = imageUrl.split('.r2.dev/')[1].split('.')[0]
  return result;
}