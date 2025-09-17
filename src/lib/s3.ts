import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
  }
});

export async function uploadPdfToS3(file: Blob, fileName: string): Promise<string> {
  console.log('PDF Blob size:', file.size);
  if (file.size == 0) {
    throw new Error('Generated PDF is empty');
  }

  // Convert Blob to Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const params = {
    Bucket: import.meta.env.VITE_S3_BUCKET,
    Key: `art-prints/${fileName}-${Date.now()}.pdf`,
    Body: uint8Array, // Use Uint8Array instead of Blob
    ContentType: 'application/pdf'
  };

  await s3Client.send(new PutObjectCommand(params));
  return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
}