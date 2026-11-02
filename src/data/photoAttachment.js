const MAX_UPLOAD_BYTES = 10 * 1024 * 1024
const MAX_STORED_IMAGE_BYTES = 350 * 1024

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Unable to compress this image. You can still submit without a photo.'))
    }, 'image/jpeg', quality)
  })
}

function readBlob(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Unable to prepare this image for local storage.'))
    }
    reader.onerror = () => reject(new Error('Unable to read this image. You can still submit without a photo.'))
    reader.readAsDataURL(blob)
  })
}

export async function createCompressedPhoto(file) {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.')
  }
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('The image must be smaller than 10 MB.')
  if (typeof createImageBitmap !== 'function') {
    throw new Error('Image compression is not supported in this browser. You can still submit without a photo.')
  }

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error('Unable to open this image. Try another JPG, PNG, or WebP file.')
  }

  try {
    const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))
    const context = canvas.getContext('2d')

    if (!context) throw new Error('Unable to prepare this image. You can still submit without a photo.')
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    for (const quality of [0.76, 0.62, 0.48, 0.4]) {
      const blob = await canvasToBlob(canvas, quality)
      if (blob.size <= MAX_STORED_IMAGE_BYTES) {
        return { name: file.name, type: 'image/jpeg', dataUrl: await readBlob(blob), size: blob.size }
      }

      canvas.width = Math.max(1, Math.round(canvas.width * 0.75))
      canvas.height = Math.max(1, Math.round(canvas.height * 0.75))
      canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    }
  } finally {
    bitmap.close()
  }

  throw new Error('This image is too large to store in the local demo. Try a smaller image.')
}
