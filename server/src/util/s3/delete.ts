import r2 from '@/config/s3.config'
import { getImageName } from '../text';

export const deleteImageFileSingle = (imageUrl: string) => {
  //FIXME: id 잘라내는 거 이게 최선일까?
  const key = getImageName(imageUrl)
  r2.deleteObject({
    Bucket: process.env.R2_BUCKET,
    Key: key,
  }, (err, data) => {
    if(err) { throw err; }
    console.log(data);
  })
}