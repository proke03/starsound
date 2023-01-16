export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// Since only MB units are used, I didn't modify the above function for this.
export function formatBytesToMB(bytes, decimals = 3) {
  if (bytes === 0) return '0 Bytes'

  const k = 1 / 1024
  const dm = decimals < 0 ? 0 : decimals

  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, -2)).toFixed(dm))} MB`
}