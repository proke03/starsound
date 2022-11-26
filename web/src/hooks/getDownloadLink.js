import { version } from '../../package.json'
import { getOS } from '@/utils/getOS'

export const getDownloadLink = () => {
  const os = getOS()
  if (os === 'Windows')
    return `https://github.com/proke03/starsound/releases/download/${version}/Starsound-Setup-${version}.exe`
  else if (os === 'Mac OS')
    return `https://github.com/proke03/starsound/releases/download/${version}/Starsound-${version}.dmg`
  else if (os === 'Linux')
    return `https://github.com/proke03/starsound/releases/download/${version}/Starsound-${version}.AppImage`
}
