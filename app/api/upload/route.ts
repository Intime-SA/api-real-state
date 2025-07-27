import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

// Configurar cliente S3 para R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || ''
  }
})

// Nombre del bucket
const BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME || ''
// URL base del Worker que sirve las imágenes
const CDN_URL = process.env.CLOUDFLARE_CDN_URL || ''

export async function POST(request: NextRequest) {
  try {
    // Obtener el archivo del FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json({ message: 'No se proporcionó ningún archivo' }, { status: 400 })
    }

    // Generar un nombre único para el archivo
    const fileExt = file.name.split('.').pop() || 'jpg'
    const uniqueFilename = `${uuidv4()}.${fileExt}`
    const webpFilename = uniqueFilename.replace(`.${fileExt}`, '.webp')
    
    // Convertir el archivo a un buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Procesar la imagen con sharp para crear diferentes tamaños
    const originalImage = sharp(buffer)
    const metadata = await originalImage.metadata()
    
    // Crear versiones de diferentes tamaños
    const smallBuffer = await sharp(buffer)
      .resize(300, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toBuffer()
      
    const mediumBuffer = await sharp(buffer)
      .resize(600, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toBuffer()
      
    const largeBuffer = await sharp(buffer)
      .resize(1200, null, { fit: 'inside' })
      .webp({ quality: 80 })
      .toBuffer()
      
    const originalBuffer = await sharp(buffer)
      .webp({ quality: 85 })
      .toBuffer()
    
    // Subir cada versión a R2
    const uploadPromises = [
      uploadToR2(smallBuffer, `small/${webpFilename}`, 'image/webp'),
      uploadToR2(mediumBuffer, `medium/${webpFilename}`, 'image/webp'),
      uploadToR2(largeBuffer, `large/${webpFilename}`, 'image/webp'),
      uploadToR2(originalBuffer, `original/${webpFilename}`, 'image/webp')
    ]
    
    
    await Promise.all(uploadPromises)
    
    // Construir las URLs para cada tamaño
    const smallUrl = `${CDN_URL}/small/${webpFilename}`
    const mediumUrl = `${CDN_URL}/medium/${webpFilename}`
    const largeUrl = `${CDN_URL}/large/${webpFilename}`
    const originalUrl = `${CDN_URL}/original/${webpFilename}`
    
    // Devolver las URLs en el formato exacto que espera la función uploadImageToR2
    return NextResponse.json({
      filename: webpFilename,
      originalUrl,
      sizes: {
        small: smallUrl,
        medium: mediumUrl,
        large: largeUrl,
        original: originalUrl
      }
    })
    
  } catch (error) {
    console.error('Error al procesar o subir la imagen:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}

// Función auxiliar para subir a R2
async function uploadToR2(buffer: Buffer, key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000'
  })
  
  return s3Client.send(command)
}